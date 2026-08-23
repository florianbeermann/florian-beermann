import { useEffect, useRef } from "react";

/* The hero background: an animated ink field, drawn by a fragment shader.
   There is no photograph any more — this generates the whole picture.

   WHAT IT IS COPYING. The reference runs a stack of abstract fluid-ink
   photographs that cross-fade every few seconds, with a pigment layer swelling
   and moving independently over them. Frames pulled out of a recording of it,
   five seconds apart, are entirely different images; frames a second and a
   half apart are caught mid-dissolve. Its palette measures as a desaturated
   slate-periwinkle base (#575B6C to #6E7486) with a muted olive-yellow (#6C6F50
   to #919257).

   The pigment here is azure rather than olive, which is a rotation of that
   pair and not a substitution — see the uniforms near the bottom of this file
   for why the base had to move as well.

   WHY IT IS GENERATED AND NOT PHOTOGRAPHED. Copying those images is not an
   option and stock alcohol-ink photographs are both a licensing question and a
   large download. Generating them is better on every axis that matters here:
   the texture never repeats, it costs a few kB instead of several MB, it
   resizes to any viewport without a crop decision, and — the part that has
   cost this hero the most work — the background becomes something whose
   luminance can be *guaranteed* rather than measured after the fact. The
   statement's legibility is enforced inside the shader, so there is no need
   for the stack of veils, grades and shade bands that a fixed photograph
   needed.

   HOW THE TEXTURE IS MADE. Domain-warped fractal noise: fbm is evaluated, its
   result offsets the coordinates of a second fbm, and that offsets a third.
   The nesting is what gives fluid rather than clouds. Two things are then done
   to it that plain warped noise does not give you:

     · the ink boundary. Alcohol ink and marble both have hard, high-contrast
       edges around soft interiors, which is a very narrow smoothstep on the
       warp field — wide bands, sharp borders.
     · the veining. Feeding the warp magnitude through sin() produces the
       repeating light and dark strata of cut stone, and warping *that* keeps
       the strata from reading as stripes.

   HOW IT CHANGES. The reference cross-fades between separate images; this
   drifts its noise domain far enough that the pattern renews completely on
   about the same cadence. That reads the same and avoids a hard cut. */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
// NOTE FOR EDITORS: this is a template literal. A backtick anywhere inside it,
// including in a comment, terminates the string and the module fails to parse
// with an error pointing at the comment rather than the cause. Use plain
// quotes throughout.

uniform vec2  uRes;
uniform float uTime;
uniform vec3  uInkDark;
uniform vec3  uInkLight;
uniform vec3  uPigmentDark;
uniform vec3  uPigmentLight;
uniform float uShadeBandH;
uniform float uShadeBandGain;
uniform float uShadeTop;
uniform float uShadeBandFloor;
uniform float uSpotRadius;
uniform float uSpotOrbit;
uniform float uSpotSpeed;
uniform float uSpotSurge;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Rotating each octave stops the lattice of the value noise showing through as
// axis-aligned streaks once several octaves are summed.
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 6; i++) {
    v += a * vnoise(p);
    p = rot * p * 2.03;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  // gl_FragCoord counts from the bottom; everything below thinks in screen
  // terms, so flip once here.
  float yTop = 1.0 - uv.y;
  // Aspect-corrected so the ink cells stay round on any viewport.
  vec2 p = vec2(uv.x * (uRes.x / uRes.y), uv.y) * 2.1;
  float t = uTime;

  // ── Domain warping ─────────────────────────────────────────────────────
  // The large translation on the base coordinate is what renews the pattern.
  // Over roughly six seconds it moves far enough through the noise field that
  // nothing of the previous arrangement is left, which is this shader's
  // equivalent of the reference cross-fading to a different photograph.
  vec2 drift = vec2(t * 0.030, t * 0.019);

  vec2 q = vec2(
    fbm(p + drift),
    fbm(p + drift + vec2(5.2, 1.3))
  );

  vec2 r = vec2(
    fbm(p + 2.4 * q + vec2(1.7, 9.2) + drift * 0.6),
    fbm(p + 2.4 * q + vec2(8.3, 2.8) - drift * 0.4)
  );

  float n = fbm(p + 3.0 * r);
  float warp = length(r);

  // ── The ink ────────────────────────────────────────────────────────────
  // Plates: a narrow smoothstep, so the boundary is hard and the interior is
  // flat. This is the single most characteristic thing about the reference
  // texture and the thing plain fbm never gives you.
  float plate = smoothstep(0.465, 0.535, n);

  // Veining: sin() of the warp magnitude gives the strata of cut stone. The
  // fbm term inside keeps them from reading as regular stripes.
  float vein = 0.5 + 0.5 * sin((warp * 5.4 + n * 3.1) * 3.14159);
  vein = pow(vein, 2.2);

  float ink = mix(plate, vein, 0.42);
  ink = clamp(ink * 0.86 + n * 0.28, 0.0, 1.0);

  vec3 col = mix(uInkDark, uInkLight, ink);

  // ── The pigment ────────────────────────────────────────────────────────
  // A spotlight: a compact pool of colour with an explicit centre that travels
  // a closed path, moving independently of the ink underneath.
  //
  // The centre is explicit for a reason. This was previously a threshold on a
  // second drifting noise field, and that cannot move evenly however carefully
  // it is tuned: when a noise field translates at constant velocity, its
  // contour moves at velocity divided by the local gradient. Across a flat
  // stretch the contour races; across a steep one it crawls. The result
  // visibly surges and stalls. It was also coupled to the ink's own warp,
  // which drifts at a different rate, so the two beat against each other and
  // added a second layer of speed variation on top.
  //
  // A constant angular rate around a circle has none of that — but the circle
  // has to be circular *on screen*, not in uv. An orbit written directly in uv
  // is stretched by the aspect ratio when it is drawn: 0.34 by 0.26 in uv
  // becomes 0.54 by 0.26 on a 16:10 display, and a 2.1 ratio ellipse traversed
  // at constant angular rate runs 2.3x faster across its long side than its
  // short one. Dividing the horizontal amplitude by the aspect ratio is what
  // takes the geometry out of the speed.
  //
  // With the geometry neutral, the speed can then be *composed* rather than
  // suffered. It surges: the rate is modulated by two summed sinusoids on
  // incommensurate periods, so the pool drifts, gathers, runs, and settles
  // without ever repeating the same rhythm.
  //
  // The angle is the exact integral of that rate, not the rate applied to the
  // angle. That distinction matters twice over. Integrating keeps the motion
  // continuous — modulating the angle directly would make the pool jerk
  // backwards whenever the modulation fell — and it keeps the angle a pure
  // function of t, which scripts/contrast-sweep.mjs depends on: it samples
  // the field at scattered times and would read a different picture than the
  // page shows if this accumulated frame to frame.
  //
  //   rate(t)  = S * (1 + A1*sin(w1*t) + A2*sin(w2*t + p))
  //   angle(t) = S * (t - (A1/w1)*cos(w1*t) - (A2/w2)*cos(w2*t + p))
  //
  // The sinusoids average to zero, so the mean rate — and the time for a full
  // lap — is still S. Only its distribution across the lap changes.
  float aspect = uRes.x / uRes.y;

  float w1 = 0.085;
  float w2 = 0.213;
  float A1 = 0.55 * uSpotSurge;
  float A2 = 0.28 * uSpotSurge;
  // Capped below 1 so the bracket never reaches zero. At uSpotSurge = 1 the
  // rate runs between 0.17x and 1.83x of the mean; any higher and it would
  // pass through zero and the pool would visibly reverse.
  float a = uSpotSpeed * (t
    - (A1 / w1) * cos(w1 * t)
    - (A2 / w2) * cos(w2 * t + 1.7));

  vec2 orbit = vec2(cos(a) * uSpotOrbit / aspect, sin(a) * uSpotOrbit);
  // A wander of the orbit's own centre so the path does not read as a
  // repeating circle. Aspect-corrected for the same reason, and an order of
  // magnitude slower, so it contributes only a few percent to the speed.
  vec2 wander = vec2(sin(t * 0.013) * 0.10 / aspect, cos(t * 0.0097) * 0.075);
  vec2 centre = vec2(0.5, 0.46) + orbit + wander;

  // Aspect-corrected so the pool stays round on screen rather than stretching
  // with the viewport.
  vec2 sd = vec2((uv.x - centre.x) * aspect, yTop - centre.y);
  float sr = length(sd) / uSpotRadius;

  // The noise displaces the *radius*, not the strength. Displacing the radius
  // makes the boundary wander like the ink around it; modulating strength would
  // just mottle a circle and still read as a circle.
  sr += (n - 0.5) * 0.62;

  // A hard core with a long falloff — the core is what makes it read as a
  // spotlight rather than a haze, and the falloff is what keeps it ink.
  float pig = 1.0 - smoothstep(0.22, 1.0, sr);
  pig = pow(pig, 1.35);

  // The pigment is the same ink in a different colour, not a light shining on
  // it. That distinction is the whole difference between the two readings, and
  // it comes down to one thing: mixing toward a flat colour replaces the
  // texture in the core, so the spotlight comes out as a solid disc with the
  // ink visible only around its edge. Running the pigment through the same
  // dark-to-light ramp the ink uses keeps every plate, vein and boundary
  // intact through the middle of the pool — the texture simply changes hue.
  vec3 pigCol = mix(uPigmentDark, uPigmentLight, ink);
  col = mix(col, pigCol, pig);

  // ── Legibility ─────────────────────────────────────────────────────────
  // Enforced here rather than by a layer stacked on top, which is the whole
  // advantage of generating the background: the ceiling is a property of the
  // picture instead of something applied to it afterwards and re-measured.
  //
  // Two regions, matching the two things that sit on it: a wide shallow band
  // under the statement, and a strip at the top under the glass pane. Their
  // geometry comes from CSS so the breakpoints can move them, and their
  // boundary is displaced by the same noise as everything else so it does not
  // read as a shape laid over the picture.
  vec2 d = (vec2(uv.x, yTop) - vec2(0.5, 0.50)) / vec2(0.72, uShadeBandH);
  float len = length(d) + (n - 0.5) * 0.34;
  float band = (1.0 - smoothstep(0.45, 1.40, len)) * uShadeBandGain;
  float top = 1.0 - smoothstep(0.03, uShadeTop, yTop);

  // The two regions get different floors because they carry different
  // requirements: the statement is large text at a 3:1 bar, the navigation is
  // 13px at 4.5:1. Sharing one floor meant every point of brightness bought
  // for the frame came straight out of the navigation, which is how it ended
  // up at 4.12 against 4.5 while the headline sat on 3.77 against 3.
  //
  // Multiplies, so they darken proportionally and keep the relationships
  // inside the texture rather than flattening it toward one colour.
  col *= mix(1.0, uShadeBandFloor, band);
  col *= mix(1.0, 0.42, top);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/* Rendered below native resolution and scaled up by CSS. The field has no
   detail finer than a few dozen pixels, so nothing is lost, and it takes the
   per-frame cost of six fbm evaluations per pixel down by roughly a factor of
   five. */
const RENDER_SCALE = 0.45;

function readVar(cs: CSSStyleDeclaration, name: string, fallback: number) {
  const v = parseFloat(cs.getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
}

/* The shader's two colour ramps live in `palettes.css` alongside every other
   colour on the site, so a palette change repaints the hero and the bands below
   it from one definition. That means parsing CSS hex here — a small cost paid
   once per frame, against the alternative of a second place where the site's
   colour is decided. Only `#rgb` and `#rrggbb` are accepted, because those are
   the only forms the palette file is allowed to use. */
const RGB_CACHE = new Map<string, [number, number, number]>();

function readColor(
  cs: CSSStyleDeclaration,
  name: string,
  fallback: [number, number, number],
): [number, number, number] {
  const raw = cs.getPropertyValue(name).trim();
  if (!raw) return fallback;
  const hit = RGB_CACHE.get(raw);
  if (hit) return hit;

  let out: [number, number, number] | null = null;
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(raw);
  if (m) {
    const h = m[1];
    const full =
      h.length === 3
        ? h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
        : h;
    out = [
      parseInt(full.slice(0, 2), 16) / 255,
      parseInt(full.slice(2, 4), 16) / 255,
      parseInt(full.slice(4, 6), 16) / 255,
    ];
  }
  if (!out) return fallback;
  RGB_CACHE.set(raw, out);
  return out;
}

export function InkField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      // So `scripts/contrast-sweep.mjs` can read the field back and measure the
      // real ground rather than a model of it. Without this a WebGL canvas
      // reads as transparent black — which is the false negative that sent an
      // earlier pass off building an entirely different effect.
      preserveDrawingBuffer: true,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uShadeBandH = gl.getUniformLocation(prog, "uShadeBandH");
    const uShadeBandGain = gl.getUniformLocation(prog, "uShadeBandGain");
    const uShadeTop = gl.getUniformLocation(prog, "uShadeTop");
    const uShadeBandFloor = gl.getUniformLocation(prog, "uShadeBandFloor");
    const uSpotRadius = gl.getUniformLocation(prog, "uSpotRadius");
    const uSpotOrbit = gl.getUniformLocation(prog, "uSpotOrbit");
    const uSpotSpeed = gl.getUniformLocation(prog, "uSpotSpeed");
    const uSpotSurge = gl.getUniformLocation(prog, "uSpotSurge");
    const uInkDark = gl.getUniformLocation(prog, "uInkDark");
    const uInkLight = gl.getUniformLocation(prog, "uInkLight");
    const uPigmentDark = gl.getUniformLocation(prog, "uPigmentDark");
    const uPigmentLight = gl.getUniformLocation(prog, "uPigmentLight");

    // The reference pairs a slate-periwinkle base with a muted olive pigment —
    // near-complements, which is why its two materials read as separate. Blue
    // pigment cannot be dropped onto that base unchanged: blue on blue-grey is
    // one material with a slight hue wobble, not two.
    //
    // So the pair is rotated rather than half-swapped. The base moves to a
    // near-neutral graphite carrying only a trace of cool, and the pigment
    // becomes a genuinely saturated azure. The relationship the reference has
    // is preserved; only its position on the wheel changes.
    //
    // Both ramps now come from `palettes.css` — see `resize()`. The fallbacks
    // below are palette 03, which is what these uniforms held as literals
    // before the palette layer existed.
    const INK_DARK: [number, number, number] = [0.286, 0.29, 0.318];
    const INK_LIGHT: [number, number, number] = [0.663, 0.667, 0.694];
    const PIG_DARK: [number, number, number] = [0.063, 0.153, 0.396];
    const PIG_LIGHT: [number, number, number] = [0.353, 0.573, 0.961];

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width * RENDER_SCALE));
      const h = Math.max(1, Math.round(r.height * RENDER_SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
      // Read from CSS every frame so media queries drive the legibility
      // geometry, and the contrast harness — which samples this canvas — sees
      // whatever the breakpoint actually resolved to.
      const cs = getComputedStyle(canvas);
      gl.uniform1f(uShadeBandH, readVar(cs, "--shade-band-h", 0.3));
      gl.uniform1f(uShadeBandGain, readVar(cs, "--shade-band", 0.82));
      gl.uniform1f(uShadeTop, readVar(cs, "--shade-top", 0.24));
      gl.uniform1f(uShadeBandFloor, readVar(cs, "--shade-band-floor", 0.64));
      gl.uniform1f(uSpotRadius, readVar(cs, "--spot-radius", 0.42));
      gl.uniform1f(uSpotOrbit, readVar(cs, "--spot-orbit", 0.34));
      gl.uniform1f(uSpotSpeed, readVar(cs, "--spot-speed", 0.15));
      gl.uniform1f(uSpotSurge, readVar(cs, "--spot-surge", 1));

      const inkDark = readColor(cs, "--p-field-dark", INK_DARK);
      const inkLight = readColor(cs, "--p-field-light", INK_LIGHT);
      const pigDark = readColor(cs, "--p-pig-dark", PIG_DARK);
      const pigLight = readColor(cs, "--p-pig-light", PIG_LIGHT);
      gl.uniform3f(uInkDark, inkDark[0], inkDark[1], inkDark[2]);
      gl.uniform3f(uInkLight, inkLight[0], inkLight[1], inkLight[2]);
      gl.uniform3f(uPigmentDark, pigDark[0], pigDark[1], pigDark[2]);
      gl.uniform3f(uPigmentLight, pigLight[0], pigLight[1], pigLight[2]);
    };

    const renderAt = (seconds: number) => {
      resize();
      gl.uniform1f(uTime, seconds);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // Exposed for the contrast harness, which needs to sample several points
    // in the cycle rather than whatever frame it happens to catch.
    (canvas as unknown as { __inkRenderAt?: (s: number) => void }).__inkRenderAt = renderAt;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let lastT = 0;
    let running = false;
    const start0 = performance.now();

    const loop = (now: number) => {
      lastT = (now - start0) / 1000;
      renderAt(lastT);
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (running || reduced.matches) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const ro = new ResizeObserver(() => renderAt(lastT));
    // Nothing is gained by shading a field nobody is looking at, and this hero
    // sits at the top of a long page.
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? play() : pause()),
      { threshold: 0 },
    );
    const onVisibility = () => (document.hidden ? pause() : play());
    const onReducedChange = () => {
      pause();
      renderAt(lastT);
      play();
    };

    renderAt(0);
    ro.observe(canvas);
    io.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onReducedChange);

    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onReducedChange);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
