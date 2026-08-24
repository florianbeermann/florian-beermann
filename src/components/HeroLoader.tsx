import { useEffect, useRef, useState } from "react";
import { CircleMark } from "@/components/CircleMark";

/* The loading screen.
 *
 * It exists because the hero is a large plate and the first thing a visitor
 * would otherwise judge the site by is a poster stretched past its resolution.
 *
 * It is paper with the lockup in the signal blue, which is the pairing the site
 * uses on every light ground — the gate page in front of it is the same. It is
 * not trying to be the hero: the plate underneath opens on the mountains with
 * the statement in paper, and this simply lifts off it.
 */

type Props = {
  progress: number;
  ready: boolean;
  /* Called when the screen has finished leaving, not when it starts.

     The plate is held on its opening frame until this fires, so the fade
     uncovers a still picture rather than one already part way through a
     movement nobody saw begin. Firing at the start of the fade instead spends
     the first 600ms of the clip behind a curtain. */
  onLeave?: () => void;
};

/* How long the fade takes, and how long the screen is held at minimum.
 *
 * The hold is not padding. On a warm cache the video is ready before the first
 * paint, and without it the screen appears and leaves inside a frame or two,
 * which reads as a flash of unstyled content rather than as an intro. Held
 * briefly it reads as deliberate either way. */
const FADE_MS = 620;
const MIN_HOLD_MS = 900;

/* A ceiling on the whole thing. A visitor must never be held behind this — a
 * stalled download, a browser that refuses to autoplay, a codec it will not
 * decode. Any of those and the page simply opens on the poster. */
const MAX_WAIT_MS = 12000;

export function HeroLoader({ progress, ready, onLeave }: Props) {
  const [state, setState] = useState<"holding" | "leaving" | "gone">("holding");

  // Held in a ref so a new inline callback cannot re-run the effect below and
  // restart the timers that decide when this leaves.
  const leaveRef = useRef(onLeave);
  leaveRef.current = onLeave;

  useEffect(() => {
    const started = performance.now();
    let leaveTimer = 0;
    let goneTimer = 0;
    let left = false;

    const leave = () => {
      if (left) return;
      left = true;
      setState("leaving");
      goneTimer = window.setTimeout(() => {
        setState("gone");
        leaveRef.current?.();
      }, FADE_MS);
    };

    const armed = () => {
      const held = performance.now() - started;
      leaveTimer = window.setTimeout(leave, Math.max(0, MIN_HOLD_MS - held));
    };

    if (ready) armed();
    const ceiling = window.setTimeout(leave, MAX_WAIT_MS);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(goneTimer);
      window.clearTimeout(ceiling);
    };
  }, [ready]);

  /* The document is locked while this is up, so a visitor cannot scroll the
     page behind a screen they cannot see past and arrive somewhere they did not
     choose. Released on the way out rather than when it finishes, so the page
     is usable through the fade. */
  useEffect(() => {
    if (state === "holding") {
      document.documentElement.dataset.heroLoading = "true";
      return () => {
        delete document.documentElement.dataset.heroLoading;
      };
    }
    delete document.documentElement.dataset.heroLoading;
  }, [state]);

  if (state === "gone") return null;

  return (
    <div
      className="hero-loader"
      data-leaving={state === "leaving" ? "true" : undefined}
      /* Not a live region and not announced. There is nothing here a screen
         reader needs: the page's content is already in the document behind it,
         and this is a curtain over a decorative background. */
      aria-hidden="true"
    >
      <div className="hero-loader-lockup">
        <CircleMark className="hero-loader-mark" />
        <span className="hero-loader-word">Florian Beermann &amp; Partners</span>
      </div>
      <div className="hero-loader-rule">
        <span
          className="hero-loader-fill"
          style={{ transform: `scaleX(${Math.max(0.04, Math.min(1, progress))})` }}
        />
      </div>
    </div>
  );
}
