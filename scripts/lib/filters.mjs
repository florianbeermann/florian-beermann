/* Small raster helpers shared by the portrait generators. */

/** Separable box blur, three passes, clamped at the edges.
 *
 * Three passes approximate a gaussian closely enough for this work and stay
 * O(n) per pass. Edges clamp rather than wrap so a blur never drags the dark
 * stage across the sitter.
 */
export function boxBlur2d(src, w, h, radius) {
  let buf = Float64Array.from(src);
  const tmpBuf = new Float64Array(w * h);
  const pass = (input, output, width, height, stride, step) => {
    const span = radius * 2 + 1;
    for (let line = 0; line < height; line++) {
      const base = line * stride;
      for (let i = 0; i < width; i++) {
        let sum = 0;
        for (let k = -radius; k <= radius; k++) {
          const j = Math.min(width - 1, Math.max(0, i + k));
          sum += input[base + j * step];
        }
        output[base + i * step] = sum / span;
      }
    }
  };
  for (let n = 0; n < 3; n++) {
    pass(buf, tmpBuf, w, h, w, 1); // rows
    pass(tmpBuf, buf, h, w, 1, w); // columns
  }
  return buf;
}

export const smoothstep = (t) => t * t * (3 - 2 * t);

/* The matte both generators use, as a union of feathered ellipses given in
 * source-image coordinates.
 *
 * Nothing tonal can separate the sitter from the stage: the navy sweater and
 * the unlit backdrop sit at the same luminance, while the two lit screens and
 * the Microsoft logo are *brighter* than his face and so come out denser than
 * he does wherever the ramp is inverted. Focus cannot do it either, tempting as
 * it looks on a portrait shot wide open — at the resolution either generator
 * works at, the logo and the screen edges carry more local detail than his
 * sweater does, so a sharpness matte keeps the stage and drops the body. That
 * was built and measured; it failed that way.
 *
 * Geometry is what is left, and geometry is enough, because the sitter does not
 * move. `floor` clamps the tail of the feather off before it reaches the lit
 * screens and rescales the rest, which keeps a soft edge without keeping a halo.
 */
export function bustMatte({ fx, fy, shapes, feather, floor }) {
  let best = 0;
  for (const s of shapes) {
    const d = Math.hypot((fx - s.cx) / s.rx, (fy - s.cy) / s.ry);
    const t = d <= 1 - feather ? 1 : d >= 1 ? 0 : (1 - d) / feather;
    best = Math.max(best, smoothstep(t));
  }
  return Math.max(0, (best - floor) / (1 - floor));
}
