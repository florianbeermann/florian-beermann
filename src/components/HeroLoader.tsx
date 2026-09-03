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

/* How long the fade takes, and the window the screen lives in.
 *
 * The hold is not padding. On a warm cache the video is ready before the first
 * paint, and without it the screen appears and leaves inside a frame or two,
 * which reads as a flash of unstyled content rather than as an intro. Held
 * briefly it reads as deliberate either way.
 *
 * The ceiling used to be twelve seconds, and it was not a safety net — on
 * mobile data it was the ordinary path. The light cut is a sixteen second
 * download at 3Mbit, so the plate lost that race routinely and the visitor got
 * twelve seconds of a line that barely moved, behind a document locked against
 * scrolling, ending on the poster anyway. Long enough to conclude the site is
 * broken and leave.
 *
 * So the screen leaves on a schedule now rather than on the download. The page
 * opens on the poster, which is the same picture standing still, and the plate
 * crossfades in behind it whenever it arrives — see .hero-video-el. Nothing is
 * waiting on a decorative background any more, which is what it should never
 * have been doing. */
const FADE_MS = 620;
const MIN_HOLD_MS = 900;
const MAX_WAIT_MS = 2600;

/* The line always moves.
 *
 * Buffered seconds arrive in bursts and stop arriving entirely when a browser
 * suspends the download — iOS Safari does exactly that on cellular, where
 * preload is advisory and a paused element fetches almost nothing, so there
 * are runs of seconds with no signal at all. A bar wired straight to them sits
 * still, and a bar sitting still is the plainest way to tell somebody a page
 * has failed.
 *
 * What is drawn instead is a line that creeps toward a ceiling short of full
 * on its own, and that real progress can only pull forward, never back. It
 * cannot reach the end by drifting: only the handover completes it. So it is
 * never idle and never claims something that has not happened.
 *
 * The rate closes a fixed fraction of the remaining distance each tick, which
 * puts it near the ceiling at about the time the screen is due to leave and
 * slows as it gets there — fast while there is nothing to report, deferential
 * once there is. */
const TRICKLE_MS = 90;
const TRICKLE_RATE = 0.055;
const TRICKLE_CEILING = 0.92;
const OPENS_AT = 0.04;

export function HeroLoader({ progress, ready, onLeave }: Props) {
  const [state, setState] = useState<"holding" | "leaving" | "gone">("holding");
  const [shown, setShown] = useState(OPENS_AT);

  // When this screen went up. Kept rather than recomputed, so the effect below
  // can re-run when `ready` flips without restarting its own deadlines — which
  // it did, and which meant a plate that arrived at 800ms was held until 1700
  // rather than 900.
  const [started] = useState(() => performance.now());

  // Held in a ref so a new inline callback cannot re-run the effect below and
  // restart the timers that decide when this leaves.
  const leaveRef = useRef(onLeave);
  leaveRef.current = onLeave;
  // Same, for the trickle: it reads the latest figure on its own schedule
  // rather than being restarted by every one that arrives.
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
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

    const since = () => performance.now() - started;

    if (ready) leaveTimer = window.setTimeout(leave, Math.max(0, MIN_HOLD_MS - since()));
    const ceiling = window.setTimeout(leave, Math.max(0, MAX_WAIT_MS - since()));

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(goneTimer);
      window.clearTimeout(ceiling);
    };
  }, [ready, started]);

  useEffect(() => {
    if (state !== "holding") {
      // Whatever it had drifted to, the screen leaving is what "loaded" means
      // here. The fill's own transition carries it the rest of the way while
      // the screen fades, so the line finishes rather than being cut off.
      setShown(1);
      return;
    }

    const id = window.setInterval(() => {
      setShown((current) => {
        const drift = current + (TRICKLE_CEILING - current) * TRICKLE_RATE;
        const real = Math.max(0, Math.min(1, progressRef.current || 0));
        return Math.max(current, Math.min(TRICKLE_CEILING, drift), real * TRICKLE_CEILING);
      });
    }, TRICKLE_MS);

    return () => window.clearInterval(id);
  }, [state]);

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
          style={{ transform: `scaleX(${shown})` }}
        />
      </div>
    </div>
  );
}
