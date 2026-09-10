import { useEffect, type RefObject } from "react";

const reelMedia = "(prefers-reduced-motion: no-preference) and (min-width: 901px)";

export function useEngagementReel(trackRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const track = trackRef.current;
    if (!track || globalThis.CSS?.supports?.("animation-timeline: view()")) return;

    const media = window.matchMedia(reelMedia);
    let stop: (() => void) | undefined;

    const sync = () => {
      stop?.();
      stop = undefined;
      if (!media.matches) return;

      let frame: number | null = null;
      const update = () => {
        frame = null;
        const { top, height } = track.getBoundingClientRect();
        const distance = height - window.innerHeight;
        const progress = distance > 0 ? Math.min(1, Math.max(0, -top / distance)) : 0;

        // Seek the existing CSS keyframes; native scrolling and snapping keep control.
        for (const animation of track.getAnimations({ subtree: true })) {
          if (!(animation instanceof CSSAnimation) || !animation.animationName.startsWith("engagement-")) {
            continue;
          }
          const duration = animation.effect?.getComputedTiming().duration;
          if (typeof duration === "number") {
            animation.currentTime = progress * duration;
          }
        }
      };
      const scheduleUpdate = () => {
        if (frame === null) frame = window.requestAnimationFrame(update);
      };
      const observer = new ResizeObserver(scheduleUpdate);
      observer.observe(track);
      observer.observe(document.documentElement);
      window.addEventListener("scroll", scheduleUpdate, { passive: true });
      window.addEventListener("resize", scheduleUpdate);
      window.addEventListener("pageshow", scheduleUpdate);
      update();

      stop = () => {
        observer.disconnect();
        window.removeEventListener("scroll", scheduleUpdate);
        window.removeEventListener("resize", scheduleUpdate);
        window.removeEventListener("pageshow", scheduleUpdate);
        if (frame !== null) window.cancelAnimationFrame(frame);
      };
    };

    media.addEventListener("change", sync);
    sync();
    return () => {
      media.removeEventListener("change", sync);
      stop?.();
    };
  }, [trackRef]);
}
