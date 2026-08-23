// Headline clearance probe.
//
// Traces the skyline out of the rendered photograph — for every column of
// pixels, the first row from the top that stops being sky — and then measures
// the headline's glyph boxes against that profile. Clearance is the vertical
// gap between the lowest glyph and the roofline directly beneath it, in CSS
// pixels. Negative means the type is sitting on a building.
export const CLEARANCE = `((probeSize) => {
  const img = document.querySelector('.hero-photo img');
  if (!img || !img.complete) return { error: 'photo not loaded' };

  if (probeSize) {
    let s = document.getElementById('probe-size');
    if (!s) { s = document.createElement('style'); s.id = 'probe-size'; document.head.appendChild(s); }
    s.textContent = '.hero-title { font-size: ' + probeSize + ' !important; }';
  }

  const rect = img.getBoundingClientRect();
  const c = document.createElement('canvas');
  c.width = Math.round(rect.width); c.height = Math.round(rect.height);
  const ctx = c.getContext('2d', { willReadFrequently: true });
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const s = Math.max(rect.width / iw, rect.height / ih);
  const dw = iw * s, dh = ih * s;
  const op = getComputedStyle(img).objectPosition.split(' ');
  ctx.drawImage(img, (rect.width - dw) * ((parseFloat(op[0]) || 50) / 100),
                     (rect.height - dh) * ((parseFloat(op[1]) || 50) / 100), dw, dh);
  const data = ctx.getImageData(0, 0, c.width, c.height).data;

  const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const L = (x, y) => { const i = (y * c.width + x) * 4; return 0.2126*lin(data[i]) + 0.7152*lin(data[i+1]) + 0.0722*lin(data[i+2]); };

  // The sky sits at 0.41-0.47 luminance across its whole gradient; the
  // Elbphilharmonie's roof, the spires and the trees are all well under 0.30.
  // The first row below that threshold is the roofline for that column.
  const SKY_FLOOR = 0.30;
  const skylineAt = (x) => {
    for (let y = 0; y < c.height; y++) if (L(x, y) < SKY_FLOOR) return y;
    return c.height;
  };

  const title = document.querySelector('.hero-title');
  const rects = [];
  const walk = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walk.nextNode())) {
    if (!n.textContent.trim()) continue;
    const r = document.createRange(); r.selectNodeContents(n);
    rects.push(...Array.from(r.getClientRects()));
  }
  if (!rects.length) return { error: 'no glyph rects' };

  let minClearance = Infinity, worstX = null;
  for (const r of rects) {
    for (let x = Math.max(0, Math.floor(r.left)); x < Math.min(c.width, r.right); x += 2) {
      const gap = skylineAt(x) - r.bottom;
      if (gap < minClearance) { minClearance = gap; worstX = x; }
    }
  }

  const box = title.getBoundingClientRect();
  return {
    viewport: document.documentElement.clientWidth + 'x' + document.documentElement.clientHeight,
    fontPx: +parseFloat(getComputedStyle(title).fontSize).toFixed(1),
    lines: rects.length,
    titleBottom: Math.round(box.bottom),
    clearancePx: Math.round(minClearance),
    worstX
  };
})`;
