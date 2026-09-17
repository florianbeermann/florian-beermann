/** Initialize a mounted gallery; destroy its controller before reinitializing or unmounting it. */
export function initArtworkSlideshow(gallery: HTMLElement): { destroy(): void } {
  const invalidMarkup = "The artwork slideshow needs images, captions and an error-status element.";
  const slides = Array.from(gallery.querySelectorAll(".artwork-slide"), (element) => {
    const image = element.querySelector("img");
    if (!(element instanceof HTMLElement) || !image || !element.dataset.caption) {
      throw new TypeError(invalidMarkup);
    }
    return { element, image, caption: element.dataset.caption };
  });
  const caption = gallery.querySelector("[data-artwork-caption]");
  const status = gallery.querySelector("[data-artwork-status]");
  const interval = Number(gallery.dataset.interval ?? 4000);
  const duration = Number(gallery.dataset.fadeDuration ?? 1200);
  if (!slides.length || !(caption instanceof HTMLElement) || !(status instanceof HTMLElement)) {
    throw new TypeError(invalidMarkup);
  }
  if (!Number.isFinite(interval) || interval <= 0 || !Number.isFinite(duration) ||
      duration < 0 || duration >= interval) {
    throw new RangeError("Artwork slideshow timings must be finite, with a positive interval longer than the fade.");
  }

  let current = 0;
  let timer: number | undefined;
  let animation: Animation | undefined;
  let nextTransitionAt = 0;
  let changing = false;
  let destroyed = false;
  let visible = false;
  const failed = new Set<number>();
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const showCurrent = () => {
    slides.forEach(({ element }, index) => {
      element.classList.toggle("is-active", index === current);
      element.hidden = index !== current;
      element.style.removeProperty("z-index");
      element.setAttribute("aria-hidden", String(index !== current));
    });
  };
  showCurrent();
  slides.forEach(({ element }, index) => {
    element.setAttribute("role", "group");
    element.setAttribute("aria-roledescription", "slide");
    element.setAttribute("aria-label", `Artwork ${index + 1} of ${slides.length}`);
  });
  caption.textContent = slides[0].caption;
  status.hidden = true;
  gallery.dataset.currentSlide = "0";
  gallery.dataset.slideCount = String(slides.length);

  const reportFailure = (index: number, error: unknown) => {
    if (destroyed || failed.has(index)) return;
    failed.add(index);
    console.error("An artwork could not be loaded:", slides[index].image.src, error);
    status.textContent = index === current
      ? "This artwork could not be loaded."
      : "Another artwork could not be loaded. Keeping the current image visible.";
    status.hidden = false;
  };
  const firstImage = slides[0].image;
  const firstImageFailed = () => reportFailure(0, new Error("The first artwork is unavailable."));
  firstImage.addEventListener("error", firstImageFailed);
  if (firstImage.complete && !firstImage.naturalWidth) firstImageFailed();

  const nextIndex = () => {
    for (let step = 1; step < slides.length; step++) {
      const index = (current + step) % slides.length;
      if (!failed.has(index)) return index;
    }
    return -1;
  };
  const mayPlay = () =>
    !destroyed && visible && !document.hidden && !motion.matches && nextIndex() !== -1;

  const schedule = () => {
    if (destroyed) return;
    window.clearTimeout(timer);
    timer = undefined;
    if (!mayPlay()) {
      nextTransitionAt = 0;
      gallery.dataset.playback = slides.length === 1 ? "single" : "paused";
      return;
    }
    if (changing) return;
    gallery.dataset.playback = "playing";
    // Preload one image ahead; the fade is part of the start-to-start cadence.
    slides[nextIndex()].image.loading = "eager";
    if (!nextTransitionAt) nextTransitionAt = performance.now() + interval;
    timer = window.setTimeout(() => { void advance(); }, Math.max(0, nextTransitionAt - performance.now()));
  };

  const syncPlayback = () => {
    if (destroyed) return;
    if (!mayPlay()) animation?.cancel();
    schedule();
  };

  const advance = async (): Promise<void> => {
    timer = undefined;
    if (!mayPlay() || changing) return;
    const next = nextIndex();
    if (next === -1) return;
    const incoming = slides[next];
    const outgoing = slides[current];
    changing = true;
    gallery.dataset.playback = "loading";
    incoming.image.loading = "eager";

    // Never replace a valid frame with an image that has not decoded.
    try {
      await incoming.image.decode();
    } catch (error) {
      if (destroyed) return;
      changing = false;
      reportFailure(next, error);
      schedule();
      return;
    }
    if (destroyed) return;
    if (!mayPlay()) {
      changing = false;
      schedule();
      return;
    }

    incoming.element.hidden = false;
    incoming.element.classList.add("is-active");
    incoming.element.style.zIndex = "1";
    incoming.element.setAttribute("aria-hidden", "false");
    outgoing.element.setAttribute("aria-hidden", "true");
    nextTransitionAt = performance.now() + interval;
    gallery.dataset.playback = "transitioning";
    let finished = false;
    const finish = () => {
      if (finished || destroyed) return;
      finished = true;
      outgoing.element.classList.remove("is-active");
      outgoing.element.hidden = true;
      incoming.element.style.removeProperty("z-index");
      current = next;
      animation = undefined;
      changing = false;
      caption.textContent = incoming.caption;
      gallery.dataset.currentSlide = String(current);
      status.hidden = true;
      schedule();
    };

    // Keep the outgoing image fully painted beneath the dissolve.
    if (duration && typeof incoming.element.animate === "function") {
      animation = incoming.element.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration, easing: "ease-in-out" },
      );
      animation.onfinish = finish;
      animation.oncancel = finish;
    } else {
      finish();
    }
  };

  let observer: IntersectionObserver | undefined;
  if (slides.length > 1 && typeof IntersectionObserver === "function") {
    observer = new IntersectionObserver(([entry]) => {
      if (!entry || destroyed) return;
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0 });
    observer.observe(gallery);
    document.addEventListener("visibilitychange", syncPlayback);
    motion.addEventListener("change", syncPlayback);
  } else if (slides.length > 1) {
    console.warn("Artwork autoplay is unavailable without visibility observation. Keeping the first artwork still.");
  }
  schedule();

  return {
    destroy() {
      if (destroyed) return;
      destroyed = true;
      window.clearTimeout(timer);
      timer = undefined;
      if (animation) {
        // A queued animation event must not mutate a subsequent React effect's gallery.
        animation.onfinish = null;
        animation.oncancel = null;
        animation.cancel();
        animation = undefined;
      }
      observer?.disconnect();
      firstImage.removeEventListener("error", firstImageFailed);
      document.removeEventListener("visibilitychange", syncPlayback);
      motion.removeEventListener("change", syncPlayback);
      showCurrent();
    },
  };
}
