import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { initArtworkSlideshow } from "./artwork-slideshow";

const controllers: ReturnType<typeof initArtworkSlideshow>[] = [];
const observers: TestIntersectionObserver[] = [];
const animations: TestAnimation[] = [];
const transitionStarts: number[] = [];
const originalAnimate = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "animate");

class TestIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds = [0];
  readonly observe = vi.fn();
  readonly unobserve = vi.fn();
  readonly disconnect = vi.fn();

  constructor(private readonly callback: IntersectionObserverCallback) {
    observers.push(this);
  }

  takeRecords(): IntersectionObserverEntry[] { return []; }

  setVisible(target: Element, isIntersecting: boolean) {
    const bounds = target.getBoundingClientRect();
    this.callback([{
      target, isIntersecting, intersectionRatio: isIntersecting ? 1 : 0,
      boundingClientRect: bounds, intersectionRect: bounds, rootBounds: null,
      time: performance.now(),
    }], this);
  }
}

class TestMotionPreference extends EventTarget {
  matches = false;

  setReduced(matches: boolean) {
    this.matches = matches;
    this.dispatchEvent(new Event("change"));
  }
}

class TestAnimation {
  onfinish: (() => void) | null = null;
  oncancel: (() => void) | null = null;
  private readonly timer: number;
  readonly cancel = vi.fn(() => {
    window.clearTimeout(this.timer);
    this.oncancel?.();
  });

  constructor(duration: number) {
    this.timer = window.setTimeout(() => this.onfinish?.(), duration);
  }
}

let motion: TestMotionPreference;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "performance"] });
  vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  motion = new TestMotionPreference();
  vi.stubGlobal("matchMedia", vi.fn(() => motion));
  vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
  Object.defineProperty(HTMLElement.prototype, "animate", {
    configurable: true,
    value: vi.fn((_keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
      const animation = new TestAnimation(typeof options.duration === "number" ? options.duration : 0);
      animations.push(animation);
      transitionStarts.push(performance.now());
      return animation;
    }),
  });
});

afterEach(() => {
  controllers.splice(0).forEach((controller) => controller.destroy());
  document.body.replaceChildren();
  observers.length = 0;
  animations.length = 0;
  transitionStarts.length = 0;
  if (originalAnimate) {
    Object.defineProperty(HTMLElement.prototype, "animate", originalAnimate);
  } else {
    Reflect.deleteProperty(HTMLElement.prototype, "animate");
  }
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

function fixture(count = 4, duration = 1200) {
  const gallery = document.createElement("figure");
  gallery.className = "artwork-gallery";
  gallery.dataset.artworkSlideshow = "";
  gallery.dataset.interval = "4000";
  gallery.dataset.fadeDuration = String(duration);
  const stage = document.createElement("div");
  stage.className = "artwork-stage";
  const caption = document.createElement("span");
  caption.dataset.artworkCaption = "";
  const status = document.createElement("span");
  status.dataset.artworkStatus = "";
  status.setAttribute("role", "status");
  status.hidden = true;
  const figcaption = document.createElement("figcaption");
  figcaption.append(caption, status);
  gallery.append(stage, figcaption);
  const slides = Array.from({ length: count }, (_, index) => {
    const element = document.createElement("div");
    element.className = index === 0 ? "artwork-slide is-active" : "artwork-slide";
    element.dataset.caption = `Test artwork ${index + 1}`;
    if (index % 2 === 0) element.dataset.shade = "";
    element.hidden = index !== 0;
    element.setAttribute("aria-hidden", String(index !== 0));
    const image = document.createElement("img");
    image.src = `/artwork-${index}.webp`;
    image.alt = `Test artwork ${index + 1}`;
    image.loading = index === 0 ? "eager" : "lazy";
    const decode = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
    Object.defineProperties(image, {
      decode: { configurable: true, value: decode },
      complete: { configurable: true, value: true },
      naturalWidth: { configurable: true, value: 1200 },
    });
    const picture = document.createElement("picture");
    picture.append(image);
    element.append(picture);
    stage.append(element);
    return { element, image, decode };
  });
  document.body.append(gallery);
  return { gallery, slides, caption, status };
}

function initialize(gallery: HTMLElement) {
  const controller = initArtworkSlideshow(gallery);
  controllers.push(controller);
  return controller;
}

function observeVisible(gallery: HTMLElement) {
  const observer = observers[observers.length - 1];
  if (!observer) throw new Error("The slideshow did not register an observer.");
  observer.setVisible(gallery, true);
  return observer;
}

function deferredDecode() {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

describe("artwork slideshow", () => {
  it("has no automatic document-wide initialization on import", async () => {
    const { gallery } = fixture();
    vi.resetModules();
    await import("./artwork-slideshow");
    expect(gallery.dataset.playback).toBeUndefined();
    expect(observers).toHaveLength(0);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("advances through every slide and wraps without controls or hover pausing", async () => {
    const { gallery, slides, caption } = fixture();
    initialize(gallery);
    expect(gallery.dataset.slideCount).toBe("4");
    expect(gallery.dataset.playback).toBe("paused");
    observeVisible(gallery);
    gallery.dispatchEvent(new MouseEvent("mouseenter"));
    await vi.advanceTimersByTimeAsync(5200);
    for (const current of [1, 2, 3, 0]) {
      expect(gallery.dataset.currentSlide).toBe(String(current));
      expect(caption).toHaveTextContent(`Test artwork ${current + 1}`);
      slides.forEach(({ element }, index) => {
        expect(element.hidden).toBe(index !== current);
        expect(element).toHaveAttribute("aria-hidden", String(index !== current));
        expect(element).toHaveAttribute("role", "group");
        expect(element).toHaveAttribute("aria-label", `Artwork ${index + 1} of 4`);
        expect(element.classList.contains("is-active")).toBe(index === current);
        expect(element.hasAttribute("data-shade")).toBe(index % 2 === 0);
      });
      if (current !== 0) await vi.advanceTimersByTimeAsync(4000);
    }
    expect(gallery.querySelectorAll("button,a,input")).toHaveLength(0);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("keeps a single artwork still without observers, timers, or controls", async () => {
    const { gallery, slides, caption } = fixture(1);
    initialize(gallery);
    await vi.advanceTimersByTimeAsync(20000);
    expect(gallery.dataset.playback).toBe("single");
    expect(gallery.dataset.currentSlide).toBe("0");
    expect(gallery.dataset.slideCount).toBe("1");
    expect(caption).toHaveTextContent("Test artwork 1");
    expect(slides[0].decode).not.toHaveBeenCalled();
    expect(observers).toHaveLength(0);
    expect(animations).toHaveLength(0);
    expect(vi.getTimerCount()).toBe(0);
    expect(gallery.querySelectorAll("button,a,input")).toHaveLength(0);
  });

  it("includes the 1200ms fade in the 4000ms cadence and preloads only one image ahead", async () => {
    const { gallery, slides, caption } = fixture();
    delete gallery.dataset.interval;
    delete gallery.dataset.fadeDuration;
    initialize(gallery);
    observeVisible(gallery);
    expect(slides.map(({ image }) => image.loading)).toEqual(["eager", "eager", "lazy", "lazy"]);
    expect(slides[1].decode).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(4000);
    expect(gallery.dataset.playback).toBe("transitioning");
    expect(gallery.dataset.currentSlide).toBe("0");
    expect(slides.filter(({ element }) => !element.hidden)).toHaveLength(2);
    expect(slides[0].element).toHaveClass("is-active");
    expect(slides[0].element).toHaveAttribute("aria-hidden", "true");
    expect(slides[1].element).toHaveAttribute("aria-hidden", "false");
    expect(slides[1].element.style.zIndex).toBe("1");
    expect(slides[1].element.animate).toHaveBeenCalledWith(
      [{ opacity: 0 }, { opacity: 1 }], { duration: 1200, easing: "ease-in-out" },
    );
    expect(caption).toHaveTextContent("Test artwork 1");
    await vi.advanceTimersByTimeAsync(1199);
    expect(gallery.dataset.currentSlide).toBe("0");
    await vi.advanceTimersByTimeAsync(1);
    expect(gallery.dataset.currentSlide).toBe("1");
    expect(slides[1].element.style.zIndex).toBe("");
    expect(slides[2].image.loading).toBe("eager");
    expect(slides[2].decode).not.toHaveBeenCalled();
    expect(slides[3].image.loading).toBe("lazy");
    await vi.advanceTimersByTimeAsync(2799);
    expect(transitionStarts).toEqual([4000]);
    await vi.advanceTimersByTimeAsync(1);
    expect(transitionStarts).toEqual([4000, 8000]);
    expect(gallery.dataset.playback).toBe("transitioning");
  });

  it("waits for decoding before painting and anchors the next interval to the actual fade start", async () => {
    const { gallery, slides } = fixture();
    const decode = deferredDecode();
    slides[1].decode.mockReturnValueOnce(decode.promise);
    initialize(gallery);
    observeVisible(gallery);
    await vi.advanceTimersByTimeAsync(9000);
    expect(gallery.dataset.playback).toBe("loading");
    expect(gallery.dataset.currentSlide).toBe("0");
    expect(slides[1].element.hidden).toBe(true);
    expect(slides[0].element.hidden).toBe(false);
    expect(animations).toHaveLength(0);
    expect(slides[1].decode).toHaveBeenCalledTimes(1);
    decode.resolve();
    await vi.advanceTimersByTimeAsync(0);
    expect(transitionStarts).toEqual([9000]);
    await vi.advanceTimersByTimeAsync(3999);
    expect(gallery.dataset.currentSlide).toBe("1");
    expect(transitionStarts).toEqual([9000]);
    await vi.advanceTimersByTimeAsync(1);
    expect(transitionStarts).toEqual([9000, 13000]);
  });

  it("honors reduced motion initially and completes an in-progress dissolve when motion is disabled", async () => {
    const { gallery, slides } = fixture();
    motion.setReduced(true);
    initialize(gallery);
    observeVisible(gallery);
    await vi.advanceTimersByTimeAsync(10000);
    expect(gallery.dataset.playback).toBe("paused");
    expect(slides[1].decode).not.toHaveBeenCalled();
    expect(slides[1].image.loading).toBe("lazy");
    motion.setReduced(false);
    await vi.advanceTimersByTimeAsync(4000);
    expect(gallery.dataset.playback).toBe("transitioning");
    motion.setReduced(true);
    expect(animations[0].cancel).toHaveBeenCalledTimes(1);
    expect(gallery.dataset.currentSlide).toBe("1");
    expect(gallery.dataset.playback).toBe("paused");
    expect(slides.filter(({ element }) => !element.hidden)).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(10000);
    expect(gallery.dataset.currentSlide).toBe("1");
    motion.setReduced(false);
    await vi.advanceTimersByTimeAsync(5200);
    expect(gallery.dataset.currentSlide).toBe("2");
  });

  it.each(["hidden tab", "offscreen or inactive Home"] as const)(
    "pauses for a %s and resumes with a fresh interval",
    async (reason) => {
      const { gallery } = fixture();
      initialize(gallery);
      const observer = observeVisible(gallery);
      const hidden = vi.spyOn(document, "hidden", "get");
      const setPaused = (paused: boolean) => {
        if (reason === "hidden tab") {
          hidden.mockReturnValue(paused);
          document.dispatchEvent(new Event("visibilitychange"));
        } else {
          observer.setVisible(gallery, !paused);
        }
      };
      await vi.advanceTimersByTimeAsync(2500);
      setPaused(true);
      expect(gallery.dataset.playback).toBe("paused");
      await vi.advanceTimersByTimeAsync(10000);
      expect(gallery.dataset.currentSlide).toBe("0");
      setPaused(false);
      expect(gallery.dataset.playback).toBe("playing");
      await vi.advanceTimersByTimeAsync(3999);
      expect(animations).toHaveLength(0);
      await vi.advanceTimersByTimeAsync(1);
      expect(gallery.dataset.playback).toBe("transitioning");
    },
  );

  it("does not paint a completed decode while hidden or resume until all pause conditions clear", async () => {
    const { gallery, slides } = fixture();
    const decode = deferredDecode();
    slides[1].decode.mockReturnValueOnce(decode.promise);
    initialize(gallery);
    const observer = observeVisible(gallery);
    await vi.advanceTimersByTimeAsync(4000);
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    document.dispatchEvent(new Event("visibilitychange"));
    observer.setVisible(gallery, false);
    motion.setReduced(true);
    decode.resolve();
    await vi.advanceTimersByTimeAsync(0);
    expect(slides[1].element.hidden).toBe(true);
    expect(animations).toHaveLength(0);
    hidden.mockReturnValue(false);
    document.dispatchEvent(new Event("visibilitychange"));
    motion.setReduced(false);
    expect(gallery.dataset.playback).toBe("paused");
    observer.setVisible(gallery, true);
    expect(gallery.dataset.playback).toBe("playing");
    await vi.advanceTimersByTimeAsync(5200);
    expect(gallery.dataset.currentSlide).toBe("1");
  });

  it("reports decode errors, skips the failed artwork, and retains the last good frame until recovery", async () => {
    const { gallery, slides, caption, status } = fixture(3);
    const failure = new Error("Image decoding failed");
    const replacement = deferredDecode();
    slides[1].decode.mockRejectedValue(failure);
    slides[2].decode.mockReturnValueOnce(replacement.promise);
    initialize(gallery);
    observeVisible(gallery);
    await vi.advanceTimersByTimeAsync(4001);
    expect(console.error).toHaveBeenCalledWith(
      "An artwork could not be loaded:", slides[1].image.src, failure,
    );
    expect(status.hidden).toBe(false);
    expect(status).toHaveTextContent("Another artwork could not be loaded. Keeping the current image visible.");
    expect(gallery.dataset.currentSlide).toBe("0");
    expect(caption).toHaveTextContent("Test artwork 1");
    expect(slides.filter(({ element }) => !element.hidden)).toEqual([slides[0]]);
    expect(slides[2].decode).toHaveBeenCalledTimes(1);
    replacement.resolve();
    await vi.advanceTimersByTimeAsync(1200);
    expect(gallery.dataset.currentSlide).toBe("2");
    expect(caption).toHaveTextContent("Test artwork 3");
    expect(status.hidden).toBe(true);
    await vi.advanceTimersByTimeAsync(8000);
    expect(gallery.dataset.currentSlide).toBe("2");
    expect(slides[1].decode).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it("stops retrying when every other image has failed", async () => {
    const { gallery, slides, status } = fixture(2);
    slides[1].decode.mockRejectedValue(new Error("Missing artwork"));
    initialize(gallery);
    observeVisible(gallery);
    await vi.advanceTimersByTimeAsync(20000);
    expect(gallery.dataset.playback).toBe("paused");
    expect(gallery.dataset.currentSlide).toBe("0");
    expect(slides[0].element.hidden).toBe(false);
    expect(slides[1].element.hidden).toBe(true);
    expect(slides[1].decode).toHaveBeenCalledTimes(1);
    expect(status.hidden).toBe(false);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("reports an unavailable first image once, including an already-completed failed request", () => {
    const { gallery, slides, status } = fixture(1);
    Object.defineProperty(slides[0].image, "naturalWidth", { configurable: true, value: 0 });
    initialize(gallery);
    expect(status.hidden).toBe(false);
    expect(status).toHaveTextContent("This artwork could not be loaded.");
    expect(console.error).toHaveBeenCalledWith(
      "An artwork could not be loaded:", slides[0].image.src,
      expect.objectContaining({ message: "The first artwork is unavailable." }),
    );
    slides[0].image.dispatchEvent(new Event("error"));
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it.each([
    { duration: 0, animationsAvailable: true },
    { duration: 1200, animationsAvailable: false },
  ])("uses decoded still changes for $duration ms / WAAPI $animationsAvailable", async ({ duration, animationsAvailable }) => {
    const { gallery } = fixture(2, duration);
    if (!animationsAvailable) Reflect.deleteProperty(HTMLElement.prototype, "animate");
    initialize(gallery);
    observeVisible(gallery);
    await vi.advanceTimersByTimeAsync(4000);
    expect(gallery.dataset.currentSlide).toBe("1");
    expect(gallery.dataset.playback).toBe("playing");
    expect(animations).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(4000);
    expect(gallery.dataset.currentSlide).toBe("0");
  });

  it("keeps the first image still with a diagnostic when visibility observation is unavailable", async () => {
    const { gallery } = fixture();
    vi.stubGlobal("IntersectionObserver", undefined);
    initialize(gallery);
    await vi.advanceTimersByTimeAsync(10000);
    expect(gallery.dataset.playback).toBe("paused");
    expect(gallery.dataset.currentSlide).toBe("0");
    expect(console.warn).toHaveBeenCalledWith(
      "Artwork autoplay is unavailable without visibility observation. Keeping the first artwork still.",
    );
    expect(vi.getTimerCount()).toBe(0);
  });

  it("removes timers and listeners, disconnects observation, and supports StrictMode-style reinitialization", async () => {
    const { gallery, slides, status } = fixture();
    const controller = initialize(gallery);
    const observer = observeVisible(gallery);
    const removeDocumentListener = vi.spyOn(document, "removeEventListener");
    const removeMotionListener = vi.spyOn(motion, "removeEventListener");
    const removeImageListener = vi.spyOn(slides[0].image, "removeEventListener");
    controller.destroy();
    controller.destroy();
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
    expect(removeDocumentListener).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
    expect(removeMotionListener).toHaveBeenCalledWith("change", expect.any(Function));
    expect(removeImageListener).toHaveBeenCalledWith("error", expect.any(Function));
    expect(vi.getTimerCount()).toBe(0);
    observer.setVisible(gallery, false);
    slides[0].image.dispatchEvent(new Event("error"));
    await vi.advanceTimersByTimeAsync(10000);
    expect(gallery.dataset.currentSlide).toBe("0");
    expect(status.hidden).toBe(true);
    expect(console.error).not.toHaveBeenCalled();
    initialize(gallery);
    observeVisible(gallery);
    expect(vi.getTimerCount()).toBe(1);
    await vi.advanceTimersByTimeAsync(5200);
    expect(gallery.dataset.currentSlide).toBe("1");
    expect(animations).toHaveLength(1);
  });

  it("cancels an active fade and ignores queued animation events after reinitialization", async () => {
    const { gallery, slides, caption } = fixture();
    const controller = initialize(gallery);
    observeVisible(gallery);
    await vi.advanceTimersByTimeAsync(4000);
    const animation = animations[0];
    const queuedFinish = animation.onfinish;
    const queuedCancel = animation.oncancel;
    controller.destroy();
    expect(animation.cancel).toHaveBeenCalledTimes(1);
    expect(animation.onfinish).toBeNull();
    expect(animation.oncancel).toBeNull();
    expect(slides.filter(({ element }) => !element.hidden)).toEqual([slides[0]]);
    expect(slides.every(({ element }) => element.style.zIndex === "")).toBe(true);
    initialize(gallery);
    observeVisible(gallery);
    queuedFinish?.();
    queuedCancel?.();
    expect(gallery.dataset.currentSlide).toBe("0");
    expect(caption).toHaveTextContent("Test artwork 1");
    expect(gallery.dataset.playback).toBe("playing");
    expect(vi.getTimerCount()).toBe(1);
    await vi.advanceTimersByTimeAsync(5200);
    expect(gallery.dataset.currentSlide).toBe("1");
  });

  it.each(["resolve", "reject"] as const)("ignores a pending decode that %ss after disposal", async (outcome) => {
    const { gallery, slides, status } = fixture(2);
    const decode = deferredDecode();
    slides[1].decode.mockReturnValueOnce(decode.promise);
    const controller = initialize(gallery);
    observeVisible(gallery);
    await vi.advanceTimersByTimeAsync(4000);
    expect(gallery.dataset.playback).toBe("loading");
    controller.destroy();
    initialize(gallery);
    observeVisible(gallery);
    if (outcome === "resolve") decode.resolve();
    else decode.reject(new Error("Late decode failure"));
    await vi.advanceTimersByTimeAsync(0);
    expect(gallery.dataset.currentSlide).toBe("0");
    expect(gallery.dataset.playback).toBe("playing");
    expect(status.hidden).toBe(true);
    expect(animations).toHaveLength(0);
    expect(console.error).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(5200);
    expect(gallery.dataset.currentSlide).toBe("1");
    expect(slides[1].decode).toHaveBeenCalledTimes(2);
  });

  it.each([
    ["0", "1200"], ["4000", "4000"], ["4000", "-1"], ["Infinity", "1200"], ["4000", "NaN"],
  ])("rejects invalid timing: interval %s, fade %s", (interval, duration) => {
    const { gallery } = fixture();
    gallery.dataset.interval = interval;
    gallery.dataset.fadeDuration = duration;
    expect(() => initialize(gallery)).toThrow(RangeError);
    expect(observers).toHaveLength(0);
  });

  it("rejects missing slides, images, captions, or status markup", () => {
    expect(() => initialize(fixture(0).gallery)).toThrow(TypeError);
    const missingImage = fixture();
    missingImage.slides[0].image.remove();
    expect(() => initialize(missingImage.gallery)).toThrow(TypeError);
    const missingCaption = fixture();
    delete missingCaption.slides[0].element.dataset.caption;
    expect(() => initialize(missingCaption.gallery)).toThrow(TypeError);
    const missingStatus = fixture();
    missingStatus.status.remove();
    expect(() => initialize(missingStatus.gallery)).toThrow(TypeError);
  });
});
