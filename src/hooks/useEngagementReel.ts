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

/* How long the scroll has to be still before the settle runs. This is dead time
 * by definition — the reader has stopped and nothing is happening yet — so it
 * is as short as it can be without firing between two notches of a mouse wheel.
 * A wheel or touch cancels an in-flight settle, so erring short costs a
 * cancelled settle rather than a fight for the scroll position. */
const IDLE_MS = 80;

/* The settle's travel, scaled by how far it has to go: a card two thirds of the
 * way home should not take as long as one that has barely moved. A fixed
 * duration makes short settles crawl, which is most of them. */
const SETTLE_MIN_MS = 200;
const SETTLE_MAX_MS = 440;

/* Below this the settle is not worth running: the scroll is already close
 * enough to a card that moving it would be a twitch rather than a settle. */
const SETTLE_MIN_PX = 3;

/* How far the scroll can drift from where the settle put it before the settle
 * concludes someone else is driving and gets out of the way. Wide enough to
 * absorb sub-pixel rounding, narrow enough to yield within a frame or two. */
const YIELD_PX = 3;

/* Roughly how long the browser takes to run a smooth scroll of the length an
 * anchor link on this page implies. The settle stays out of the way for this
 * long after one starts, because it cannot detect one in flight. */
const SMOOTH_SCROLL_MS = 800;

/* How much of the reel's travel is shaped rather than linear.
 *
 * At 0 the card tracks the scroll exactly and there is no weight to it. At 1 it
 * is pure smootherstep, which is flat at both ends — and flat at the ends means
 * a card that will not move when you first push it, which reads as the page
 * being stuck rather than as the card being heavy. In between, the card answers
 * the scroll immediately and still gathers speed across the middle. */
const BOUNCE = 0.7;

/* Smootherstep. Flat at both ends, steepest in the middle, and 0.5 at 0.5 — so
 * the midpoint stays the midpoint and the reel's motion and the settle's
 * threshold agree about where the middle is. */
const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/* Travel between two cards: mostly shaped, partly linear. Still 0.5 at 0.5. */
const ease = (t: number) => t + BOUNCE * (smootherstep(t) - t);

/* The settle's curve, and it is deliberately not the one above.
 *
 * A settle follows a reader who has already stopped, so any flatness at the
 * start is read as hesitation — the wait before the wait. This leaves at full
 * speed and decelerates into the card, which is the shape of something coming
 * to rest rather than something starting to move. */
const settleEase = (t: number) => 1 - Math.pow(1 - t, 3);

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

    const settleTo = (target: number, reach: number) => {
      const startY = window.scrollY;
      const delta = target - startY;
      if (Math.abs(delta) < SETTLE_MIN_PX) return;

      /* The furthest a settle can ever travel is half a card, so measure this
         one against that and give it a proportional share of the time. */
      const share = reach > 0 ? Math.min(1, Math.abs(delta) / reach) : 1;
      const duration = SETTLE_MIN_MS + (SETTLE_MAX_MS - SETTLE_MIN_MS) * share;

      const startedAt = performance.now();
      settling = true;
      /* What we last put the scroll at. If it has moved since, something else
         is driving — see below. */
      let wrote = -1;

      const step = (now: number) => {
        /* Yield rather than fight. A settle writes the scroll position on every
           frame, so without this it beats anything else trying to move the page
           for as long as it runs: the masthead's anchor links, Page Down and
           the arrow keys, find-in-page, a scrollbar drag. Only wheel and touch
           announce themselves as events; this catches the rest, by noticing
           that the scroll is no longer where we put it. */
        if (wrote >= 0 && Math.abs(window.scrollY - wrote) > YIELD_PX) {
          stopSettle();
          return;
        }

        const t = Math.min(1, (now - startedAt) / duration);
        /* Explicitly instant. The document sets `scroll-behavior: smooth`, and
           the two-argument form of scrollTo obeys it — which would hand every
           frame of this animation to the browser's own smooth scroller, each
           one starting a fresh ~300ms scroll toward a target that has already
           moved. Two easings fighting reads as lag before anything happens and
           a settle that never quite lands. */
        window.scrollTo({ top: startY + delta * settleEase(t), behavior: "instant" });
        // Read back rather than trusting the write: the browser clamps at the
        // document's ends and rounds to device pixels.
        wrote = window.scrollY;

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
    /* Set when something has asked the page to scroll somewhere specific and
       the settle must keep out of the way until it has finished. */
    let suppressUntil = 0;

    const considerSettle = () => {
      idle = 0;
      if (!enabled() || settling) return;
      if (performance.now() < suppressUntil) return;

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
      // Half a segment — the furthest this can ever have to travel.
      settleTo(target, travel / last / 2);
    };

    const rearm = () => {
      window.clearTimeout(idle);
      idle = window.setTimeout(considerSettle, IDLE_MS);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
      if (settling) return;
      rearm();
    };

    /* A wheel or a touch means the reader has taken hold again, so an in-flight
       settle has to let go rather than fight for the scroll position. */
    const onIntent = () => {
      stopSettle();
      rearm();
    };

    /* Someone has asked to be taken somewhere — the masthead's anchor links, or
       a key that scrolls. Both need the settle out of the way, and an anchor
       link needs it to stay out of the way, because it scrolls smoothly and the
       settle's own writes would abort it frame by frame. The drift check inside
       the settle cannot catch that: aborting the smooth scroll is what stops it
       ever drifting far enough to notice. */
    const yieldFor = (ms: number) => {
      suppressUntil = performance.now() + ms;
      stopSettle();
      window.clearTimeout(idle);
      idle = window.setTimeout(considerSettle, ms + IDLE_MS);
    };

    const onAnchorClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest?.('a[href^="#"], a[href*="/#"]')) yieldFor(SMOOTH_SCROLL_MS);
    };

    const SCROLL_KEYS = new Set([
      "PageUp",
      "PageDown",
      "Home",
      "End",
      "ArrowUp",
      "ArrowDown",
      " ",
    ]);
    const onKeyIntent = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) yieldFor(IDLE_MS);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("wheel", onIntent, { passive: true });
    window.addEventListener("touchstart", onIntent, { passive: true });
    document.addEventListener("click", onAnchorClick, true);
    window.addEventListener("keydown", onKeyIntent, { passive: true });
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
      document.removeEventListener("click", onAnchorClick, true);
      window.removeEventListener("keydown", onKeyIntent);
      wide.removeEventListener("change", measure);
      still.removeEventListener("change", measure);
      track.style.removeProperty("--reel-pos");
    };
  }, [count]);

  return { trackRef, active };
}
