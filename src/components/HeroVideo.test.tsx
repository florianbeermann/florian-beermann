import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeroVideo } from "./HeroVideo";

let notifyVisibility: ((entries: IntersectionObserverEntry[]) => void) | undefined;
let paused = true;
let reducedMotion = false;
const originalConnection = Object.getOwnPropertyDescriptor(navigator, "connection");

beforeEach(() => {
  paused = true;
  reducedMotion = false;
  notifyVisibility = undefined;
  Object.defineProperty(navigator, "connection", { configurable: true, value: undefined });
  vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  vi.spyOn(window, "matchMedia").mockImplementation(() => ({
    ...query,
    get matches() { return reducedMotion; },
  }));
  vi.stubGlobal("IntersectionObserver", class implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds = [];
    constructor(callback: IntersectionObserverCallback) {
      notifyVisibility = (entries) => callback(entries, this);
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  });
  vi.spyOn(HTMLMediaElement.prototype, "paused", "get").mockImplementation(() => paused);
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (this: HTMLMediaElement) {
    paused = false;
    this.dispatchEvent(new Event("playing"));
    return Promise.resolve();
  });
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(function (this: HTMLMediaElement) {
    paused = true;
    this.dispatchEvent(new Event("pause"));
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  if (originalConnection) {
    Object.defineProperty(navigator, "connection", originalConnection);
  } else {
    Reflect.deleteProperty(navigator, "connection");
  }
});

function renderVideo(onCloudPhase?: (phase: number) => void) {
  const result = render(
    <HeroVideo className="hero-video" src="/hero-loop.mp4" srcSmall="/hero-loop-sm.mp4" poster="/hero-poster.jpg" onCloudPhase={onCloudPhase} />,
  );
  const target = result.container.querySelector(".hero-video")!;
  const setVisible = (isIntersecting: boolean) => {
    if (!notifyVisibility) throw new Error("The visibility observer was not created.");
    const rectangle = new DOMRect();
    act(() => notifyVisibility?.([{
      target,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
      time: 0,
      boundingClientRect: rectangle,
      intersectionRect: rectangle,
      rootBounds: null,
    }]));
  };
  return { ...result, target, setVisible };
}

describe("background video", () => {
  it("opens after the loop seam as the original cloud animation did", () => {
    vi.spyOn(HTMLMediaElement.prototype, "duration", "get").mockReturnValue(14);
    const { container } = renderVideo();
    const video = container.querySelector("video")!;
    fireEvent.loadedMetadata(video);
    expect(video.currentTime).toBe(2.4);
  });

  it("shows its poster without waiting for a video download", () => {
    const { container, target } = renderVideo();
    expect(target).toHaveStyle({ backgroundImage: 'url("/hero-poster.jpg")' });
    expect(container.querySelector("video")).not.toHaveAttribute("src");
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it("plays while visible without exposing playback controls", async () => {
    const { setVisible } = renderVideo();
    setVisible(true);
    await waitFor(() => expect(paused).toBe(false));
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(document.querySelector("video")).not.toHaveAttribute("controls");
  });

  it("pauses automatically when the hero leaves the viewport", async () => {
    const { setVisible } = renderVideo();
    setVisible(true);
    await waitFor(() => expect(paused).toBe(false));
    setVisible(false);
    expect(paused).toBe(true);
  });

  it("uses the still image without downloading video under reduced motion", () => {
    reducedMotion = true;
    const { container, setVisible } = renderVideo();
    setVisible(true);
    expect(container.querySelector("video")).not.toHaveAttribute("src");
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("uses only the poster when the visitor requests reduced data", () => {
    Object.defineProperty(navigator, "connection", { configurable: true, value: { saveData: true } });
    const { container } = renderVideo();
    expect(container.querySelector("video")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("keeps the poster when automatic playback is refused", async () => {
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(
      new DOMException("Automatic playback refused", "NotAllowedError"),
    );
    const { container, setVisible } = renderVideo();
    setVisible(true);
    await waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1));
    expect(container.querySelector("video")).not.toHaveAttribute("data-showing");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(paused).toBe(true);
  });

  it("pauses when the browser tab is hidden", async () => {
    const { setVisible } = renderVideo();
    setVisible(true);
    await waitFor(() => expect(paused).toBe(false));
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    fireEvent(document, new Event("visibilitychange"));
    expect(paused).toBe(true);
  });

  it("clears the cloud colour when leaving the hero and when unmounted", async () => {
    const onCloudPhase = vi.fn();
    const { setVisible, unmount } = renderVideo(onCloudPhase);
    setVisible(true);
    await waitFor(() => expect(paused).toBe(false));
    onCloudPhase.mockClear();
    setVisible(false);
    expect(onCloudPhase).toHaveBeenLastCalledWith(0);
    setVisible(true);
    await waitFor(() => expect(paused).toBe(false));
    onCloudPhase.mockClear();
    unmount();
    expect(onCloudPhase).toHaveBeenLastCalledWith(0);
  });
});
