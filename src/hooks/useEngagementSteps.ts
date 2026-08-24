import { useEffect, useRef } from "react";

/* One engagement per gesture, and none of them skippable.
 *
 * CSS snapping gets close and cannot finish the job. `proximity` settles a
 * gesture on whichever position is nearest when it ends, which is not the same
 * as stopping at each one on the way, and `scroll-snap-stop: always` — which is
 * the property for exactly that — only applies where the browser was going to
 * snap anyway. `mandatory` would do it, but `scroll-snap-type` is declared on
 * the scroll container, which here is the document: with snap positions only
 * inside this track, mandatory means the scroll can never rest anywhere else
 * and both ends of the page become unreachable. That is not a theory, it is
 * what happened the first time it was tried.
 *
 * So the wheel is taken, and only between the first engagement and the last.
 * Outside that range this does nothing at all and the page scrolls normally.
 *
 * The important part is what it does *not* do. It never writes the scroll
 * position itself; it asks the browser to scroll to a snap position and lets
 * the browser animate it. An earlier version of this section drove the scroll
 * frame by frame and that is what made it feel wrong: it fought the page's own
 * smooth scrolling, and it beat anything else trying to move the page, a click
 * on the masthead included. Here there is one scroll operation per step and
 * nothing to fight.
 */

/* The reel is desktop-only; below this the engagements are a stacked list and
 * there is nothing to step through. Matches the breakpoint in Home.css. */
const MIN_WIDTH = 769;

/* How much wheel is a gesture. Low, because it only has to distinguish a
 * deliberate push from a stray one — the step is a fixed distance either way. */
const TRIGGER_PX = 26;

/* One gesture is one engagement, so the rest of a flick has to be swallowed —
 * and a trackpad's flick is long, a second or so of events after the fingers
 * have lifted.
 *
 * The rest is swallowed by time, not by distance, and the distinction is the
 * whole of it. A distance allowance cannot tell a flick still arriving from a
 * hand pushing again, because a hard enough flick delivers any amount you care
 * to name: measured, a flick that reached the first engagement still had 1875px
 * in the air, which walked straight through a 900px allowance and opened the
 * second. Time can tell them apart. A flick is one burst and then a gap; a
 * second push is a second burst.
 *
 * Held, not blocked. A reader dragging continuously without ever pausing has to
 * be able to keep moving or the section is a trap, so after this long the wheel
 * counts again — and by then a tail has decayed to nothing, which is why the
 * threshold it then has to clear is the larger one below. */
const CONTINUE_MS = 1200;
const CONTINUE_PX = 200;

/* A gap this long means the hand stopped, so the next push is a new gesture. */
const QUIET_MS = 130;

/* How far ahead of the first engagement the wheel is taken over.
 *
 * The approach has to be caught before the reel is reached, not after. Chrome
 * animates wheel scrolling, so `window.scrollY` lags a long way behind the
 * deltas already delivered: a hard flick hands over its whole distance in about
 * eighty milliseconds while the page has barely started moving, and a handler
 * that asks where the page *is* concludes the section has not been reached
 * until the flick is over and the section has been passed. Measured, a 1600px
 * flick did exactly that and opened the reel on its second engagement.
 *
 * So the deltas are added up as they arrive and the total is what decides. This
 * is the distance before the first engagement at which that total takes the
 * wheel and clamps it. */
const APPROACH_PX = 460;

/* Released if `scrollend` never arrives. Chrome has had it since 114, but a
 * lock with no way out is the one bug this must not have. */
const UNLOCK_FALLBACK_MS = 1000;

export function useEngagementSteps<T extends HTMLElement>(count: number) {
  const trackRef = useRef<T>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const wide = window.matchMedia(`(min-width: ${MIN_WIDTH}px)`);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const last = count - 1;
    const enabled = () => wide.matches && !still.matches && last > 0;

    /* The resting places, read from the markers rather than recomputed.
       They already carry the offsets in CSS — the step and the masthead the
       stage pins under — so reading them keeps one source of truth, and it
       stays right if the track is resized. */
    const positions = () =>
      [...track.querySelectorAll<HTMLElement>(".home-engagement-steps > span")].map(
        (mark) =>
          Math.round(
            mark.getBoundingClientRect().top +
              window.scrollY -
              parseFloat(getComputedStyle(mark).scrollMarginTop || "0"),
          ),
      );

    const nearest = (pos: number[], y: number) => {
      let best = 0;
      for (let i = 1; i < pos.length; i++) {
        if (Math.abs(pos[i] - y) < Math.abs(pos[best] - y)) best = i;
      }
      return best;
    };

    let locked = false;
    let unlockTimer = 0;
    let accumulated = 0;
    let lastWheelAt = 0;
    /* Set once this gesture has been given its engagement, and when. */
    let spent = false;
    let spentAt = 0;
    /* Where the wheel has asked to be, which is not where the page is. See
       APPROACH_PX. Resynced whenever the hand stops. */
    let projected = 0;

    const lock = () => {
      locked = true;
      accumulated = 0;
      spent = true;
      spentAt = performance.now();
      window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => {
        locked = false;
      }, UNLOCK_FALLBACK_MS);
    };

    const onScrollEnd = () => {
      window.clearTimeout(unlockTimer);
      locked = false;
    };

    const goTo = (y: number) => {
      /* A scroll of no distance produces no `scrollend`, and locking on one
         would hold the reel shut until the fallback timer let it go. That is
         the missed step in the first version of this: arriving already seated
         on the first engagement locked, and the next push was swallowed. */
      if (Math.abs(window.scrollY - y) < 2) {
        accumulated = 0;
        return;
      }
      lock();
      window.scrollTo({ top: y, behavior: "smooth" });
    };

    const onWheel = (event: WheelEvent) => {
      if (!enabled() || event.ctrlKey) return;

      const pos = positions();
      if (pos.length !== count) return;
      const first = pos[0];
      const final = pos[last];
      const y = window.scrollY;
      const down = event.deltaY > 0;

      const now = event.timeStamp || performance.now();
      const fresh = now - lastWheelAt > QUIET_MS;
      lastWheelAt = now;
      if (fresh) {
        accumulated = 0;
        spent = false;
        spentAt = 0;
        // The hand stopped, so where the page is and where it was asked to be
        // are the same thing again.
        projected = y;
      }
      projected += event.deltaY;

      // At either end and pushing outwards: hand the page back. Nothing here
      // may be able to trap the scroll.
      if (!down && y <= first + 2) return;
      if (down && y >= final - 2) return;

      /* Between the first engagement and the last, the wheel is ours whatever
         the running total says. Only the approach is judged on the total, and
         only because the page has not caught up with it yet.

         Reading the total here instead was a leak. It goes on accumulating
         while a gesture is being swallowed, so a hard flick pushed it past the
         far side of the reel and the handler concluded the reader had left and
         handed the wheel back — mid-gesture, with most of the flick still in
         the air. Measured: a 5000px flick seated on the first engagement and
         then scrolled the page out of the section from underneath it. */
      const withinReel = y > first - 2 && y < final + 2;
      if (
        !withinReel &&
        (projected < first - APPROACH_PX || projected > final + APPROACH_PX)
      ) {
        return;
      }

      event.preventDefault();

      // And it cannot run away while it is not being used, or leaving the reel
      // later starts from a total the reader never asked for.
      if (withinReel) projected = Math.min(Math.max(projected, first), final);

      /* The approach, and the reason the first engagement can no longer be
         scrolled over. Between here and the reel the wheel moves the page
         directly, one pixel per pixel, with the first engagement as a hard
         ceiling. There is no animation to overshoot and no momentum to carry
         through: the gesture simply stops there, however hard it was. */
      if (y < first - 2 && down) {
        const clamped = Math.min(projected, first);
        /* Reaching the first engagement is this gesture's one move. Without
           this the rest of a flick carries straight on into the second: the
           approach stops at 1432 and the twenty events still in the air are
           read as a fresh push. */
        if (projected >= first) {
          projected = first;
          accumulated = 0;
          spent = true;
          spentAt = performance.now();
        }
        window.scrollTo({ top: clamped, behavior: "instant" });
        return;
      }

      // The same on the way up, for a reader arriving from the section below.
      if (y > final + 2 && !down) {
        const clamped = Math.max(projected, final);
        if (projected <= final) {
          projected = final;
          accumulated = 0;
          spent = true;
          spentAt = performance.now();
        }
        window.scrollTo({ top: clamped, behavior: "instant" });
        return;
      }

      // Inside the reel: one engagement per gesture, and no way to pass one.
      if (locked) return;

      /* The rest of the gesture that already moved: swallowed whole, until
         either the hand stops or it has gone on long enough to be a hand rather
         than a tail. */
      if (spent) {
        if (performance.now() - spentAt < CONTINUE_MS) return;
        spent = false;
        accumulated = 0;
      }

      accumulated += event.deltaY;
      if (Math.abs(accumulated) < (spentAt ? CONTINUE_PX : TRIGGER_PX)) return;

      const index = nearest(pos, y);
      const next = Math.min(last, Math.max(0, index + Math.sign(accumulated)));
      accumulated = 0;
      spent = true;
      goTo(pos[next]);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scrollend", onScrollEnd);

    return () => {
      window.clearTimeout(unlockTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scrollend", onScrollEnd);
    };
  }, [count]);

  return trackRef;
}
