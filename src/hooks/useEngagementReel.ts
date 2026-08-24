import { useEffect, useRef, useState } from "react";

/* Which engagement the reel is showing.
 *
 * The travel is a CSS transition, not a scroll-driven animation, and this is
 * what decides when it runs. The distinction matters: a scroll-driven animation
 * can only interpolate along the scroll, so it gives one of two things — a card
 * that tracks the pointer and reads as a strip being dragged, or, with stepped
 * keyframes, a swap with no motion in it at all. Both were tried. Neither is a
 * transition, because a transition needs its own clock, and the scroll is not
 * one.
 *
 * So the scroll decides the state and CSS decides the motion.
 */

/* Where the reel changes, as a fraction of the track's travel.
 *
 * Not thirds. The track's snap points sit one frame apart, at 0.5 and 1.0, and
 * a threshold on a snap point would flip the card exactly where the scroller is
 * trying to settle — the reel would change under a reader who has come to rest.
 * These sit midway between them instead, so each snap lands well inside the
 * engagement it belongs to and the change happens while the page is moving. */
const THRESHOLDS = [0.25, 0.75];

/* The reel is desktop-only; below this the section is a plain stacked list and
 * there is nothing to index. Matches the breakpoint in Home.css. */
const MIN_WIDTH = 769;

export function useEngagementReel<T extends HTMLElement>() {
  const trackRef = useRef<T>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const wide = window.matchMedia(`(min-width: ${MIN_WIDTH}px)`);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    const measure = () => {
      frame = 0;
      if (!wide.matches || still.matches) {
        setActive(0);
        return;
      }

      /* The same range the sticky frame is held over: the track less one
         viewport. Above and below it the section is not on screen as a reel at
         all, so the index is clamped rather than extrapolated. */
      const box = track.getBoundingClientRect();
      const travel = box.height - window.innerHeight;
      if (travel <= 0) {
        setActive(0);
        return;
      }

      const progress = Math.min(1, Math.max(0, -box.top / travel));
      let next = 0;
      for (const t of THRESHOLDS) if (progress >= t) next += 1;
      setActive(next);
    };

    /* Coalesced to one measurement per frame. A scroll listener fires far more
       often than the screen refreshes, and this reads layout. */
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    wide.addEventListener("change", measure);
    still.addEventListener("change", measure);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      wide.removeEventListener("change", measure);
      still.removeEventListener("change", measure);
    };
  }, []);

  return { trackRef, active };
}
