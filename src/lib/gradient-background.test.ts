import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GradientBackgroundElement } from "./gradient-background";

let intersection: (entries: IntersectionObserverEntry[]) => void;
let intersectionOptions: IntersectionObserverInit | undefined;
let resize: () => void;
const observeSize = vi.fn();
const cancelFrame = vi.fn();
const elements: GradientBackgroundElement[] = [];

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  vi.stubGlobal("devicePixelRatio", 1);
  vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
  vi.stubGlobal("cancelAnimationFrame", cancelFrame);
  observeSize.mockClear();
  cancelFrame.mockClear();
  vi.stubGlobal("IntersectionObserver", class implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds = [0, Number.EPSILON];
    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      intersection = (entries) => callback(entries, this);
      intersectionOptions = options;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  });
  vi.stubGlobal("ResizeObserver", class implements ResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      resize = () => callback([], this);
    }
    observe = observeSize;
    unobserve() {}
    disconnect() {}
  });
  vi.stubGlobal("ResizeObserverEntry", class {
    get devicePixelContentBoxSize() { return []; }
  });
  const context: Pick<CanvasRenderingContext2D,
    "clearRect" | "fillRect" | "fillStyle" | "createLinearGradient" | "getImageData"> = {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    fillStyle: "",
    createLinearGradient: () => ({ addColorStop: vi.fn() }),
    getImageData: () => ({
      data: new Uint8ClampedArray([48, 92, 222, 255]), width: 1, height: 1, colorSpace: "srgb",
    }),
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockImplementation((kind) => kind === "2d" ? context as CanvasRenderingContext2D : null);
});

afterEach(() => {
  elements.splice(0).forEach((element) => element.remove());
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function mount() {
  const background = new GradientBackgroundElement();
  elements.push(background);
  vi.spyOn(background, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 800, 450));
  const canvas = background.shadowRoot!.querySelector("canvas")!;
  // jsdom does not apply stylesheets inside a shadow root.
  canvas.style.animationDuration = "24s";
  document.body.append(background);
  return { background, canvas };
}

function visibility(background: GradientBackgroundElement, ratio: number) {
  intersection(
    [{
      target: background, isIntersecting: true, intersectionRatio: ratio,
      boundingClientRect: background.getBoundingClientRect(),
      intersectionRect: new DOMRect(0, 0, 800, 450 * ratio), rootBounds: null, time: 0,
    }],
  );
}

describe("gradient renderer lifecycle", () => {
  it("pauses at an edge-touching snap boundary and observes positive-area re-entry", () => {
    const { background } = mount();
    expect(intersectionOptions?.threshold).toEqual([0, Number.EPSILON]);
    visibility(background, 1);
    expect(background.motionState).toEqual({ playing: true, reason: null });
    visibility(background, 0);
    expect(background.motionState).toEqual({ playing: false, reason: "offscreen" });
    expect(cancelFrame).toHaveBeenCalledWith(1);
    visibility(background, 0.001);
    expect(background.motionState.playing).toBe(true);
  });

  it("resizes at full DPR on device-pixel notifications even while user-paused", () => {
    const { background, canvas } = mount();
    expect(observeSize).toHaveBeenCalledWith(background, { box: "device-pixel-content-box" });
    background.pause();
    expect([canvas.width, canvas.height]).toEqual([800, 450]);
    vi.stubGlobal("devicePixelRatio", 2);
    resize();
    expect([canvas.width, canvas.height]).toEqual([1600, 900]);
    expect(background.motionState).toEqual({ playing: false, reason: "user" });
    vi.stubGlobal("devicePixelRatio", 1);
    window.dispatchEvent(new Event("resize"));
    expect([canvas.width, canvas.height]).toEqual([800, 450]);
  });

  it("retains user pause across disconnection and reconnects without a second registration", () => {
    const { background, canvas } = mount();
    background.pause();
    background.remove();
    expect(background.motionState.reason).toBe("disconnected");
    expect([canvas.width, canvas.height]).toEqual([1, 1]);
    document.body.append(background);
    visibility(background, 1);
    expect(background.motionState).toEqual({ playing: false, reason: "user" });
    expect([canvas.width, canvas.height]).toEqual([800, 450]);
    expect(background).toHaveAttribute("data-renderer-ready");
    expect(customElements.get("gradient-background")).toBe(GradientBackgroundElement);
  });

  it("pauses when hidden and resumes only when both visible and not user-paused", () => {
    const { background } = mount();
    visibility(background, 1);
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    document.dispatchEvent(new Event("visibilitychange"));
    expect(background.motionState).toEqual({ playing: false, reason: "hidden" });
    background.pause();
    hidden.mockReturnValue(false);
    document.dispatchEvent(new Event("visibilitychange"));
    expect(background.motionState).toEqual({ playing: false, reason: "user" });
    background.play();
    expect(background.motionState.playing).toBe(true);
  });
});
