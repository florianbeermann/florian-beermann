/* Keeps the ASCII portrait moving.
 *
 * The reference this direction came from runs its hero image as a 3D form under
 * a dither shader: measured across the video, the page has not scrolled at all
 * between 0.05s and 1.07s and the artwork has still visibly rotated. The motion
 * is the point of it — a still dithered image reads as a texture, a moving one
 * reads as something being *rendered*, live, by an instrument.
 *
 * There is no 3D form here to rotate, only one photograph, so the movement has
 * to come from the rendering rather than from the subject. Two things run:
 *
 *   - a dissolve on arrival, where the plate assembles out of its own sparsest
 *     characters rather than fading in as a block, and
 *   - a standing wave that never stops, which walks cells a step or two along
 *     the ramp so the grid is continuously re-resolving itself.
 *
 * Neither ships a byte of new artwork. The committed grid is already a
 * quantised luminance map — each glyph *is* its own tone, an index into the
 * ramp — so the animation reads indices out of the text, perturbs them and
 * writes glyphs back. Nothing is decoded and nothing is fetched.
 */

/* Densest first, matching `RAMP` in scripts/generate-portrait-ascii.mjs. Index 0
   is the lit end of the ramp; a *higher* index is sparser and reads darker on
   the blue plate. Keep the two in step. */
const RAMP = "@%#*+=-:. ";
const BLANK = RAMP.length - 1;

/* How far a cell can be pushed along the ramp. One step is nearly invisible on
   a ten-level ramp and two is where it starts to read as the image breathing;
   past three the face itself begins to come apart. */
const WAVE_AMPLITUDE = 2;
/* Wavelength in rows, and how long one full travel takes. Slow on purpose: this
   sits behind the headline for as long as the visitor is on the page, and
   anything quick enough to notice as an animation is quick enough to annoy. */
const WAVE_ROWS = 26;
const WAVE_PERIOD_MS = 9000;
/* A second, slower wave crossing the first at an angle. One wave alone reads as
   a scanline sweeping a screen; two out of phase read as a surface that is
   never quite still, which is the effect wanted. */
const CROSS_COLUMNS = 47;
const CROSS_PERIOD_MS = 14500;

/* Dissolve. Cells arrive in an order fixed by their own hash rather than at
   random per load, so a reload looks like the same plate resolving again and
   not like a different animation. */
const DISSOLVE_MS = 1500;

/* Frames per second. The grid is ~14,000 glyphs and the wave moves slowly
   enough that 30 is indistinguishable from 60 here, at half the layout cost. */
const FPS = 30;

/** Deterministic per-cell noise in [0, 1). Cheap integer hash, no allocation. */
function hash(x: number, y: number): number {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export type AsciiMotionHandle = { stop: () => void };

/**
 * Drives `pre` with the animated grid. Returns a handle whose `stop()` restores
 * the original text and releases everything.
 */
export function startAsciiMotion(
  pre: HTMLPreElement,
  source: string,
): AsciiMotionHandle {
  /* Everything this needs is optional. `matchMedia` and `IntersectionObserver`
     are both missing in a jsdom test run and either can be absent in an old or
     stripped-down browser, and the correct behaviour in all of those cases is
     the committed grid rendered exactly as generated — which is already in the
     markup. Feature-detect rather than shim, so the fallback that ships is the
     fallback that gets tested. */
  const reduced =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
  const prefersReduced = () => reduced?.matches ?? false;

  const lines = source.replace(/\n+$/, "").split("\n");
  const rows = lines.length;
  const cols = Math.max(...lines.map((l) => l.length));

  /* Flatten to ramp indices once. Short lines pad with the blank glyph so every
     row is the same length and the wave maths never has to special-case an
     edge; trailing blanks are trimmed again on the way out so the element's box
     does not grow. */
  const grid = new Uint8Array(rows * cols);
  const order = new Float32Array(rows * cols);
  for (let y = 0; y < rows; y++) {
    const line = lines[y];
    for (let x = 0; x < cols; x++) {
      const ch = x < line.length ? line[x] : " ";
      const idx = RAMP.indexOf(ch);
      grid[y * cols + x] = idx < 0 ? BLANK : idx;
      order[y * cols + x] = hash(x, y);
    }
  }

  let raf = 0;
  let timer = 0;
  let visible = true;
  let start = 0;
  let running = false;

  const out: string[] = new Array(rows);

  const render = (now: number) => {
    if (!start) start = now;
    const elapsed = now - start;
    const dissolve = Math.min(1, elapsed / DISSOLVE_MS);
    /* Ease so the last cells do not all land on the same frame. */
    const front = dissolve * dissolve * (3 - 2 * dissolve);

    const wavePhase = (elapsed / WAVE_PERIOD_MS) * Math.PI * 2;
    const crossPhase = (elapsed / CROSS_PERIOD_MS) * Math.PI * 2;

    for (let y = 0; y < rows; y++) {
      const rowWave = Math.sin((y / WAVE_ROWS) * Math.PI * 2 - wavePhase);
      let line = "";
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        const base = grid[i];

        /* Blank cells stay blank. Letting the wave push them into visibility
           would grow a halo of stray glyphs around the sitter and undo the
           matte the generator spent its effort on. */
        if (base === BLANK) {
          line += " ";
          continue;
        }

        if (order[i] > front) {
          /* Not yet arrived: hold near the sparse end so the plate builds up
             out of its own faintest marks. */
          line += RAMP[Math.min(BLANK, base + 4)];
          continue;
        }

        const cross = Math.sin((x / CROSS_COLUMNS) * Math.PI * 2 + crossPhase);
        /* The two waves multiply rather than add, so the crests only coincide
           occasionally and the surface never falls into an obvious rhythm. */
        const shift = Math.round(rowWave * cross * WAVE_AMPLITUDE);
        const next = Math.min(BLANK - 1, Math.max(0, base + shift));
        line += RAMP[next];
      }
      out[y] = line.replace(/\s+$/, "");
    }

    pre.textContent = out.join("\n");
  };

  const tick = (now: number) => {
    if (!running) return;
    render(now);
    timer = window.setTimeout(() => {
      raf = window.requestAnimationFrame(tick);
    }, 1000 / FPS);
  };

  const play = () => {
    if (running || prefersReduced() || !visible) return;
    running = true;
    raf = window.requestAnimationFrame(tick);
  };

  const pause = () => {
    running = false;
    window.cancelAnimationFrame(raf);
    window.clearTimeout(timer);
  };

  /* Off-screen the plate is still a live rAF loop rebuilding 14,000 glyphs a
     frame, which is pure waste on a page this long. Without the observer it
     simply runs whenever it is mounted, which is the old behaviour of every
     animation on the web and not worth refusing to animate over. */
  const io =
    typeof IntersectionObserver === "function"
      ? new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;
            if (visible) play();
            else pause();
          },
          { rootMargin: "120px" },
        )
      : null;
  io?.observe(pre);

  const onMotionChange = () => {
    if (prefersReduced()) {
      pause();
      pre.textContent = source;
    } else {
      start = 0;
      play();
    }
  };
  reduced?.addEventListener("change", onMotionChange);

  if (prefersReduced()) pre.textContent = source;
  else play();

  return {
    stop: () => {
      pause();
      io?.disconnect();
      reduced?.removeEventListener("change", onMotionChange);
      pre.textContent = source;
    },
  };
}
