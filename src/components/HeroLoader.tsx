import { useEffect, useRef, useState } from "react";
import { CircleMark } from "@/components/CircleMark";

/* The loading screen.
 *
 * It exists because the hero is a large plate and the first thing a visitor
 * would otherwise judge the site by is a poster stretched past its resolution.
 *
 * It is paper, and that is the whole idea rather than a default. The clip is
 * cut to open on its own whiteout, so when this lifts the frame underneath is
 * already white and dissolving into the mountains. The screen does not get out
 * of the way of the reveal; it is the first half of it. The mark and wordmark
 * are in the signal blue for the same reason — that is exactly what the hero's
 * type does while the picture is white, so the handover is one continuous
 * gesture instead of two states meeting.
 */

type Props = {
  progress: number;
  ready: boolean;
  /* Called when the screen has finished leaving, not when it starts.

     The plate is held on its first frame until this fires, and that frame is
     the clip's whiteout. So the fade uncovers a white picture with the type
     already blue — the loader's own lockup is blue, and it hands over to type
     in the same colour — and the dissolve to the mountains begins after the
     curtain is gone rather than behind it.

     Firing this at the start of the fade instead spends the whole whiteout
     under the curtain: by the time anything was visible the picture was back on
     the mountains and the type had gone white again. */
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
