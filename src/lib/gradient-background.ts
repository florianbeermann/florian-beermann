import {
  gradientColumns,
  gradientPalette,
  morphStops,
  morphTiming,
  type GradientColor,
  type GradientColors,
} from "./gradient-field";

export type GradientMotionState = {
  playing: boolean;
  reason: "disconnected" | "context-lost" | "unavailable" | "reduced-motion" | "user" | "hidden" | "offscreen" | null;
};

function makeTemplate() {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      :host {
        --gradient-blue: var(--p-blue, #305cde);
        --gradient-ink: color-mix(in srgb, var(--gradient-blue) 6%, #000);
        --gradient-ice: color-mix(in srgb, var(--gradient-blue) 10%, #fff);
        --gradient-loop: 24s;
        --_sky: color-mix(in srgb, var(--gradient-blue) 66%, var(--gradient-ice));
        --_pale: color-mix(in srgb, var(--gradient-blue) 24%, var(--gradient-ice));
        --_mid: color-mix(in srgb, var(--gradient-blue) 78%, var(--gradient-ink));
        --_deep: color-mix(in srgb, var(--gradient-blue) 48%, var(--gradient-ink));
        --_navy: color-mix(in srgb, var(--gradient-blue) 22%, var(--gradient-ink));
        display: block;
        position: absolute;
        inset: 0;
        overflow: hidden;
        contain: strict;
        pointer-events: none;
        background: var(--gradient-blue);
      }
      canvas, .columns { position: absolute; inset: 0; width: 100%; height: 100%; }
      canvas { visibility: hidden; animation-duration: var(--gradient-loop); }
      .columns { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); }
      .column { position: relative; overflow: hidden; }
      .column::before {
        content: "";
        position: absolute;
        inset: 0;
        height: 400%;
        background-image: var(--_gradient);
        background-size: 100% 50%;
        background-repeat: repeat-y;
      }
      ${gradientColumns.map((gradient, index) => `
        .column:nth-child(${index + 1}) {
          --_gradient: linear-gradient(to bottom, ${gradient.stops
            .map((stop) => `${gradientPalette[stop.color]} ${stop.position * 100}%`).join(",")});
        }
      `).join("")}
      .swatches { display: none; }
      :host([data-renderer-ready]) canvas { visibility: visible; }
      :host([data-renderer-ready]) .columns { visibility: hidden; }
      @media print { :host { display: none; } }
    </style>
    <div class="columns" aria-hidden="true">
      ${gradientColumns.map(() => '<div class="column"></div>').join("")}
    </div>
    <canvas aria-hidden="true"></canvas>
    <div class="swatches">
      ${Object.entries(gradientPalette).map(([name, color]) =>
        `<span data-color="${name}" style="color:${color}"></span>`).join("")}
    </div>
  `;
  return template;
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Gradient background: could not allocate a shader.");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Gradient background shader: ${message}`);
  }
  return shader;
}

export class GradientBackgroundElement extends HTMLElement {
  static observedAttributes = ["paused"];
  private static template: HTMLTemplateElement;
  private readonly root: ShadowRoot;
  private canvas: HTMLCanvasElement;
  private inView = false;
  private hasSize = false;
  private contextLost = false;
  private unavailable = false;
  private elapsed = 0;
  private duration = 24;
  private lastTimestamp: number | null = null;
  private frame: number | null = null;
  private state: GradientMotionState = { playing: false, reason: "disconnected" };
  private readonly reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  private pixelRatioQuery: MediaQueryList | null = null;
  private readonly observer: IntersectionObserver | null;
  private readonly resizeObserver: ResizeObserver | null;
  private readonly styleObserver: MutationObserver;
  private gl: WebGLRenderingContext | null = null;
  private context2d: CanvasRenderingContext2D | null = null;
  private program: WebGLProgram | null = null;
  private buffer: WebGLBuffer | null = null;
  private colors: GradientColors | null = null;
  private readonly vertices = new Float32Array(
    gradientColumns.reduce((count, gradient) => count + gradient.stops.length - 1, 0) * 2 * 6 * 5,
  );

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    GradientBackgroundElement.template ??= makeTemplate();
    this.root.append(GradientBackgroundElement.template.content.cloneNode(true));
    const canvas = this.root.querySelector("canvas");
    if (!canvas) throw new Error("Gradient background: the rendering canvas is missing.");
    this.canvas = canvas;
    this.listenForContext();
    this.observer = typeof IntersectionObserver === "undefined" ? null
      : new IntersectionObserver(([entry]) => {
        // Snap boundaries can intersect the viewport with zero visible area.
        this.inView = entry.isIntersecting && entry.intersectionRatio > 0;
        this.syncMotion();
      }, { threshold: [0, Number.EPSILON] });
    this.resizeObserver = typeof ResizeObserver === "undefined" ? null
      : new ResizeObserver(this.resize);
    this.styleObserver = new MutationObserver(this.refresh);
  }

  connectedCallback() {
    this.setAttribute("aria-hidden", "true");
    this.initRenderer();
    this.refresh();
    const pixelBox = typeof ResizeObserverEntry !== "undefined"
      && "devicePixelContentBoxSize" in ResizeObserverEntry.prototype;
    this.resizeObserver?.observe(this, { box: pixelBox ? "device-pixel-content-box" : "content-box" });
    window.addEventListener("resize", this.resize);
    this.styleObserver.observe(this, { attributes: true, attributeFilter: ["style", "class"] });
    this.observer?.observe(this);
    if (!this.observer) this.inView = true;
    this.watchPixelRatio();
    document.addEventListener("visibilitychange", this.syncMotion);
    this.reducedMotion.addEventListener("change", this.syncMotion);
    this.syncMotion();
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    this.resizeObserver?.disconnect();
    this.styleObserver.disconnect();
    window.removeEventListener("resize", this.resize);
    this.pixelRatioQuery?.removeEventListener("change", this.onPixelRatioChange);
    document.removeEventListener("visibilitychange", this.syncMotion);
    this.reducedMotion.removeEventListener("change", this.syncMotion);
    this.inView = false;
    this.syncMotion();
    this.releaseProgram();
    this.canvas.width = this.canvas.height = 1;
    this.hasSize = false;
    this.removeAttribute("data-renderer-ready");
  }

  attributeChangedCallback() { this.syncMotion(); }
  get motionState(): GradientMotionState { return { ...this.state }; }
  pause() { this.setAttribute("paused", ""); }
  play() { this.removeAttribute("paused"); }

  refresh = () => {
    if (!this.isConnected || this.unavailable) return;
    const seconds = parseFloat(getComputedStyle(this.canvas).animationDuration);
    if (!Number.isFinite(seconds) || seconds <= 0) {
      throw new RangeError("Gradient background: --gradient-loop must be a positive CSS duration.");
    }
    this.advance(performance.now());
    this.elapsed *= seconds / this.duration;
    this.duration = seconds;
    const swatch = document.createElement("canvas");
    swatch.width = swatch.height = 1;
    const context = swatch.getContext("2d", { willReadFrequently: true });
    if (!context) {
      this.unavailable = true;
      this.removeAttribute("data-renderer-ready");
      console.warn("Gradient background: palette rendering is unavailable; showing static gradients.");
      this.syncMotion();
      return;
    }
    const readColor = (name: keyof GradientColors): GradientColor => {
      const element = this.root.querySelector<HTMLElement>(`[data-color="${name}"]`);
      if (!element) throw new Error(`Gradient background: missing ${name} palette swatch.`);
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = getComputedStyle(element).color;
      context.fillRect(0, 0, 1, 1);
      const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
      return [r / 255, g / 255, b / 255];
    };
    this.colors = {
      blue: readColor("blue"), ink: readColor("ink"), ice: readColor("ice"),
      sky: readColor("sky"), pale: readColor("pale"), mid: readColor("mid"),
      deep: readColor("deep"), navy: readColor("navy"),
      start1: readColor("start1"), start2: readColor("start2"), start3: readColor("start3"),
      start4: readColor("start4"), start5: readColor("start5"),
    };
    this.resize();
  };

  private listenForContext() {
    this.canvas.addEventListener("webglcontextlost", this.onContextLost);
    this.canvas.addEventListener("webglcontextrestored", this.onContextRestored);
  }

  private onContextLost = (event: Event) => {
    event.preventDefault();
    this.contextLost = true;
    this.removeAttribute("data-renderer-ready");
    this.syncMotion();
    console.warn("Gradient background: graphics context lost; motion is paused until recovery.");
  };

  private onContextRestored = () => {
    this.contextLost = false;
    this.program = null;
    this.buffer = null;
    if (this.isConnected) {
      this.initRenderer();
      this.resize();
      this.syncMotion();
    }
  };

  private releaseProgram() {
    if (this.gl && !this.contextLost) {
      this.gl.deleteBuffer(this.buffer);
      this.gl.deleteProgram(this.program);
    }
    this.buffer = null;
    this.program = null;
  }

  private useCanvas2d() {
    if (this.gl) {
      this.releaseProgram();
      this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
      this.canvas.removeEventListener("webglcontextrestored", this.onContextRestored);
      const replacement = document.createElement("canvas");
      replacement.setAttribute("aria-hidden", "true");
      this.canvas.replaceWith(replacement);
      this.canvas = replacement;
      this.gl = null;
      this.listenForContext();
    }
    this.context2d = this.canvas.getContext("2d", { alpha: false });
    this.unavailable = !this.context2d;
    console.warn(this.unavailable
      ? "Gradient background: canvas rendering is unavailable; showing static gradients."
      : "Gradient background: WebGL unavailable; using the animated Canvas 2D renderer.");
  }

  private initRenderer() {
    if (this.contextLost) return;
    this.unavailable = false;
    if (!this.gl && !this.context2d) {
      this.gl = this.canvas.getContext("webgl", {
        alpha: false, antialias: false, depth: false, stencil: false,
        powerPreference: "low-power",
      });
      if (!this.gl) this.useCanvas2d();
    }
    if (!this.gl || this.program) return;
    const gl = this.gl;
    let vertex: WebGLShader | null = null;
    let fragment: WebGLShader | null = null;
    try {
      vertex = compileShader(gl, gl.VERTEX_SHADER, `
        attribute vec2 a_position;
        attribute vec3 a_color;
        varying vec3 v_color;
        void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
          v_color = a_color;
        }
      `);
      fragment = compileShader(gl, gl.FRAGMENT_SHADER, `
        precision highp float;
        varying vec3 v_color;
        void main() {
          float dither = fract(dot(gl_FragCoord.xy, vec2(0.754877666, 0.569840296))) - 0.5;
          gl_FragColor = vec4(v_color + dither / 255.0, 1.0);
        }
      `);
      this.program = gl.createProgram();
      if (!this.program) throw new Error("Gradient background: could not allocate a graphics program.");
      gl.attachShader(this.program, vertex);
      gl.attachShader(this.program, fragment);
      gl.linkProgram(this.program);
      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        throw new Error(`Gradient background graphics program: ${gl.getProgramInfoLog(this.program)}`);
      }
      this.buffer = gl.createBuffer();
      if (!this.buffer) throw new Error("Gradient background: could not allocate a vertex buffer.");
      gl.useProgram(this.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.vertices.byteLength, gl.DYNAMIC_DRAW);
      const position = gl.getAttribLocation(this.program, "a_position");
      const color = gl.getAttribLocation(this.program, "a_color");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 20, 0);
      gl.enableVertexAttribArray(color);
      gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 20, 8);
    } catch (error) {
      console.warn("Gradient background: graphics initialisation failed; trying Canvas 2D.", error);
      this.useCanvas2d();
    } finally {
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    }
  }

  private onPixelRatioChange = () => {
    this.watchPixelRatio();
    this.resize();
  };

  private watchPixelRatio() {
    this.pixelRatioQuery?.removeEventListener("change", this.onPixelRatioChange);
    this.pixelRatioQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    this.pixelRatioQuery.addEventListener("change", this.onPixelRatioChange);
  }

  private resize = () => {
    if (!this.isConnected || !this.colors || this.contextLost || this.unavailable) return;
    if (this.pixelRatioQuery && !this.pixelRatioQuery.matches) this.watchPixelRatio();
    const bounds = this.getBoundingClientRect();
    this.hasSize = bounds.width > 0 && bounds.height > 0;
    if (this.hasSize) {
      const ratio = window.devicePixelRatio || 1;
      const requestedWidth = Math.max(1, Math.round(bounds.width * ratio));
      const requestedHeight = Math.max(1, Math.round(bounds.height * ratio));
      const limits: Int32Array | number[] = this.gl
        ? this.gl.getParameter(this.gl.MAX_VIEWPORT_DIMS) : [16384, 16384];
      const scale = Math.min(1, limits[0] / requestedWidth, limits[1] / requestedHeight);
      if (scale < 1) {
        console.warn("Gradient background: requested dimensions exceed this device's canvas limit.");
      }
      const width = Math.max(1, Math.floor(requestedWidth * scale));
      const height = Math.max(1, Math.floor(requestedHeight * scale));
      if (this.canvas.width !== width || this.canvas.height !== height) {
        this.canvas.width = width;
        this.canvas.height = height;
      }
      this.gl?.viewport(0, 0, width, height);
      this._draw(this.elapsed / this.duration);
    }
    this.syncMotion();
  };

  _morphTiming(column: number, block: number, phase: number) {
    return morphTiming(column, block, phase);
  }

  _morphStops(column: number, phase: number) {
    if (!this.colors) throw new Error("Gradient background: the palette is not ready.");
    return morphStops(this.colors, column, phase);
  }

  _draw(travelPhase: number, morphPhase = travelPhase) {
    if (!this.hasSize || this.contextLost || this.unavailable || !this.colors) return;
    travelPhase = ((travelPhase % 1) + 1) % 1;
    morphPhase = ((morphPhase % 1) + 1) % 1;
    const { width, height } = this.canvas;
    const vertices = this.vertices;
    let cursor = 0;
    this.context2d?.clearRect(0, 0, width, height);
    const vertex = (x: number, y: number, color: GradientColor) => {
      vertices[cursor++] = x;
      vertices[cursor++] = 1 - y * 2;
      vertices[cursor++] = color[0];
      vertices[cursor++] = color[1];
      vertices[cursor++] = color[2];
    };
    for (let column = 0; column < gradientColumns.length; column++) {
      const stops = this._morphStops(column, morphPhase);
      const offset = -2 * (((travelPhase * gradientColumns[column].travel) % 1 + 1) % 1);
      const left = Math.round(column * width / 5);
      const right = Math.round((column + 1) * width / 5);
      for (let copy = 0; copy < 2; copy++) {
        const top = offset + copy * 2;
        if (this.context2d) {
          const fill = this.context2d.createLinearGradient(0, top * height, 0, (top + 2) * height);
          for (const stop of stops) {
            fill.addColorStop(stop.position, `rgb(${stop.color.map((value) => value * 255).join(" ")})`);
          }
          this.context2d.fillStyle = fill;
          const topPixel = Math.round(top * height);
          const bottomPixel = Math.round((top + 2) * height);
          this.context2d.fillRect(left, topPixel, right - left, bottomPixel - topPixel);
          continue;
        }
        for (let index = 1; index < stops.length; index++) {
          const a = stops[index - 1], b = stops[index];
          const y0 = top + a.position * 2, y1 = top + b.position * 2;
          if (y1 <= y0 || y1 <= 0 || y0 >= 1) continue;
          const x0 = left / width * 2 - 1, x1 = right / width * 2 - 1;
          vertex(x0, y0, a.color); vertex(x1, y0, a.color); vertex(x0, y1, b.color);
          vertex(x1, y0, a.color); vertex(x1, y1, b.color); vertex(x0, y1, b.color);
        }
      }
    }
    // The mesh interpolates live stops at full resolution, without texture uploads.
    if (this.gl) {
      this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, vertices.subarray(0, cursor));
      this.gl.drawArrays(this.gl.TRIANGLES, 0, cursor / 5);
    }
    if (!this.hasAttribute("data-renderer-ready")) this.setAttribute("data-renderer-ready", "");
  }

  private advance(timestamp: number) {
    if (this.lastTimestamp !== null) {
      this.elapsed = (this.elapsed + (timestamp - this.lastTimestamp) / 1000) % this.duration;
      this.lastTimestamp = timestamp;
    }
  }

  private tick = (timestamp: number) => {
    this.frame = null;
    if (!this.state.playing) return;
    this.advance(timestamp);
    this.lastTimestamp = timestamp;
    this._draw(this.elapsed / this.duration);
    this.frame = requestAnimationFrame(this.tick);
  };

  private syncMotion = () => {
    const reason: GradientMotionState["reason"] = !this.isConnected ? "disconnected"
      : this.contextLost ? "context-lost"
        : this.unavailable ? "unavailable"
          : this.reducedMotion.matches ? "reduced-motion"
            : this.hasAttribute("paused") ? "user"
              : document.hidden ? "hidden"
                : !this.inView || !this.hasSize ? "offscreen" : null;
    const playing = reason === null;
    this.toggleAttribute("data-motion-paused", !playing);
    if (this.state.playing === playing && this.state.reason === reason) return;
    if (!playing) {
      this.advance(performance.now());
      if (this.frame !== null) cancelAnimationFrame(this.frame);
      this.frame = null;
      this.lastTimestamp = null;
    }
    this.state = { playing, reason };
    if (playing && this.frame === null) this.frame = requestAnimationFrame(this.tick);
    this.dispatchEvent(new CustomEvent<GradientMotionState>("motionchange", { detail: this.motionState }));
  };
}

if (!customElements.get("gradient-background")) {
  customElements.define("gradient-background", GradientBackgroundElement);
}

// Registered element classes cannot be replaced; renderer edits need a fresh registry.
if (import.meta.hot) import.meta.hot.accept(() => window.location.reload());
