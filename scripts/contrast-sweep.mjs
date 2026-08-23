// Contrast sweep for the hero.
//
// The background is a shader canvas — see `src/components/InkField.tsx` — and
// that makes this far simpler than it used to be. There is no photograph to
// re-composite, no veil to re-derive from tokens, no blend chain to reimplement
// in JavaScript. The ground is one canvas, so it is SAMPLED rather than
// modelled: it is the output of a noise program and there is no closed form to
// reproduce, so reading the pixels is both easier and exact.
//
// That requires the WebGL context to be created with
// `preserveDrawingBuffer: true`, which InkField.tsx does specifically for this.
// A WebGL canvas without it reads back as transparent black, and believing
// that false negative is what sent an earlier pass off building an entirely
// different effect from the one being copied.
//
// THE FIELD MOVES, so a single reading is not an answer. It is aperiodic, so
// there is no cycle to sample evenly; instead it is rendered at several widely
// separated times through the hook the component exposes, and the worst result
// across all of them is what gets reported.
//
// Anything with a background colour above the field — the glass pane, the
// solid action — is composited over it in paint order rather than replacing it,
// because a partial film is not an opaque one.
//
// Two things are deliberately NOT modelled, each because leaving them out
// makes the answer pessimistic rather than optimistic:
//
//   · `backdrop-filter`, which averages the ground under glass and so pulls
//     extremes toward the mean — the extremes are what this measures
//   · the type's own text-shadow, which WCAG gives no credit for either
//
// Reported per element: the worst ratio found across all samples, the raw
// count of failing pixels, and the share of glyph pixels below the WCAG bar
// that element qualifies for. The count is the number to read — a rounded
// percentage once reported a lede sitting at 3.79 against a 4.5 bar as
// passing, because its failures came to 0.001%.
//
// NOTE FOR EDITORS: everything from here to the closing backtick is a template
// literal. A backtick anywhere inside it — including in a comment — terminates
// the string, and the probe then fails with a syntax error a long way from the
// cause. It has happened twice. Use plain quotes in the comments below.
export const SWEEP = `(() => {
  const root = document.documentElement;
  const W = Math.round(root.clientWidth), H = Math.round(root.clientHeight);

  const ink = document.querySelector('.hero-ink');
  if (!ink) return { error: 'no ink field' };
  if (typeof ink.__inkRenderAt !== 'function') return { error: 'no render hook' };

  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  let data = null;

  const drawGround = () => {
    const r = ink.getBoundingClientRect();
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(ink, r.left, r.top, r.width, r.height);
    data = ctx.getImageData(0, 0, W, H).data;
  };

  const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

  // Handles both forms the browser reports. rgb() gives 0-255; color(srgb ...)
  // gives 0-1, and reading those as 0-255 silently turns any colour into near
  // black. That is not hypothetical: the accent line is a color-mix(), which
  // computes to the color() form, and this harness spent a whole pass
  // reporting it at ~1.2:1 no matter what colour it was actually set to,
  // because it was measuring black against the ground every time.
  const rgba = str => {
    const raw = String(str);
    const m = raw.match(/[\\d.]+/g);
    if (!m) return null;
    const nums = m.map(Number);
    const scale = raw.indexOf('color(') === 0 ? 255 : 1;
    const [r, g, b] = nums.slice(0, 3).map(v => v * scale);
    return { r, g, b, a: nums.length > 3 ? nums[3] : 1 };
  };

  let grounds = [];
  const readGrounds = () => {
    grounds = [...document.querySelectorAll('.hero *')]
      .filter(el => {
        if (el === ink) return false;
        // Skip anything not actually painted. The mobile sheet is
        // position:fixed inset:0 with a near-opaque background and stays in
        // the DOM while closed, so without this it composites over the entire
        // viewport and reports the masthead action at 1.65:1 against a ground
        // nobody can see.
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') return false;
        if (parseFloat(cs.opacity) === 0) return false;
        return true;
      })
      .map(el => ({ el, bg: rgba(getComputedStyle(el).backgroundColor) }))
      .filter(g => g.bg && g.bg.a > 0.001)
      .map(g => ({ r: g.el.getBoundingClientRect(), bg: g.bg }));
  };

  const bgL = (x, y) => {
    const i = (y * W + x) * 4;
    let r = data[i], g = data[i + 1], b = data[i + 2];
    for (const gr of grounds) {
      if (x < gr.r.left || x > gr.r.right || y < gr.r.top || y > gr.r.bottom) continue;
      const a = gr.bg.a;
      r = gr.bg.r * a + r * (1 - a);
      g = gr.bg.g * a + g * (1 - a);
      b = gr.bg.b * a + b * (1 - a);
    }
    return L(r, g, b);
  };

  const glyphRects = el => {
    const out = []; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) {
      if (!n.textContent.trim()) continue;
      const r = document.createRange(); r.selectNodeContents(n);
      out.push(...Array.from(r.getClientRects()));
    }
    return out;
  };

  // NOTE: no backticks anywhere in this comment. It lives inside the SWEEP
  // template literal, and a backtick here terminates the string.
  //
  // .hero-title-accent is listed explicitly, and it has to be. This sweep
  // reads each target's own computed colour, so a span that recolours part of
  // its parent is invisible to it: the accent line went blue and this harness
  // went on reporting the h1's paper against the same ground, which is a pass
  // for a measurement nobody was taking. Any future element that recolours a
  // run of text inside a checked one has to be added here for the same reason.
  //
  // The masthead is deliberately absent. It used to be .hero-rail a and
  // .hero-cta, both of which stopped matching when the header moved out of the
  // hero and became page chrome — but re-pointing them at the new names would
  // be worse than leaving them out. This sweep takes its ground by sampling
  // the shader canvas, and the masthead now sits on a fixed scrim between
  // itself and that canvas, so it would be measured against a ground it no
  // longer has and fail on contrast it actually possesses. It is checked
  // instead by sampling composited screenshots, which is the only way to see
  // a backdrop-filtered pane and a scrim at the same time.
  const targets = [...document.querySelectorAll(
    '.hero-title, .hero-title-accent, .hero-lede'
  )]
    .map(el => {
      const cs = getComputedStyle(el);
      const fg = rgba(cs.color) || { r: 0, g: 0, b: 0 };
      // WCAG's large-text threshold: 24px, or 18.66px at 700+.
      const px = parseFloat(cs.fontSize);
      const wt = parseInt(cs.fontWeight, 10) || 400;
      const bar = px >= 24 || (px >= 18.66 && wt >= 700) ? 3 : 4.5;
      return {
        el, bar, fgL: L(fg.r, fg.g, fg.b),
        name: String(el.className || el.tagName.toLowerCase()).slice(0, 34),
        text: (el.textContent || '').trim().slice(0, 24),
        worst: Infinity, fails: 0, total: 0
      };
    });

  // Widely separated and deliberately not evenly spaced: the field is
  // aperiodic, so there is no cycle to divide up, and regular spacing risks
  // landing on a beat of the drift.
  //
  // Twelve rather than a handful, because the pigment pool is the main thing
  // that can move a ratio and it now travels its orbit at a surging rate — a
  // sparse set of times maps to a clustered set of positions, and the position
  // is what actually matters. These span roughly three laps.
  // Spread across the cycle. The field now has three interlocking beats — the
  // heading turns every 4s, the polarity inverts every 4s, and the texture
  // changes every 8s — so these are chosen to hit all eight texture/polarity
  // combinations rather than just to be far apart. 17 is here for the moire
  // at normal polarity, which nothing else in the list reaches.
  const SAMPLES = [0, 3, 7, 13, 17, 23, 31, 43, 61, 79, 97, 121, 149];

  const sampleAt = seconds => {
    ink.__inkRenderAt(seconds);
    drawGround();
    readGrounds();
  };

  for (const s of SAMPLES) {
    sampleAt(s);
    for (const t of targets) {
      for (const r of glyphRects(t.el)) {
        for (let y = Math.max(0, Math.floor(r.top)); y < Math.min(H, r.bottom); y++) {
          for (let x = Math.max(0, Math.floor(r.left)); x < Math.min(W, r.right); x++) {
            const cr = ratio(t.fgL, bgL(x, y));
            t.total++; if (cr < t.bar) t.fails++; if (cr < t.worst) t.worst = cr;
          }
        }
      }
    }
  }

  const results = targets.filter(t => t.total).map(t => ({
    el: t.name, text: t.text, bar: t.bar,
    worst: +t.worst.toFixed(2),
    failPixels: t.fails,
    pctBelowAA: +(100 * t.fails / t.total).toFixed(3)
  }));

  // Mean luminance of the finished frame, averaged across the samples. A
  // design metric, not an accessibility one: it is the number that answers
  // "is this too dark", which took a long time to settle without it.
  let lsum = 0, ln = 0;
  for (const s of SAMPLES) {
    sampleAt(s);
    for (let y = 6; y < H; y += 12) {
      for (let x = 6; x < W; x += 12) {
        const i = (y * W + x) * 4;
        lsum += L(data[i], data[i + 1], data[i + 2]); ln++;
      }
    }
  }

  return {
    viewport: W + 'x' + H,
    overflowPx: Math.max(0, root.scrollWidth - root.clientWidth),
    samples: SAMPLES.length,
    meanLuminance: +(lsum / ln).toFixed(4),
    failing: results.filter(r => r.failPixels > 0),
    all: results
  };
})()`;
