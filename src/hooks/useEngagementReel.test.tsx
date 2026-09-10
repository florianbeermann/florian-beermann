import { act, cleanup, fireEvent, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useEngagementReel } from "./useEngagementReel";

class TestAnimation {
  currentTime: number | null = null;
  effect = { getComputedTiming: () => ({ duration: 1000 }) };

  constructor(readonly animationName: string) {}
}

let observers: TestResizeObserver[];
class TestResizeObserver implements ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor(private readonly callback: ResizeObserverCallback) {
    observers.push(this);
  }

  notify() {
    this.callback([], this);
  }
}

let media: MediaQueryList;
let track: HTMLElement;
let top: number;
let height: number;
let animations: TestAnimation[];
let frames: Map<number, FrameRequestCallback>;
let getAnimations: ReturnType<typeof vi.fn>;
let supports: ReturnType<typeof vi.fn>;

beforeEach(() => {
  observers = [];
  frames = new Map();
  top = 0;
  height = 3 * window.innerHeight;
  animations = [
    "engagement-first",
    "engagement-second",
    "engagement-third",
    "engagement-progress",
    "engagement-step-first",
    "engagement-step-second",
    "engagement-step-third",
    "unrelated-animation",
  ].map((name) => new TestAnimation(name));
  media = Object.assign(new EventTarget(), {
    matches: true,
    media: "(prefers-reduced-motion: no-preference) and (min-width: 901px)",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  });
  supports = vi.fn(() => false);
  vi.stubGlobal("CSS", { supports });
  vi.stubGlobal("CSSAnimation", TestAnimation);
  vi.stubGlobal("ResizeObserver", TestResizeObserver);
  vi.spyOn(window, "matchMedia").mockReturnValue(media);
  let nextFrame = 0;
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    frames.set(++nextFrame, callback);
    return nextFrame;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
    frames.delete(id);
  });

  track = document.createElement("section");
  vi.spyOn(track, "getBoundingClientRect").mockImplementation(
    () => new DOMRect(0, top, 1280, height),
  );
  getAnimations = vi.fn(() => animations);
  Object.defineProperty(track, "getAnimations", { value: getAnimations });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function renderReel() {
  const ref = { current: track };
  return renderHook(() => useEngagementReel(ref));
}

function flushFrame() {
  const callbacks = [...frames.values()];
  frames.clear();
  act(() => callbacks.forEach((callback) => callback(0)));
}

function setMediaMatches(matches: boolean) {
  Object.defineProperty(media, "matches", { value: matches, configurable: true });
  act(() => media.dispatchEvent(new Event("change")));
}

describe("service reel animation fallback", () => {
  it("leaves browsers with native scroll timelines entirely on the CSS path", () => {
    supports.mockReturnValue(true);
    renderReel();
    expect(supports).toHaveBeenCalledWith("animation-timeline: view()");
    expect(window.matchMedia).not.toHaveBeenCalled();
    expect(getAnimations).not.toHaveBeenCalled();
    expect(observers).toHaveLength(0);
  });

  it.each([
    [1, 0],
    [0, 0],
    [-0.5, 250],
    [-1, 500],
    [-2, 1000],
    [-3, 1000],
  ])("seeks the shared keyframes at a track top of %s viewports", (position, time) => {
    top = position * window.innerHeight;
    renderReel();
    expect(getAnimations).toHaveBeenCalledWith({ subtree: true });
    for (const animation of animations.slice(0, 7)) {
      expect(animation.currentTime).toBe(time);
    }
    expect(animations[7].currentTime).toBeNull();
  });

  it("coalesces passive scroll updates without driving the page's scrolling", () => {
    const addListener = vi.spyOn(window, "addEventListener");
    const scrollTo = vi.spyOn(window, "scrollTo");
    renderReel();
    expect(addListener).toHaveBeenCalledWith("scroll", expect.any(Function), { passive: true });
    top = -window.innerHeight;
    fireEvent.scroll(window);
    fireEvent.scroll(window);
    expect(frames.size).toBe(1);
    expect(animations[0].currentTime).toBe(0);
    flushFrame();
    expect(animations[0].currentTime).toBe(500);
    expect(frames.size).toBe(0);
    expect(scrollTo).not.toHaveBeenCalled();
    expect(addListener.mock.calls.some(([type]) => ["wheel", "touchmove", "keydown"].includes(type))).toBe(false);
  });

  it("recalculates after layout changes, viewport resizing and history restoration", () => {
    renderReel();
    expect(observers[0].observe).toHaveBeenCalledWith(track);
    expect(observers[0].observe).toHaveBeenCalledWith(document.documentElement);
    top = -window.innerHeight;
    height = 5 * window.innerHeight;
    act(() => observers[0].notify());
    flushFrame();
    expect(animations[0].currentTime).toBe(250);

    height = 3 * window.innerHeight;
    fireEvent.resize(window);
    flushFrame();
    expect(animations[0].currentTime).toBe(500);

    top = -2 * window.innerHeight;
    fireEvent(window, new Event("pageshow"));
    flushFrame();
    expect(animations[0].currentTime).toBe(1000);
  });

  it("keeps mobile and reduced-motion layouts static, and responds to preference changes", () => {
    setMediaMatches(false);
    renderReel();
    expect(window.matchMedia).toHaveBeenCalledWith(
      "(prefers-reduced-motion: no-preference) and (min-width: 901px)",
    );
    expect(getAnimations).not.toHaveBeenCalled();
    expect(observers).toHaveLength(0);

    top = -window.innerHeight;
    setMediaMatches(true);
    expect(animations[0].currentTime).toBe(500);
    fireEvent.scroll(window);
    setMediaMatches(false);
    expect(observers[0].disconnect).toHaveBeenCalled();
    expect(frames.size).toBe(0);
    fireEvent.scroll(window);
    expect(frames.size).toBe(0);

    top = -2 * window.innerHeight;
    setMediaMatches(true);
    expect(animations[0].currentTime).toBe(1000);
  });

  it("removes listeners, observers and a pending frame when leaving the page", () => {
    const { unmount } = renderReel();
    fireEvent.scroll(window);
    expect(frames.size).toBe(1);
    unmount();
    expect(frames.size).toBe(0);
    expect(observers[0].disconnect).toHaveBeenCalled();
    fireEvent.scroll(window);
    fireEvent.resize(window);
    setMediaMatches(true);
    expect(frames.size).toBe(0);
    expect(observers).toHaveLength(1);
  });
});
