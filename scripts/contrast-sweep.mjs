// Contrast sweep for the hero.
//
// The background is a video — see `src/components/HeroVideo.tsx` — and nothing
// is composited over it: no wash, no veil, no shade band. So the ground is the
// frame, reconstructed here by drawing it to a canvas through the same
// object-fit mapping the browser uses.
//
// NOTE ON WHAT THIS WILL TELL YOU. The plate is a bright one and the statement
// prints in paper, so parts of it do not clear the WCAG bar and are not
// expected to: the shade band that used to buy those numbers was removed
// deliberately, in favour of keeping the footage clean. The type carries itself
// on a shadow, which WCAG gives no credit for. Read the numbers below as a
// measure of how hard the plate is working against the type, not as a
// pass/fail — and if the plate is ever regraded, this is what will say whether
// it helped.
//
// THE PICTURE MOVES, and the type crosses with it. `--wow` tracks how much of
// the frame has turned to cloud and the statement mixes from paper to the
// signal blue by that amount, so each sample computes that value from the frame
// it just drew, applies it, and only then reads the computed colours —
// otherwise the sweep measures one state's type against the other's ground.
//
// Anything with a background colour above the field — the glass pane, the solid
// action — is composited over it in paint order rather than replacing it,
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
//
// The probe is async, because seeking a video is. Await the result.
export const SWEEP = `(async () => {
  const root = document.documentElement;
  const W = Math.round(root.clientWidth), H = Math.round(root.clientHeight);

  const box = document.querySelector('.hero-video');
  const video = document.querySelector('.hero-video-el');
  if (!box || !video) return { error: 'no hero video' };
  if (!video.videoWidth) return { error: 'video has no frame yet' };

  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  let data = null;

  // The same crop object-fit: cover produces, so the frame is sampled where it
  // is actually shown rather than squashed to the box.
  const drawFrame = () => {
    const r = box.getBoundingClientRect();
    const scale = Math.max(r.width / video.videoWidth, r.height / video.videoHeight);
    const dw = video.videoWidth * scale, dh = video.videoHeight * scale;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(video, r.left + (r.width - dw) / 2, r.top + (r.height - dh) / 2, dw, dh);
  };

  // Mirrors the curve in HeroVideo.tsx: a low percentile of the visible frame
  // mapped onto 0..1. See that file for why the floor is the statistic that
  // matters. The rate limit is not modelled — this measures the settled value
  // each frame is heading for, which is the worse case of the two.
  const floorOfFrame = () => {
    const lums = [];
    for (let y = 0; y < H; y += 6) {
      for (let x = 0; x < W; x += 6) {
        const i = (y * W + x) * 4;
        lums.push((0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255);
      }
    }
    lums.sort((a, b) => a - b);
    return lums[Math.floor(0.005 * lums.length)];
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
        if (el === video || el === box) return false;
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
  // be worse than leaving them out. The pane is backdrop-filtered, which
  // averages the ground beneath it, and nothing exposes that to script. It is
  // checked instead by sampling composited screenshots.
  const SELECTOR = '.hero-title, .hero-title-accent, .hero-lede';

  // Each target's colour is re-read per sample, because the bright state
  // changes it. Only the geometry and the WCAG bar are fixed.
  const targets = [...document.querySelectorAll(SELECTOR)].map(el => {
    const cs = getComputedStyle(el);
    // WCAG's large-text threshold: 24px, or 18.66px at 700+.
    const px = parseFloat(cs.fontSize);
    const wt = parseInt(cs.fontWeight, 10) || 400;
    return {
      el,
      bar: px >= 24 || (px >= 18.66 && wt >= 700) ? 3 : 4.5,
      name: String(el.className || el.tagName.toLowerCase()).slice(0, 34),
      text: (el.textContent || '').trim().slice(0, 24),
      worst: Infinity, fails: 0, total: 0
    };
  });

  // Video timestamps rather than an abstract clock. Chosen to walk the whole
  // loop and to land inside both states: the clip runs about 19.25s, the
  // whiteout occupies roughly the last 0.4s and the first 0.35s, and the
  // dissolve between them is the hardest moment for the type, because it is
  // part way to blue while a good deal of mountain is still showing. The two
  // mid-clip cloud banks at about 8.4s and 13.2s are here for the same reason.
  const D = video.duration || 19.25;
  const SAMPLES = [
    0.02, 0.12, 0.22, 0.34, 0.5, 1, 2, 3.5, 5, 7, 9, 11, 13, 15, 16.5, 17.5,
    18.1, 18.3, 18.5, 18.7, D - 0.25, D - 0.06
  ].filter(t => t >= 0 && t < D);

  const FLOOR_ON = 0.72, FLOOR_OFF = 0.66;
  let bright = false;

  const seek = t => new Promise(res => {
    const done = () => { video.removeEventListener('seeked', done); res(); };
    video.addEventListener('seeked', done);
    video.currentTime = t;
  });

  // The same curve HeroVideo.tsx applies. Kept in step with it by hand: if the
  // constants there move, these have to move too or this measures a crossing
  // the page does not perform.
  const FLOOR_LO = 0.14, FLOOR_HI = 0.76;

  const wasPaused = video.paused;
  const startedAt = video.currentTime;
  const startedWow = root.style.getPropertyValue('--wow');
  video.pause();

  // The type crossfades between white and blue over 260ms. This sweep seeks
  // instantly, so without this it reads whatever colour the transition happens
  // to be part way through and compares it against a frame that jumped — which
  // produced a reported worst of 1.00, white type measured against the white
  // frame it had not yet finished leaving. Those blends are real for a quarter
  // of a second during playback, but they are a property of the crossfade
  // rather than of either state, and no threshold is meaningful against them.
  // What is worth measuring is the two settled states, so the transitions are
  // switched off for the duration.
  const freeze = document.createElement('style');
  freeze.textContent = '*, *::before, *::after { transition: none !important; }';
  document.head.appendChild(freeze);

  for (const s of SAMPLES) {
    await seek(s);

    // Nothing is composited over the plate, so the frame is the ground.
    drawFrame();
    data = ctx.getImageData(0, 0, W, H).data;

    const floor = floorOfFrame();
    const wow = Math.min(1, Math.max(0, (floor - FLOOR_LO) / (FLOOR_HI - FLOOR_LO)));
    root.style.setProperty('--wow', String(wow));

    // Force style resolution so the colours read below are the ones this value
    // produces, not the previous sample's.
    void document.body.offsetHeight;
    readGrounds();

    for (const t of targets) {
      const fg = rgba(getComputedStyle(t.el).color) || { r: 0, g: 0, b: 0 };
      const fgL = L(fg.r, fg.g, fg.b);
      for (const r of glyphRects(t.el)) {
        for (let y = Math.max(0, Math.floor(r.top)); y < Math.min(H, r.bottom); y++) {
          for (let x = Math.max(0, Math.floor(r.left)); x < Math.min(W, r.right); x++) {
            const cr = ratio(fgL, bgL(x, y));
            t.total++; if (cr < t.bar) t.fails++;
            if (cr < t.worst) { t.worst = cr; t.worstAt = s; t.worstWow = +wow.toFixed(2); }
          }
        }
      }
    }
  }

  await seek(startedAt);
  freeze.remove();
  if (startedWow) root.style.setProperty('--wow', startedWow);
  else root.style.removeProperty('--wow');
  if (!wasPaused) void video.play().catch(() => undefined);

  const results = targets.filter(t => t.total).map(t => ({
    el: t.name, text: t.text, bar: t.bar,
    worst: +t.worst.toFixed(2),
    worstAt: t.worstAt, worstWow: t.worstWow,
    failPixels: t.fails,
    pctBelowAA: +(100 * t.fails / t.total).toFixed(3)
  }));

  return {
    viewport: W + 'x' + H,
    overflowPx: Math.max(0, root.scrollWidth - root.clientWidth),
    samples: SAMPLES.length,
    failing: results.filter(r => r.failPixels > 0),
    all: results
  };
})()`;
