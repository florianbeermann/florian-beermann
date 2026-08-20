/* Renders the portrait photograph as a character grid.
 *
 * The site ships no photography: the portrait is typography, like everything
 * else on the page. This runs by hand, not in `npm run build`, and its output
 * is committed — so the build stays portable even though the step below shells
 * out to macOS `sips` to get a PNG it can decode without a dependency.
 *
 *   npm run portrait
 *
 * The result is smaller than the four responsive image files it replaced, and
 * costs no image decode on the client.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { decodePng } from "./lib/png.mjs";
import { boxBlur2d, bustMatte } from "./lib/filters.mjs";

const SOURCE = "scripts/assets/portrait-source.jpg";
const OUT = "src/assets/portrait-ascii.txt";

/* Columns in the finished grid. Resolution is a trade, not a maximise: past
   roughly 120 the glyphs have to be set so small that neighbouring characters
   blur into each other and the face reads as noise, while below about 80 the
   eyes and mouth stop resolving at all.

   That ceiling is about the *head*, not the grid, so it rises with the crop.
   Now that the plate holds the whole bust the head spans about a third of the
   width instead of two thirds, and 140 columns puts roughly the same number of
   cells across his face as 108 did when the crop stopped at his collar. */
const COLS = 140;

/* Glyph advance divided by line height, which is what actually decides whether
   the head comes out round or stretched. Monospace faces are 0.6em wide, so
   this pairs with `line-height: 1.15` in the stylesheet. Change one and the
   other has to move with it. */
const CHAR_ASPECT = 0.6 / 1.15;

/* Head, shoulders and chest. The sitter fills most of the frame, so the crop
   trims the stage at the edges and stops just short of the bottom, where the
   sweater runs out of the picture with no shape left to read. */
const CROP = { x0: 0.12, x1: 0.90, y0: 0.15, y1: 0.88 };

/* The matte, as a bust: a soft ellipse over the skull and a much wider, lower
   one over the shoulders, unioned.

   Nothing tonal can do this job. The navy sweater and the unlit backdrop sit at
   the same luminance, while the two lit screens and the Microsoft logo are
   *brighter* than his face and so come out denser than he does on the inverted
   ramp. Focus cannot do it either, tempting as it looks on a portrait shot wide
   open: at cell resolution the logo and the screen edges carry more local
   detail than his sweater does, so a sharpness matte keeps the stage and drops
   the body — the exact opposite of what is wanted.

   Geometry is left, and geometry is enough, because the sitter does not move.
   Coordinates are fractions of the *source image*, not of the crop, so the two
   shapes stay pinned to him if CROP is ever retuned. The feathered edges double
   as the vignette that dissolves the portrait into its panel instead of ending
   it on a hard rectangle. */
const MASK = {
  feather: 0.26,
  /* The feather has to reach zero *before* it reaches the lit screens, or the
     tail of it prints them as a haze of full stops around the sitter. Anything
     below this is clamped off and the rest is rescaled, which keeps a soft edge
     without keeping the halo. */
  floor: 0.16,
  shapes: [
    { cx: 0.485, cy: 0.375, rx: 0.215, ry: 0.185 }, // skull and jaw
    { cx: 0.52, cy: 1.02, rx: 0.52, ry: 0.62 }, // shoulders and chest
  ],
};

/* Flattening the whole plate against a local average was the first attempt at
   this and it fails for a reason worth recording: any neighbourhood wide enough
   to tell the face from the sweater is also wide enough to flatten the face
   against itself, so the modelling that carries the likeness goes with it.

   The image is not really one subject with a wide dynamic range, it is two
   subjects stacked — a lit head above a collar, a dark garment below it — so it
   gets two tone curves and a blend across the join. `split` is where the collar
   sits in the source image and `blend` is how far either side of it the two
   curves cross over; too narrow and the seam shows as a band.

   `bodyCeiling` is what keeps this honest. Given its own curve the sweater
   would print as densely as the face, and the portrait would flatten into one
   even mass. Holding the body's output below the face's keeps him lit from the
   front — the way the photograph is — while still giving the knit enough of the
   ramp to show a neckline, a shoulder line and the folds in the sleeves. */
const ZONES = { split: 0.585, blend: 0.075, bodyCeiling: 0.79 };
/* Densest glyph first. The grid is set in paper on blue and read as a luminance
   map: the lit sitter becomes the dense end, the unlit stage falls to bare blue.
   Mapping it the other way round — ink on paper — turns the dark backdrop into a
   solid block and the face into a hole punched in it. */
const RAMP = "@%#*+=-:. ";
const GAMMA = 0.98;
/* The body's black point sits lower than the face's. The upper chest falls away
   into shadow under the chin, and clipped at the same percentile as the face it
   leaves a bare band exactly where the neck should connect the two. */
const CLIP = { lo: 0.05, hi: 0.96, bodyLo: 0.012 };

/* Unsharp mask, in cells, and the step that decides whether this reads as a
   face or as a blob. He is bald and evenly lit, so the scalp and forehead are
   very nearly one flat tone across a third of the frame — a straight luminance
   map spends most of the ramp on skin that carries no information and leaves
   two or three steps for everything that actually looks like him. Subtracting
   a blurred copy amplifies whatever differs from its neighbourhood, which is
   exactly the eyebrows, eye sockets, the shadow under the nose, the mouth and
   the jaw, while flattening the uniform areas.

   `radius` is roughly a seventh of the head's width in cells, which is the
   scale of those features; smaller starts chasing sensor noise. `amount` above
   about 1.8 starts ringing — bright haloes around the dark features.

   The sweater needs almost none of this. What reads as a body at this
   resolution is the silhouette and the big planes — shoulder line, neckline,
   the fold down a sleeve — not the weave, and pushing the weave the way the
   face is pushed just amplifies the sensor noise in a very dark garment into a
   mottle. So the amount falls away across the same collar the tone curves cross
   at, and the body is gently smoothed rather than sharpened. */
const LOCAL_CONTRAST = { radius: 7, amount: 1.35, bodyAmount: 0.28, bodySmooth: 1 };

/* ------------------------------------------------------------------- build */

const tmp = mkdtempSync(join(tmpdir(), "portrait-"));
const png = join(tmp, "source.png");
try {
  execFileSync("sips", ["-s", "format", "png", "--resampleWidth", "440", SOURCE, "--out", png], {
    stdio: "ignore",
  });
  const img = decodePng(readFileSync(png));

  const lum = new Float64Array(img.w * img.h);
  for (let i = 0; i < lum.length; i++) {
    const o = i * img.channels;
    lum[i] = img.channels <= 2
      ? img.px[o] / 255
      : (0.2126 * img.px[o] + 0.7152 * img.px[o + 1] + 0.0722 * img.px[o + 2]) / 255;
  }

  const box = {
    x0: CROP.x0 * img.w, x1: CROP.x1 * img.w,
    y0: CROP.y0 * img.h, y1: CROP.y1 * img.h,
  };
  const rows = Math.round((COLS * (box.y1 - box.y0)) / (box.x1 - box.x0) * CHAR_ASPECT);

  // Box-average rather than point-sample: each cell stands for many pixels, and
  // dropping all but one of them is what makes naive ASCII art look like static.
  const cellW = (box.x1 - box.x0) / COLS;
  const cellH = (box.y1 - box.y0) / rows;
  const cells = new Float64Array(COLS * rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < COLS; c++) {
      const sx = Math.floor(box.x0 + c * cellW);
      const ex = Math.max(sx + 1, Math.floor(box.x0 + (c + 1) * cellW));
      const sy = Math.floor(box.y0 + r * cellH);
      const ey = Math.max(sy + 1, Math.floor(box.y0 + (r + 1) * cellH));
      let sum = 0, n = 0;
      for (let y = sy; y < ey; y++) for (let x = sx; x < ex; x++) { sum += lum[y * img.w + x]; n++; }
      cells[r * COLS + c] = sum / n;
    }
  }

  // The matte is pure geometry, so it can be built before anything touches the
  // tones — and the passes below need it, to know which cells are the sitter.
  // Each cell is mapped back to its position in the source image so the shapes
  // above can be written against the photograph rather than against the crop.
  const mask = new Float64Array(COLS * rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < COLS; c++) {
      mask[r * COLS + c] = bustMatte({
        fx: CROP.x0 + ((c + 0.5) / COLS) * (CROP.x1 - CROP.x0),
        fy: CROP.y0 + ((r + 0.5) / rows) * (CROP.y1 - CROP.y0),
        ...MASK,
      });
    }
  }

  // Source-image y for a row, and how far into the body zone that row sits.
  // Both the detail pass and the tone curves are written against this, so they
  // hand over at the same place and the join reads as one figure.
  const rowY = (r) => CROP.y0 + ((r + 0.5) / rows) * (CROP.y1 - CROP.y0);
  const bodyMix = (r) => {
    const w = Math.min(1, Math.max(0,
      (rowY(r) - (ZONES.split - ZONES.blend)) / (2 * ZONES.blend)));
    return w * w * (3 - 2 * w); // smoothstep
  };

  const blurred = boxBlur2d(cells, COLS, rows, LOCAL_CONTRAST.radius);
  const softened = boxBlur2d(cells, COLS, rows, LOCAL_CONTRAST.bodySmooth);
  for (let r = 0; r < rows; r++) {
    const mix = bodyMix(r);
    const amount = LOCAL_CONTRAST.amount * (1 - mix) + LOCAL_CONTRAST.bodyAmount * mix;
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      const base = cells[i] * (1 - mix) + softened[i] * mix;
      cells[i] = Math.min(1, Math.max(0, base + amount * (base - blurred[i])));
    }
  }

  // One percentile pair per zone, each measured only on the cells the matte
  // keeps. Measuring across both at once is what buried the sweater under the
  // black point when this rendered a head and shoulders as a single subject.
  const band = (test, loClip) => {
    const v = [];
    for (let r = 0; r < rows; r++) {
      if (!test(rowY(r))) continue;
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        if (mask[i] > 0.45) v.push(cells[i]);
      }
    }
    v.sort((a, b) => a - b);
    return {
      lo: v[Math.floor(v.length * loClip)] ?? 0,
      hi: v[Math.min(v.length - 1, Math.floor(v.length * CLIP.hi))] ?? 1,
    };
  };
  const head = band((y) => y < ZONES.split, CLIP.lo);
  const body = band((y) => y >= ZONES.split, CLIP.bodyLo);

  const lines = [];
  for (let r = 0; r < rows; r++) {
    const mix = bodyMix(r);
    let line = "";
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      const nHead = (cells[i] - head.lo) / (head.hi - head.lo || 1);
      const nBody = ((cells[i] - body.lo) / (body.hi - body.lo || 1)) * ZONES.bodyCeiling;
      const norm = Math.min(1, Math.max(0, nHead * (1 - mix) + nBody * mix));
      const t = 1 - Math.pow(norm * mask[i], GAMMA); // 1 - x: dense end is the lit end
      const step = Math.min(RAMP.length - 1, Math.max(0, Math.round(t * (RAMP.length - 1))));
      line += RAMP[step];
    }
    lines.push(line.replace(/\s+$/, ""));
  }

  // `npm run portrait -- --debug` prints the matte instead of committing a
  // render, which is the only practical way to see whether the stage is being
  // rejected or the sitter is being eaten.
  if (process.argv.includes("--debug")) {
    const shades = " .:-=+*#%@";
    for (let r = 0; r < rows; r++) {
      let a = "";
      for (let c = 0; c < COLS; c++) {
        a += shades[Math.min(9, Math.floor(mask[r * COLS + c] * 9.999))];
      }
      console.log(a);
    }
    console.log(`\nmatte — ${COLS}×${rows}`);
  } else {
    writeFileSync(OUT, lines.join("\n").replace(/^\n+|\n+$/g, "") + "\n");
    console.log(`${OUT} — ${COLS}×${rows}`);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
