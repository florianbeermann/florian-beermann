import { useEffect, useRef, useState } from "react";

/* The engagements reel: follows the scroll, settles when it stops.
 *
 * Two parts, and the split is the whole design.
 *
 * The reel's position is a pure function of the scroll — it never leads and
 * never lags, so moving the wheel moves the card by exactly as much. What it is
 * not is linear: the travel is eased, so a card sits still near its resting
 * place and crosses quickly through the middle. That is what gives a small
 * scroll the feeling of resistance and a committed one the feeling of a card
 * being thrown.
 *
 * The settle is separate, and it acts on the scroll rather than on the reel.
 * When scrolling stops inside the track, the page is eased to whichever card is
 * nearer — which is the fifty percent rule, since "nearer" is what crossing the
 * midpoint changes. Because the reel is a function of the scroll, moving the
 * scroll moves the reel: there is one source of truth and nothing to keep in
 * step.
 *
 * The obvious alternative — commit the reel to the next card once the scroll
 * passes halfway — was built first and is wrong. It puts the reel ahead of the
 * scroll, and that lead has to be paid back before the reel can move again:
 * measured, it left 84% of the track scrolling with nothing on screen changing.
 *
 * CSS scroll-snap can do the settling part and was tried. Its catch radius is
 * not the midpoint and cannot be told to be — measured at 266px against an
 * 816px segment, so it committed at about two thirds rather than a half — and
 * it is declared on the scroll container, which here is the whole document.
 */

/* The reel is desktop-only; below this the section is a plain stacked list and
 * there is nothing to move. Matches the breakpoint in Home.css. */
const MIN_WIDTH = 769;

/* How long the scroll has to be still before the settle runs. Long enough not
 * to fire between two flicks of a trackpad, short enough not to feel like a
 * delay. */
const IDLE_MS = 110;

/* The settle's own travel. Slower than a transition because it is moving the
 * page rather than an element, and a page that moves fast under a reader who
 * has just stopped reads as the page taking over. */
const SETTLE_MS = 420;

/* Below this the settle is not worth running: the scroll is already close
 * enough to a card that moving it would be a twitch rather than a settle. */
const SETTLE_MIN_PX = 3;

/* Eased travel between two cards. Smootherstep: flat at both ends, steepest in
 * the middle, and 0.5 at 0.5 — so the midpoint is still the midpoint and the
 * settle's threshold and the reel's motion agree about where the middle is. */
const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

export function useEngagementReel<T extends HTMLElement>(count: number) {
  const trackRef = useRef<T>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const wide = window.matchMedia(`(min-width: ${MIN_WIDTH}px)`);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const last = count - 1;

    let published = -1;
    const write = (pos: number) => {
      const rounded = Math.round(pos * 1000) / 1000;
      if (rounded === published) return;
      published = rounded;
      /* On the track rather than the reel: the position rail beneath is a
         sibling of the reel, not a descendant, and both have to read the same
         number. */
      track.style.setProperty("--reel-pos", String(rounded));
    };

    /* The track's own geometry, in document coordinates. Read fresh each time
       because the page above this can change height — the hero's plate settles,
       fonts swap — and a cached top would settle to the wrong place. */
    const geometry = () => {
      const box = track.getBoundingClientRect();
      const travel = box.height - window.innerHeight;
      return { top: box.top + window.scrollY, travel };
    };

    const enabled = () => wide.matches && !still.matches;

    let frame = 0;
    const measure = () => {
      frame = 0;
      if (!enabled()) {
        write(0);
        setActive(0);
        return;
      }
      const { travel } = geometry();
      if (travel <= 0) return;

      const box = track.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -box.top / travel));
      const scrolled = progress * last;
      // Which pair of cards we are between, and how far across.
      const from = Math.min(last - 1, Math.floor(scrolled));
      const local = Math.min(1, Math.max(0, scrolled - from));

      write(from + ease(local));
      setActive(Math.round(scrolled));
    };

    /* ── The settle ──────────────────────────────────────────────────────── */

    let settleFrame = 0;
    let settling = false;

    const stopSettle = () => {
      if (settleFrame) cancelAnimationFrame(settleFrame);
      settleFrame = 0;
      settling = false;
    };

    const settleTo = (target: number) => {
      const startY = window.scrollY;
      const delta = target - startY;
      if (Math.abs(delta) < SETTLE_MIN_PX) return;
      const startedAt = performance.now();
      settling = true;

      const step = (now: number) => {
        const t = Math.min(1, (now - startedAt) / SETTLE_MS);
        window.scrollTo(0, startY + delta * ease(t));
        if (t < 1) {
          settleFrame = requestAnimationFrame(step);
        } else {
          settleFrame = 0;
          settling = false;
        }
      };
      settleFrame = requestAnimationFrame(step);
    };

    let idle = 0;
    const considerSettle = () => {
      idle = 0;
      if (!enabled() || settling) return;

      const { top, travel } = geometry();
      if (travel <= 0) return;

      const y = window.scrollY;
      // Only inside the track, and not at either end of it: the entry is
      // deliberately free — being pulled in from the section above is what the
      // earlier snap-point version did wrong — and the exit belongs to the page.
      if (y <= top || y >= top + travel) return;

      const scrolled = ((y - top) / travel) * last;
      // Round is the fifty percent rule: past the midpoint the nearer card is
      // the next one.
      const target = top + (Math.round(scrolled) / last) * travel;
      settleTo(target);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
      if (settling) return;
      window.clearTimeout(idle);
      idle = window.setTimeout(considerSettle, IDLE_MS);
    };

    /* A wheel or a touch means the reader has taken hold again, so an in-flight
       settle has to let go rather than fight for the scroll position. */
    const onIntent = () => {
      stopSettle();
      window.clearTimeout(idle);
      idle = window.setTimeout(considerSettle, IDLE_MS);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("wheel", onIntent, { passive: true });
    window.addEventListener("touchstart", onIntent, { passive: true });
    wide.addEventListener("change", measure);
    still.addEventListener("change", measure);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      stopSettle();
      window.clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", onIntent);
      window.removeEventListener("touchstart", onIntent);
      wide.removeEventListener("change", measure);
      still.removeEventListener("change", measure);
      track.style.removeProperty("--reel-pos");
    };
  }, [count]);

  return { trackRef, active };
}
