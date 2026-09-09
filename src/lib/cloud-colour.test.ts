import { afterEach, describe, expect, it, vi } from "vitest";
import { advanceCloudPhase, getCloudPhase, watchCloudColour } from "./cloud-colour";

afterEach(() => vi.restoreAllMocks());

function frame(level: number) {
  const pixels = new Uint8ClampedArray(32 * 18 * 4);
  for (let index = 0; index < pixels.length; index += 4) {
    pixels[index] = pixels[index + 1] = pixels[index + 2] = level;
    pixels[index + 3] = 255;
  }
  return pixels;
}

describe("cloud colour signal", () => {
  it("keeps dark mountain frames neutral and turns bright cloud frames blue", () => {
    expect(getCloudPhase(frame(30))).toBe(0);
    expect(getCloudPhase(frame(255))).toBe(1);
  });

  it("uses the original continuous brightness curve", () => {
    expect(getCloudPhase(frame(102))).toBeCloseTo((0.4 - 0.14) / (0.76 - 0.14), 6);
    expect(getCloudPhase(frame(150))).toBeGreaterThan(getCloudPhase(frame(102)));
  });

  it("ignores isolated dark pixels but not a dark region", () => {
    const pixels = frame(220);
    pixels.fill(0, 0, 8);
    expect(getCloudPhase(pixels)).toBe(1);
    pixels.fill(0, 0, 12);
    expect(getCloudPhase(pixels)).toBe(0);
  });

  it("does not mistake a bright average for a uniformly bright visible crop", () => {
    const pixels = frame(255);
    pixels.fill(0, 0, pixels.length / 4);
    expect(getCloudPhase(pixels)).toBe(0);
  });

  it("can reuse its sampling buffer without retaining the previous frame", () => {
    const buffer = new Float32Array(32 * 18);
    expect(getCloudPhase(frame(220), buffer)).toBe(1);
    expect(getCloudPhase(frame(0), buffer)).toBe(0);
  });

  it("rejects incomplete image data", () => {
    expect(() => getCloudPhase(new Uint8ClampedArray())).toThrow(RangeError);
    expect(() => getCloudPhase(new Uint8ClampedArray(3))).toThrow(RangeError);
    expect(() => getCloudPhase(frame(100), new Float32Array(2))).toThrow(RangeError);
  });
});

describe("cloud colour smoothing", () => {
  it("uses the original rate in both directions", () => {
    expect(advanceCloudPhase(0, 1, 16)).toBeCloseTo(0.112);
    expect(advanceCloudPhase(0.5, 0, 16)).toBeCloseTo(0.388);
  });

  it("settles on the target without overshooting", () => {
    expect(advanceCloudPhase(0.2, 0.21, 16)).toBe(0.21);
    expect(advanceCloudPhase(0.2, 0.19, 16)).toBe(0.19);
    expect(advanceCloudPhase(0.2, 1, 0)).toBe(0.2);
  });

  it("caps elapsed time after a stalled frame", () => {
    expect(advanceCloudPhase(0, 1, 2000)).toBeCloseTo(0.7);
  });

  it("rejects invalid animation values", () => {
    expect(() => advanceCloudPhase(Number.NaN, 1, 16)).toThrow(RangeError);
    expect(() => advanceCloudPhase(0, 2, 16)).toThrow(RangeError);
    expect(() => advanceCloudPhase(0, 1, -1)).toThrow(RangeError);
  });
});

describe("cloud frame surfaces", () => {
  it("separates accelerated drawing from pixel reading and handles unavailable contexts", () => {
    const video = document.createElement("video");
    Object.defineProperties(video, {
      readyState: { value: 4 },
      videoWidth: { value: 2560 },
      videoHeight: { value: 1440 },
      paused: { value: false },
      requestVideoFrameCallback: { value: undefined },
    });
    vi.spyOn(video, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 1440, 900));
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    let frameCallback: FrameRequestCallback | undefined;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      frameCallback = callback;
      return 1;
    });
    const onPhase = vi.fn();
    const stop = watchCloudColour(video, onPhase);
    expect(frameCallback).toBeTypeOf("function");
    frameCallback?.(16);
    expect(getContext).toHaveBeenCalledWith("2d", { willReadFrequently: false });
    expect(getContext).toHaveBeenCalledWith("2d", { willReadFrequently: true });
    expect(new Set(getContext.mock.contexts).size).toBe(2);
    expect(warning).toHaveBeenCalledOnce();
    expect(onPhase).toHaveBeenLastCalledWith(0);
    stop();
  });
});
