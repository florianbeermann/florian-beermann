/* Renders the portrait photograph as a two-colour halftone plate.
 *
 * The site ships no continuous-tone photography. Where the ASCII plate in the
 * hero renders the sitter as type, this renders him as print: a rotated dot
 * screen in the page's two inks, which is what a newspaper would have done with
 * the same photograph. It is the treatment the reference site uses on its
 * imagery, done the way the rest of this system is done — committed output, no
 * runtime cost, no dependency.
 *
 *   npm run halftone
 *
 * Runs by hand, not in `npm run build`. Shells out to macOS `sips` to get a PNG
 * it can decode without a library.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { decodePng, encodePng } from "./lib/png.mjs";
import { boxBlur2d, bustMatte } from "./lib/filters.mjs";

const SOURCE = "scripts/assets/portrait-source.jpg";
/* Two cuts, because a duotone plate only works on the ground it was screened
   for. The default is ink on paper; the inverted one is paper on ink, for the
   blue surfaces — dropping the first onto blue would print blue dots on blue. */
const OUTPUTS = [
  { path: "scripts/assets/portrait-halftone.png", invert: false },
  { path: "scripts/assets/portrait-halftone-inverted.png", invert: true },
];

/* Output size. Big enough that the social card can crop into it without the
   dots going soft, small enough that the committed file stays reasonable. */
const WIDTH = 900;

/* Head, shoulders and chest — the same bust the ASCII plate uses, so the two
   renderings are recognisably the same photograph. */
const CROP = { x0: 0.12, x1: 0.90, y0: 0.15, y1: 0.88 };

/* The two inks. Paper is the ground, ink is the dot. */
const PAPER = [0xf3, 0xf0, 0xe8];
const INK = [0x20, 0x2f, 0xd6];

/* Screen pitch in output pixels — the distance between dot centres — and the
   angle the grid is rotated to.
   
   45° is not decorative. An unrotated screen puts its dots on the same axes as
   the image's own structure, and the two interfere into visible banding; at 45°
   the grid is maximally out of phase with horizontal and vertical detail, which
   is why every duotone screen in print is set there. It also happens to be the
   angle at which a grid of dots reads least like a grid. */
const PITCH = 7;
const ANGLE = Math.PI / 4;

/* How large a dot may get, as a multiple of the pitch. Above ~0.72 neighbouring
   dots in the darkest areas merge into a solid mass and the screen stops
   reading as a screen; below ~0.6 the darkest tone is too light to anchor the
   image. */
const MAX_DOT = 0.7;

/* Tone before screening, and the two-zone split it needs.
   
   A halftone has far more levels available than a ten-step character ramp, so
   it is tempting to think one curve can span the whole sitter here even though
   it could not for the ASCII plate. It cannot. The problem was never the number
   of levels — it is that his lit face sits near 0.5 luminance and the navy
   sweater near 0.13, so a single curve spends most of its range getting from
   one to the other and leaves the face flat and the body bare. Built that way
   first; the head came out as one solid mass of full-size dots and the sweater
   as almost nothing.
   
   So head and body are metered separately and blended across the collar, with
   the body held under a ceiling so he still reads as lit from the front. */
/* The body gets its own white point as well as its own black point. Its zone
   runs from the collar down, so its top percentiles are lit *neck skin*, not
   sweater — metered at the same 96% the face uses, the whole garment collapses
   into the smallest dots on the screen. Metering it lower puts the white point
   on a bright fold of knit, which is what the sweater should actually be
   printing against. */
const CLIP = { lo: 0.05, hi: 0.96, bodyLo: 0.012, bodyHi: 0.82 };
const GAMMA = 1.05;
const ZONES = { split: 0.585, blend: 0.075, bodyCeiling: 0.88 };

/* Unsharp mask, in output pixels. He is bald and evenly lit, so the scalp and
   forehead are very nearly one flat tone across a third of the plate and a
   straight luminance map spends most of the screen's range on skin carrying no
   information. Subtracting a blurred copy amplifies whatever differs from its
   neighbourhood — the eyebrows, eye sockets, the shadow under the nose, the
   mouth, the jaw — while leaving the uniform areas alone.
   
   As on the ASCII plate the sweater wants almost none of it: what reads as a
   body is the shoulder line and the big folds, not the weave, and pushing the
   weave only screens the sensor noise in a very dark garment. */
const LOCAL_CONTRAST = { radius: 26, amount: 0.9, bodyAmount: 0.18 };

/* The matte, in source-image coordinates: skull, then shoulders and chest.
   See `lib/filters.mjs` for why this is geometric and not tonal. */
const MASK = {
  feather: 0.26,
  floor: 0.16,
  shapes: [
    { cx: 0.485, cy: 0.375, rx: 0.215, ry: 0.185 },
    { cx: 0.52, cy: 1.02, rx: 0.52, ry: 0.62 },
  ],
};

const tmp = mkdtempSync(join(tmpdir(), "halftone-"));
const png = join(tmp, "source.png");
try {
  execFileSync(
    "sips",
    ["-s", "format", "png", "--resampleWidth", "1400", SOURCE, "--out", png],
    { stdio: "ignore" },
  );
  const img = decodePng(readFileSync(png));

  const lum = new Float64Array(img.w * img.h);
  for (let i = 0; i < lum.length; i++) {
    const o = i * img.channels;
    lum[i] = img.channels < 3
      ? img.px[o] / 255
      : (0.2126 * img.px[o] + 0.7152 * img.px[o + 1] + 0.0722 * img.px[o + 2]) / 255;
  }

  const box = {
    x0: CROP.x0 * img.w, x1: CROP.x1 * img.w,
    y0: CROP.y0 * img.h, y1: CROP.y1 * img.h,
  };
  const height = Math.round((WIDTH * (box.y1 - box.y0)) / (box.x1 - box.x0));

  /* Tone and matte are sampled per output pixel rather than per dot, so the dot
     sizes below are driven by an average over the dot's own footprint instead of
     a single point — the same reason the ASCII generator box-averages. */
  const tone = new Float64Array(WIDTH * height);
  const matte = new Float64Array(WIDTH * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const u = (x + 0.5) / WIDTH;
      const v = (y + 0.5) / height;
      const sx = box.x0 + u * (box.x1 - box.x0);
      const sy = box.y0 + v * (box.y1 - box.y0);
      tone[y * WIDTH + x] = lum[Math.min(img.h - 1, sy | 0) * img.w + Math.min(img.w - 1, sx | 0)];

      matte[y * WIDTH + x] = bustMatte({
        fx: CROP.x0 + u * (CROP.x1 - CROP.x0),
        fy: CROP.y0 + v * (CROP.y1 - CROP.y0),
        ...MASK,
      });
    }
  }

  // Source-image y for an output row, and how far into the body zone it sits.
  // The detail pass and the tone curves are both written against this so they
  // hand over at the same place and the join reads as one figure.
  const rowY = (y) => CROP.y0 + ((y + 0.5) / height) * (CROP.y1 - CROP.y0);
  const bodyMix = (y) => {
    const w = Math.min(1, Math.max(0,
      (rowY(y) - (ZONES.split - ZONES.blend)) / (2 * ZONES.blend)));
    return w * w * (3 - 2 * w); // smoothstep
  };

  const blurred = boxBlur2d(tone, WIDTH, height, LOCAL_CONTRAST.radius);
  for (let y = 0; y < height; y++) {
    const mix = bodyMix(y);
    const amount = LOCAL_CONTRAST.amount * (1 - mix) + LOCAL_CONTRAST.bodyAmount * mix;
    for (let x = 0; x < WIDTH; x++) {
      const i = y * WIDTH + x;
      tone[i] = Math.min(1, Math.max(0, tone[i] + amount * (tone[i] - blurred[i])));
    }
  }

  // One percentile pair per zone, each metered only on the cells the matte
  // keeps. Metering across both at once is what buried the sweater under the
  // black point and flattened the face against the top of the range.
  const band = (test, loClip, hiClip) => {
    const v = [];
    for (let y = 0; y < height; y++) {
      if (!test(rowY(y))) continue;
      for (let x = 0; x < WIDTH; x++) {
        const i = y * WIDTH + x;
        if (matte[i] > 0.45) v.push(tone[i]);
      }
    }
    v.sort((a, b) => a - b);
    return {
      lo: v[Math.floor(v.length * loClip)] ?? 0,
      hi: v[Math.min(v.length - 1, Math.floor(v.length * hiClip))] ?? 1,
    };
  };
  const head = band((y) => y < ZONES.split, CLIP.lo, CLIP.hi);
  const body = band((y) => y >= ZONES.split, CLIP.bodyLo, CLIP.bodyHi);

  const plates = OUTPUTS.map(({ path, invert }) => {
    const ground = invert ? INK : PAPER;
    const rgb = Buffer.alloc(WIDTH * height * 3);
    for (let i = 0; i < WIDTH * height; i++) {
      rgb[i * 3] = ground[0];
      rgb[i * 3 + 1] = ground[1];
      rgb[i * 3 + 2] = ground[2];
    }
    return { path, rgb, dot: invert ? PAPER : INK };
  });

  /* Walk the rotated screen rather than the pixel grid: step over dot centres in
     screen space, transform each back into image space, and draw there. Walking
     the image instead would mean solving for the nearest dot centre per pixel,
     which is the same arithmetic done far more times. */
  const cos = Math.cos(ANGLE), sin = Math.sin(ANGLE);
  const reach = Math.ceil((Math.abs(WIDTH * cos) + Math.abs(height * sin)) / PITCH) + 2;

  const sample = (arr, x, y) => {
    const xi = Math.min(WIDTH - 1, Math.max(0, x | 0));
    const yi = Math.min(height - 1, Math.max(0, y | 0));
    return arr[yi * WIDTH + xi];
  };

  for (let a = -reach; a <= reach; a++) {
    for (let b = -reach; b <= reach; b++) {
      // Dot centre in screen space, rotated back into image space.
      const cx = (a * cos - b * sin) * PITCH;
      const cy = (a * sin + b * cos) * PITCH;
      if (cx < -PITCH || cy < -PITCH || cx > WIDTH + PITCH || cy > height + PITCH) continue;

      const m = sample(matte, cx, cy);
      if (m <= 0.002) continue;

      // Average the tone over the cell the dot stands for, not just its centre.
      let sum = 0, n = 0;
      const half = PITCH / 2;
      for (let dy = -half; dy <= half; dy += 1) {
        for (let dx = -half; dx <= half; dx += 1) { sum += sample(tone, cx + dx, cy + dy); n++; }
      }
      const avg = sum / n;

      // Inverted, exactly as the ASCII ramp is: the lit sitter is the dense end
      // and the unlit stage falls away to bare paper.
      const mix = bodyMix(cy);
      const nHead = (avg - head.lo) / (head.hi - head.lo || 1);
      const nBody = ((avg - body.lo) / (body.hi - body.lo || 1)) * ZONES.bodyCeiling;
      const norm = Math.min(1, Math.max(0, nHead * (1 - mix) + nBody * mix));
      const density = Math.pow(norm, GAMMA) * m;
      const radius = density * MAX_DOT * PITCH * 0.5;
      if (radius < 0.16) continue;

      // Analytic coverage rather than a hard edge: a pixel's ink is how much of
      // it the disc covers, which is what keeps a 7px screen from looking
      // jagged without any supersampling.
      const r0 = Math.floor(cy - radius - 1), r1 = Math.ceil(cy + radius + 1);
      const c0 = Math.floor(cx - radius - 1), c1 = Math.ceil(cx + radius + 1);
      for (let y = Math.max(0, r0); y <= Math.min(height - 1, r1); y++) {
        for (let x = Math.max(0, c0); x <= Math.min(WIDTH - 1, c1); x++) {
          const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
          const cover = Math.min(1, Math.max(0, radius + 0.5 - d));
          if (cover <= 0) continue;
          const o = (y * WIDTH + x) * 3;
          for (const { rgb, dot } of plates) {
            for (let ch = 0; ch < 3; ch++) {
              rgb[o + ch] = Math.round(rgb[o + ch] * (1 - cover) + dot[ch] * cover);
            }
          }
        }
      }
    }
  }

  for (const { path, rgb } of plates) writeFileSync(path, encodePng(WIDTH, height, rgb));
  console.log(
    `${plates.map((p) => p.path).join("\n")} — ${WIDTH}×${height}, ${PITCH}px screen at 45°`,
  );
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
