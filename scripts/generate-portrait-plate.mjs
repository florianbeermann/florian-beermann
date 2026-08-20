/* Tints the hero portrait into the page's ink.
 *
 *   npm run portrait
 *
 * Runs by hand, not in `npm run build`. The output is committed, so a visitor
 * pays for one image and nothing else.
 *
 * This does one thing: it takes the photograph exactly as shot — full frame,
 * background included, nothing cut out or composited — and prints it in one
 * * ink. Luminance is remapped onto a ramp from the page's plum to a light tint of
 * the same hue — a duotone in the literal sense: the plum is the ink, that tint
 * is the sheet, and every tone in the picture is some coverage of one on the
 * other.
 *
 * That is the whole treatment, and the restraint is deliberate. Two earlier
 * versions of this plate did more: one rendered the sitter as ASCII, the other
 * segmented him off the stage and dropped him on a chartreuse panel. Both were
 * answers to a real question — a photograph in a system of flat inks and
 * hairlines looks imported — but both answered it by rebuilding the picture,
 * and a rebuilt picture fails in ways a photographer can see and a matte cannot
 * fix. The tint solves the same problem without touching the frame: the navy
 * sweater and the blue stage light stop being colours the palette does not own,
 * and the composition stays exactly the one that was shot.
 *
 * The source is already a black-and-white master, so this is a tint and not a
 * conversion. Keep it that way — regrading a colour original here would put the
 * photographer's decisions in this file, where they do not belong.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { decodePng, encodePng } from "./lib/png.mjs";

const SOURCE = "scripts/assets/portrait-source.jpg";
const OUTPUT = "public/portrait-plate.jpg";

/* The two ends of the duotone.

   The dark end is the page's ink exactly, so the deepest shadow in the frame is
   the same plum the type is set in.

   The light end is *not* the page's ivory, and that is the whole reason this
   reads as plum rather than as sepia. `--paper` is a faintly green off-white
   (90°), so a ramp from the plum to it is a split-tone pulling in two opposite
   directions: the shadows go warm, the highlights go cool, and the two cancel
   into a neutral grey across the midtones where a face lives. Ending on a light
   value that carries the plum's own hue keeps one colour through the entire
   range.

   This is only available because the photograph keeps its own background. When
   the plate was a cutout its light end had to match the ground it sat on; a
   full frame answers to nothing but itself. Keep the dark end in step with
   `--ink` in src/styles/shell.css. */
const INK = [0x50, 0x3d, 0x42];
const LIGHT = [0xf2, 0xe7, 0xe9];

/* Black and white points, as percentiles of the frame. The master is already
   graded, so these only trim the extreme tails — enough to put the deepest
   shadow on the ink exactly and the brightest highlight on the light end, which
   is what makes the duotone span its full range instead of sitting inside it. */
const BLACK_POINT = 0.005;
const WHITE_POINT = 0.995;

/* The ceiling on the light end. Left to reach paper, the lit forehead and the
   crown clip to the ground colour and the head loses its modelling. Holding the
   top of the ramp just short of the sheet keeps ink in the highlight so the
   skull still turns. */
const HIGHLIGHT = 0.97;

const lerp = (a, b, t) => a + (b - a) * t;

const dir = mkdtempSync(join(tmpdir(), "portrait-"));
try {
  const png = join(dir, "in.png");
  execFileSync("sips", ["-s", "format", "png", SOURCE, "--out", png], { stdio: "pipe" });
  const src = decodePng(readFileSync(png));

  const luma = new Float32Array(src.w * src.h);
  for (let i = 0; i < luma.length; i++) {
    const p = i * src.channels;
    luma[i] =
      (0.2126 * src.px[p] + 0.7152 * src.px[p + 1] + 0.0722 * src.px[p + 2]) / 255;
  }

  const sorted = Float32Array.from(luma).sort();
  const black = sorted[Math.floor(sorted.length * BLACK_POINT)];
  const white = sorted[Math.floor(sorted.length * WHITE_POINT)];

  const rgb = Buffer.alloc(src.w * src.h * 3);
  for (let i = 0; i < luma.length; i++) {
    const t =
      Math.min(1, Math.max(0, (luma[i] - black) / (white - black))) * HIGHLIGHT;
    for (let c = 0; c < 3; c++) {
      rgb[i * 3 + c] = Math.round(lerp(INK[c], LIGHT[c], t));
    }
  }

  const out = join(dir, "out.png");
  writeFileSync(out, encodePng(src.w, src.h, rgb));
  execFileSync("sips", [
    "-s", "format", "jpeg", "-s", "formatOptions", "82", out, "--out", OUTPUT,
  ], { stdio: "pipe" });

  const kb = (statSync(OUTPUT).size / 1024).toFixed(0);
  console.log(`${OUTPUT} — ${src.w}×${src.h}, ${kb} KB`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
