// Contrast sweep for the hero.
//
// Rebuilds the ground the eye actually sees — not the raw JPEG — and measures
// every glyph box against it. The stack it reproduces, in order:
//
//   1. the photograph, drawn exactly as `object-fit: cover` composites it
//   2. `filter: brightness()` — a multiply, so a straight per-channel scale
//   3. each `.hero-field` lobe in DOM order, blended with its own
//      `mix-blend-mode`. Their radial gradients are parsed out of the computed
//      `background-image` rather than restated here, so the CSS stays the only
//      place they are written down
//   4. the veil, `--wash-*` read live off `:root` for the same reason
//   5. any translucent ground above it — the glass pane, the solid action —
//      composited in paint order rather than replacing what is underneath
//
// THE LOBES MOVE, so a single reading is not an answer. Each is sampled at
// three phases of its drift and the worst result is the one reported. Phases
// are set through the Web Animations API — `pause()` then an explicit
// `currentTime` — and not by shifting `animation-delay`, which was the first
// attempt and was wrong: delay shifts a timeline that already has arbitrary
// elapsed time on it, so the phase you land on is `(elapsed/duration + p) mod
// 1` rather than `p`. (Driving it from `transform` directly is also out: a
// running animation outranks inline styles for the properties it animates.)
//
// Reading the *transformed* `getBoundingClientRect()` as the gradient's box is
// correct here, and only because every lobe's transform is a translate plus a
// uniform scale. Percentage-positioned gradients scale with the box, so the
// transformed rect describes exactly where the painted gradient now is. Add a
// rotation or a skew to a keyframe and this stops being true.
//
// Three things in the real stack are deliberately NOT modelled, each because
// leaving it out makes the answer pessimistic rather than optimistic:
//
//   · the vignette, which only ever darkens, and the type is light
//   · `backdrop-filter`, which averages the ground under glass and so pulls
//     extremes toward the mean — the extremes are what this measures
//   · the grain, which is `multiply` at 25% over noise centred near mid-grey
//     and so darkens the ground by roughly an eighth
//
// Reported per element: the worst ratio found across all phases, and what
// share of glyph pixels fall below the WCAG bar that element qualifies for. A
// single dark pixel behind a comma drags `worst` down without meaning much,
// which is why the percentage is the number to read.
export const SWEEP = `(() => {
  const img = document.querySelector('.hero-photo img');
  if (!img || !img.complete || !img.naturalWidth) return { error: 'photo not loaded' };
  const root = document.documentElement;

  // ── The photograph ─────────────────────────────────────────────────────
  // The canvas is the viewport, not the image box, and the image is drawn into
  // it at its real offset. Those are the same thing only while the image
  // exactly fills the frame — on portrait viewports it is deliberately taller
  // than the hero and bottom-anchored, so its box starts above y=0. Measuring
  // glyph rects (viewport coordinates) against a canvas built in image-box
  // coordinates would silently read the wrong pixels.
  //
  // Redrawn on every phase, because the photograph drifts: the pixels behind a
  // given glyph are not the same at one end of the cycle as the other. Reading
  // the transformed rect and running the cover maths against it is exact here —
  // cover-fitting a box and then scaling it uniformly gives the same result as
  // cover-fitting the scaled box.
  const c = document.createElement('canvas');
  c.width = Math.round(root.clientWidth); c.height = Math.round(root.clientHeight);
  const ctx = c.getContext('2d', { willReadFrequently: true });
  let data = null;
  const drawPhoto = () => {
    const irect = img.getBoundingClientRect();
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const cover = Math.max(irect.width / iw, irect.height / ih);
    const dw = iw * cover, dh = ih * cover;
    const op = getComputedStyle(img).objectPosition.split(' ');
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(
      img,
      irect.left + (irect.width - dw) * ((parseFloat(op[0]) || 50) / 100),
      irect.top + (irect.height - dh) * ((parseFloat(op[1]) || 50) / 100),
      dw, dh
    );
    data = ctx.getImageData(0, 0, c.width, c.height).data;
  };

  const num = (el, prop, fallback) => {
    const v = parseFloat(getComputedStyle(el).getPropertyValue(prop));
    return Number.isFinite(v) ? v : fallback;
  };

  const bright = num(root, '--photo-brightness', 1);

  // ── The veil ───────────────────────────────────────────────────────────
  // Alphas *and* stop positions read live, so the ramp here is the ramp in
  // hero.css by construction rather than by anyone remembering to edit two
  // files. Note this is read per run, so the small-screen override lands too.
  const wrgb = (getComputedStyle(root).getPropertyValue('--wash-rgb')
    .trim().match(/[\\d.]+/g) || [0, 0, 0]).map(Number);
  const pct = (prop, fallback) => {
    const v = parseFloat(getComputedStyle(root).getPropertyValue(prop));
    return Number.isFinite(v) ? v / 100 : fallback;
  };
  // Shape: dense from the top to stop-a (the band under the glass pane), then
  // ramping out to the thin middle by stop-b, then to the foot. The top stop
  // is repeated deliberately — that plateau is what holds the pane's ground
  // across its whole height rather than only at y=0.
  const stops = [
    [0, num(root, '--wash-top', 0)],
    [pct('--wash-stop-a', 0.11), num(root, '--wash-top', 0)],
    [pct('--wash-stop-b', 0.3), num(root, '--wash-mid', 0)],
    [1, num(root, '--wash-bot', 0)]
  ];
  const washAlphaAt = t => {
    for (let i = 1; i < stops.length; i++) {
      if (t <= stops[i][0]) {
        const [p0, a0] = stops[i - 1], [p1, a1] = stops[i];
        const k = p1 === p0 ? 0 : (t - p0) / (p1 - p0);
        return a0 + (a1 - a0) * k;
      }
    }
    return stops[stops.length - 1][1];
  };

  const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

  const rgba = str => {
    const m = String(str).match(/[\\d.]+/g);
    if (!m) return null;
    const [r, g, b] = m.slice(0, 3).map(Number);
    return { r, g, b, a: m.length > 3 ? Number(m[3]) : 1 };
  };

  // ── Blend modes ────────────────────────────────────────────────────────
  const hardLight = (b, sc) => (sc <= 0.5 ? 2 * sc * b : 1 - 2 * (1 - sc) * (1 - b));
  // W3C soft-light, including the piecewise D() the spec defines below 0.25.
  const softLight = (b, sc) => {
    if (sc <= 0.5) return b - (1 - 2 * sc) * b * (1 - b);
    const d = b <= 0.25 ? ((16 * b - 12) * b + 4) * b : Math.sqrt(b);
    return b + (2 * sc - 1) * (d - b);
  };
  const blendFns = {
    'hard-light': hardLight,
    'soft-light': softLight,
    multiply: (b, sc) => b * sc,
    screen: (b, sc) => b + sc - b * sc,
    overlay: (b, sc) => hardLight(sc, b)
  };

  // ── The lobes ──────────────────────────────────────────────────────────
  // Parsed generically: any number of colour stops, so the CSS is free to
  // shape a falloff without this file needing to know about it.
  const GRAD = /radial-gradient\\(([\\d.]+)% ([\\d.]+)% at ([\\d.]+)% ([\\d.]+)%, ((?:rgba?\\([^)]*\\) [\\d.]+%(?:, )?)+)\\)/g;
  const STOP = /rgba?\\(([^)]*)\\) ([\\d.]+)%/g;
  const lobes = [...document.querySelectorAll('.hero-field')].map(el => {
    const cs = getComputedStyle(el);
    const layers = [];
    GRAD.lastIndex = 0;
    let m;
    while ((m = GRAD.exec(cs.backgroundImage))) {
      const stops = [];
      STOP.lastIndex = 0;
      let s;
      while ((s = STOP.exec(m[5]))) {
        const n = s[1].split(',').map(Number);
        stops.push({ p: +s[2] / 100, r: n[0], g: n[1], b: n[2], a: n.length > 3 ? n[3] : 1 });
      }
      if (stops.length < 2) continue;
      layers.push({ rx: +m[1] / 100, ry: +m[2] / 100, cx: +m[3] / 100, cy: +m[4] / 100, stops });
    }
    return { el, layers, blend: cs.mixBlendMode, rect: null, opacity: 1 };
  }).filter(l => l.layers.length);

  // Layers listed first in a background shorthand paint on top, so this
  // composites from the back of the list forward.
  const lobeAt = (lobe, x, y) => {
    const R = lobe.rect;
    if (!R) return null;
    const lx = x - R.left, ly = y - R.top;
    let cr = 0, cg = 0, cb = 0, ca = 0;
    for (let i = lobe.layers.length - 1; i >= 0; i--) {
      const g = lobe.layers[i];
      const dx = (lx - g.cx * R.width) / (g.rx * R.width);
      const dy = (ly - g.cy * R.height) / (g.ry * R.height);
      const t = Math.sqrt(dx * dx + dy * dy);
      if (t >= 1) continue;
      // Interpolate between whichever pair of stops t falls between.
      const S = g.stops;
      let lo = S[0], hi = S[S.length - 1];
      for (let k = 1; k < S.length; k++) {
        if (t <= S[k].p) { lo = S[k - 1]; hi = S[k]; break; }
      }
      const span = hi.p - lo.p;
      const f = span <= 0 ? 0 : Math.min(1, Math.max(0, (t - lo.p) / span));
      const a = lo.a + (hi.a - lo.a) * f;
      if (a <= 0) continue;
      const rr = lo.r + (hi.r - lo.r) * f;
      const gg = lo.g + (hi.g - lo.g) * f;
      const bb = lo.b + (hi.b - lo.b) * f;
      const outA = a + ca * (1 - a);
      cr = (rr * a + cr * ca * (1 - a)) / outA;
      cg = (gg * a + cg * ca * (1 - a)) / outA;
      cb = (bb * a + cb * ca * (1 - a)) / outA;
      ca = outA;
    }
    // Element opacity is animated too, and multiplies the whole layer.
    ca *= lobe.opacity;
    return ca > 0 ? [cr, cg, cb, ca] : null;
  };

  const photoAt = (x, y) => {
    const i = (y * c.width + x) * 4;
    const px = [data[i] * bright, data[i + 1] * bright, data[i + 2] * bright];
    for (const lobe of lobes) {
      const f = lobeAt(lobe, x, y);
      if (!f) continue;
      const fn = blendFns[lobe.blend];
      for (let k = 0; k < 3; k++) {
        const b = px[k] / 255, sc = f[k] / 255;
        px[k] = 255 * ((1 - f[3]) * b + f[3] * (fn ? fn(b, sc) : sc));
      }
    }
    const a = washAlphaAt(y / c.height);
    return [
      wrgb[0] * a + px[0] * (1 - a),
      wrgb[1] * a + px[1] * (1 - a),
      wrgb[2] * a + px[2] * (1 - a)
    ];
  };

  // Grounds in paint order. Anything with a background colour above the photo
  // is composited over it, not substituted for it — the pane is a partial
  // film, and treating it as opaque would report a contrast nobody gets.
  let grounds = [];
  const readGrounds = () => {
    grounds = [...document.querySelectorAll('.hero *')]
      .map(el => ({ el, bg: rgba(getComputedStyle(el).backgroundColor) }))
      .filter(g => g.bg && g.bg.a > 0.001)
      .map(g => ({ r: g.el.getBoundingClientRect(), bg: g.bg }));
  };

  const bgL = (x, y) => {
    let [r, g, b] = photoAt(x, y);
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

  const targets = [...document.querySelectorAll('.hero-title, .hero-lede, .hero-rail a, .hero-cta')]
    .map(el => {
      const cs = getComputedStyle(el);
      const fg = rgba(cs.color) || { r: 0, g: 0, b: 0 };
      // WCAG's large-text threshold: 24px, or 18.66px at 700+. The headline
      // qualifies and the lede does not, which is why they are held to
      // different bars.
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

  const setPhase = p => {
    // The photograph drifts too, so it is phase-controlled alongside the lobes.
    for (const el of [...lobes.map(l => l.el), img]) {
      // The reduced-motion state: animation:none leaves each layer at its
      // untransformed base, which is not any keyframe and so would go
      // unmeasured if only phases were sampled. Driven through inline
      // animation shorthand rather than Animation.cancel(), because a
      // cancelled animation drops out of getAnimations() entirely and there is
      // then nothing left to restart — which silently left the live page
      // frozen after every run.
      el.style.animation = p === null ? 'none' : '';
    }
    void root.offsetHeight;
    if (p !== null) {
      for (const el of [...lobes.map(l => l.el), img]) {
        for (const a of el.getAnimations()) {
          a.pause();
          a.currentTime = p * (a.effect.getTiming().duration || 0);
        }
      }
      void root.offsetHeight;
    }
    drawPhoto();
    for (const lobe of lobes) {
      lobe.rect = lobe.el.getBoundingClientRect();
      const o = parseFloat(getComputedStyle(lobe.el).opacity);
      lobe.opacity = Number.isFinite(o) ? o : 1;
    }
  };

  const clearPhase = () => {
    for (const el of [...lobes.map(l => l.el), img]) el.style.animation = '';
    void root.offsetHeight;
    for (const el of [...lobes.map(l => l.el), img]) {
      for (const a of el.getAnimations()) a.play();
    }
  };

  try {
    for (const phase of [0, 0.5, 1, null]) {
      setPhase(phase);
      readGrounds();
      for (const t of targets) {
        for (const r of glyphRects(t.el)) {
          for (let y = Math.max(0, Math.floor(r.top)); y < Math.min(c.height, r.bottom); y++) {
            for (let x = Math.max(0, Math.floor(r.left)); x < Math.min(c.width, r.right); x++) {
              const cr = ratio(t.fgL, bgL(x, y));
              t.total++; if (cr < t.bar) t.fails++; if (cr < t.worst) t.worst = cr;
            }
          }
        }
      }
    }
  } finally {
    clearPhase();
  }

  const results = targets.filter(t => t.total).map(t => ({
    el: t.name, text: t.text, bar: t.bar,
    worst: +t.worst.toFixed(2),
    failPixels: t.fails,
    pctBelowAA: +(100 * t.fails / t.total).toFixed(3)
  }));

  // Mean luminance of the finished frame. This is a design metric, not an
  // accessibility one: the veil, the grade, the grain and the shade band all
  // darken, they compound, and it is very easy to end up several times darker
  // than intended without any single value looking wrong. Sampled at the
  // brightest phase, since that is the one being judged for "too dark".
  setPhase(0);
  let lsum = 0, ln = 0;
  for (let y = 6; y < c.height; y += 12) {
    for (let x = 6; x < c.width; x += 12) {
      const [r, g, b] = photoAt(x, y);
      lsum += L(r, g, b); ln++;
    }
  }

  return {
    viewport: root.clientWidth + 'x' + root.clientHeight,
    overflowPx: Math.max(0, root.scrollWidth - root.clientWidth),
    phasesSampled: 4,
    lobes: lobes.length,
    meanLuminance: +(lsum / ln).toFixed(4),
    // Filtered on the raw pixel count, not the rounded percentage. Rounding to
    // two places reported a lede sitting at 3.79 against a 4.5 bar as passing,
    // because its handful of failing pixels came to 0.001%.
    failing: results.filter(r => r.failPixels > 0),
    all: results
  };
})()`;
