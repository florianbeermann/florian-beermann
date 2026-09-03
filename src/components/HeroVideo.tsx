import { useEffect, useRef, useState } from "react";

/* The hero background.
 *
 * The clip is cut to loop: its last frames are a held white, and the first
 * 0.35s dissolve that white back into the opening mountains. The seam was
 * measured at a mean absolute delta of 0.11 against 0.25 for an ordinary
 * adjacent pair, so `loop` alone is enough — there is no crossfade to run here
 * and no second decoder to pay for.
 *
 * What this component does have to do is tell the page when the picture is
 * near white, because the type has to get out of the way when it is. That is
 * read from the pixels rather than from a hardcoded timestamp: the timings
 * belong to this particular cut, and a component that knows them cannot have
 * its video replaced without also being edited.
 */

/* Where the plate starts on a fresh load.
 *
 * The clip's own first frames are the crossfade that closes its loop — see
 * scripts/build-hero-loop.mjs — so they are a blend rather than plain footage.
 * The blend is measurably invisible, but there is no reason for a visitor's
 * first seconds to be the one part of the loop that is doing work. */
const START_AT = 2.4;

/* The floor-to-wow curve.
 *
 * The signal is the darkest part of the frame, not its mean, and the
 * distinction is the whole point. What the type is crossing to is a blue that
 * needs a light ground under it, and a mean cannot tell "uniformly cloud" from
 * "half cloud, half mountain" — half a mountain is exactly where blue falls
 * apart. Measured mid-dissolve at a mean of 0.69, an earlier threshold on the
 * mean put the statement at 1.61:1 against the rock still showing through. When
 * the darkest part of the picture is bright, there is nowhere left for the blue
 * to fail.
 *
 * 0.76 is the settled floor of the clip's whiteout, and it is deliberately not
 * lowered to make a passing cloud bank reach it. That was tried: the bank takes
 * the floor to 0.361, so a ceiling near there does drive a full crossing — and
 * the result is blue type over mountains and bright sky, which is illegible and
 * reads as a fault rather than an effect. The measurement is on a 32x18 raster,
 * where a small dark region averages away; a high floor there means "no large
 * dark area", not "white". Only a real whiteout satisfies what the blue needs.
 *
 * A low percentile rather than the true minimum, so one stray dark pixel from
 * compression cannot hold the effect off. Values are sRGB, because this is a
 * threshold on how light the picture looks rather than a contrast
 * calculation. */
const FLOOR_LO = 0.14;
const FLOOR_HI = 0.76;
const FLOOR_PERCENTILE = 0.005;

/* How fast --wow may move, per second. The floor is a percentile of a small
 * raster, so it steps when a bank's edge crosses a sample row; unsmoothed, the
 * type flickers. Fast enough to keep up with the whiteout, which crosses its
 * whole range in about a tenth of a second. */
const WOW_RATE = 7;

/* The sampling raster. Deliberately tiny: drawImage downscales on the GPU, but
 * getImageData is a synchronous readback, and that cost is per pixel. 32x18 is
 * 576 pixels, enough for a stable half-percent floor and small enough that the
 * readback does not show up in a frame budget. */
const RASTER_W = 32;
const RASTER_H = 18;

type Props = {
  className?: string;
  poster: string;
  /* The full plate, and a lighter cut for small screens. */
  src: string;
  srcSmall: string;
  /* How much of the clip has buffered, 0 to 1, and a single call when there is
     enough of it to play through. The loading screen is driven from these
     rather than owning the element itself, so there is one video on the page
     and one place that knows how to read it. */
  onProgress?: (fraction: number) => void;
  onReady?: () => void;
  /* While true the plate stays paused on its first frame. The loading screen
     holds it there so the reveal uncovers the whiteout dissolving into the
     mountains, which is what the clip was cut to open on — left to start on its
     own it would be most of a second in by the time anyone saw it. */
  hold?: boolean;
};

/* Connections the plate is not worth its bytes on.
 *
 * The light cut is 5.5MB. That is four seconds on good LTE, sixteen at 3Mbit,
 * three quarters of a minute at 1Mbit — and German tariffs throttle to 32-64
 * kbit once the allowance is gone, where it is a twelve minute download of a
 * background nobody asked for. Below the threshold there is no video at all
 * and the page opens on the poster, which is the same picture standing still.
 *
 * effectiveType is an estimate of how a connection behaves rather than a radio
 * generation, which is exactly what makes it the right signal: a throttled LTE
 * connection reports 2g, because 2g is what it behaves like. The spec puts the
 * 3g ceiling at 700kbit, so everything caught here is a download of a minute
 * or worse.
 *
 * Deliberately not `connection.downlink`. It reads like the precise figure
 * this wants and is not one: Chrome returns a fixed 1.5 with an rtt of 50 when
 * it has no estimate to give, which is every desktop visitor. Measured here
 * against a real transfer it did not move — 1.5 reported against 985Mbit
 * actual, unchanged afterwards — so a threshold on it would have hidden the
 * plate from the machines most able to fetch it. effectiveType is a coarser
 * number but an honest one.
 *
 * That leaves a genuinely slow connection reporting 4g uncaught, and it does
 * not matter: nothing waits on this download any more. The page opens on the
 * poster within a fixed window and the plate crossfades in whenever it lands,
 * so being wrong here costs a background that arrives late rather than a
 * visitor held in front of a loading screen. See HeroLoader. */
const SLOW_TYPES = new Set(["slow-2g", "2g", "3g"]);

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

/* Which cut to fetch, or whether to fetch one at all. Null means poster only.
 *
 * The full plate is 2560 wide and 14.7MB, which is the right file for a
 * desktop hero and the wrong one for a phone on cellular. A portrait phone
 * cannot use the resolution in any case: the plate is 16:9 and object-fit:
 * cover, so on a tall box the crop is driven by height, and a 393pt screen at
 * 3x wants 2556 device pixels of height — which no 16:9 file under 4500 wide
 * would satisfy. The extra width is spent on a crop that is thrown away.
 *
 * Decided once, before the element gets a src, rather than with `media` on a
 * <source>: browsers only evaluate that at load time anyway, and several have
 * dropped it, so doing it here is both more portable and more honest about
 * being a one-time choice.
 *
 * Save-Data is respected where it is offered, and respected literally. It used
 * to select the smaller file, which still spent 5.5MB of an allowance its
 * owner had just asked not to spend. A visitor who has asked for less data has
 * asked for less data. */
function pickSource(src: string, srcSmall: string): string | null {
  if (typeof window === "undefined") return src;

  const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;

  if (conn?.saveData) return null;
  if (conn?.effectiveType && SLOW_TYPES.has(conn.effectiveType)) return null;

  // The CSS width the full cut starts paying for itself at, in the landscape
  // case. Below it the box is narrow, the crop is severe, and the light cut is
  // already more resolution than the screen can show.
  return window.innerWidth >= 900 ? src : srcSmall;
}

export function HeroVideo({
  className,
  poster,
  src,
  srcSmall,
  onProgress,
  onReady,
  hold = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Resolved once on mount and kept, so a window resize cannot swap the file
  // mid-loop and restart it. Null means the connection did not justify the
  // download and the poster is the background.
  const [chosen] = useState(() => pickSource(src, srcSmall));
  /* Whether the plate has frames to show yet. The poster is behind it the
     whole time, so this only governs a crossfade — see .hero-video-el. The
     loading screen no longer waits for the plate, so there is a real window
     where the page is up and the video is not, and a hard cut into it after
     several seconds looks like a fault. */
  const [showing, setShowing] = useState(false);

  // Held in refs so the effect below can stay mounted once. Callers pass
  // inline functions, and depending on them would tear down the video and
  // restart the download on every parent render.
  const progressRef = useRef(onProgress);
  const readyRef = useRef(onReady);
  const holdRef = useRef(hold);
  // Set by the effect below, called by the one above. See the note beside it.
  const playRef = useRef<(() => void) | null>(null);
  progressRef.current = onProgress;
  readyRef.current = onReady;

  /* Poster only. There is no element to drive, so the page is told at once that
     there is nothing to wait for. --wow stays at its registered initial 0,
     which is the right answer: the picture never turns to cloud, so the type
     never leaves paper. */
  useEffect(() => {
    if (chosen !== null) return;
    progressRef.current?.(1);
    readyRef.current?.();
  }, [chosen]);

  /* Releasing the hold. Separate from the effect below so that one can keep an
     empty dependency list and never tear the video down: re-running it would
     drop the download and start again. */
  useEffect(() => {
    holdRef.current = hold;
    const video = videoRef.current;
    if (!video) return;

    /* Parked on the opening frame, held or not.

       This is the whole reason the seek is not left until release: an element
       that has never been told otherwise sits at zero, and zero is the
       whiteout. The sampler reads whatever frame is showing, so a plate parked
       there measured white and put the statement in blue for the length of the
       loading screen — then snapped to paper the instant playback began. The
       flash was the parked frame, not the effect.

       Deferred to loadedmetadata when the browser does not have the duration
       yet, because a seek before then is discarded. */
    const park = () => {
      if (Math.abs(video.currentTime - START_AT) > 0.01) {
        video.currentTime = START_AT;
      }
    };

    if (hold) {
      video.pause();
      if (video.readyState >= 1) park();
      else video.addEventListener("loadedmetadata", park, { once: true });
      return () => video.removeEventListener("loadedmetadata", park);
    }

    park();
    playRef.current?.();
  }, [hold]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || chosen === null) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* ── Readiness ─────────────────────────────────────────────────────────
       How much of the clip is held, as a fraction of its duration. Seconds
       rather than bytes because nothing exposes the byte count of a media
       download.

       Every buffered range counts, not only the one under the playhead. That
       distinction is most of why the line used to sit still: the playhead is
       parked at START_AT while the loading screen is up, and a browser filling
       the file from a cold start has a range beginning at zero that does not
       contain 2.4s yet — which the old reading scored as nothing at all, for
       as long as it took to get there. Then the seek opened a second range and
       the reading jumped to wherever that range ended, counting the 2.4s in
       front of it as downloaded.

       Summing is safe here because readiness is a separate question, answered
       by canplay below. This number only has to describe how much of the file
       is in hand, and out-of-order buffering does not make that untrue. */
    const reportProgress = () => {
      const { buffered, duration } = video;
      if (!duration || !Number.isFinite(duration)) return;
      let held = 0;
      for (let i = 0; i < buffered.length; i++) {
        held += buffered.end(i) - buffered.start(i);
      }
      progressRef.current?.(Math.min(1, held / duration));
    };

    let announced = false;
    const announceReady = () => {
      if (announced) return;
      announced = true;
      progressRef.current?.(1);
      readyRef.current?.();
    };

    /* The plate has frames. Distinct from ready: ready releases the loading
       screen, this fades the picture in over the poster, and since the screen
       stopped waiting on the download the two happen at different times. */
    const reveal = () => setShowing(true);

    /* canplay rather than canplaythrough.
     *
     * canplaythrough means the browser thinks the rest of the file will
     * outrun playback, which is a question about the whole download and one
     * that a phone on mobile data answers "no" to for fifteen seconds. Nothing
     * here needs that promise: the plate loops a background, and a stall in it
     * costs a held frame. canplay means there are frames to show, which is the
     * thing actually being waited for. */
    video.addEventListener("progress", reportProgress);
    video.addEventListener("timeupdate", reportProgress);
    video.addEventListener("loadedmetadata", reportProgress);
    video.addEventListener("canplay", reportProgress);
    /* A browser that has stopped fetching sends no more progress events, and
       iOS Safari stops almost immediately on cellular — preload is advisory
       there and a paused element fetches next to nothing. Reading once more on
       the way out at least leaves the number truthful. */
    video.addEventListener("suspend", reportProgress);
    video.addEventListener("stalled", reportProgress);

    video.addEventListener("canplay", announceReady);
    video.addEventListener("canplay", reveal);
    video.addEventListener("playing", reveal);
    /* A file that will not arrive or will not decode must not hold the page.
       Nothing handled this before, so a 404 on the plate was a full-length
       wait behind a locked document ending in the poster — the same result,
       several seconds later. */
    video.addEventListener("error", announceReady);

    // A browser that refuses autoplay never reaches a playing state on its
    // own, and reduced motion never asks it to. Neither should hold the page
    // behind a loading screen, so the poster counts as ready in both cases.
    const onLoadedData = () => {
      if (reduced.matches) announceReady();
    };
    video.addEventListener("loadeddata", onLoadedData);
    if (reduced.matches) announceReady();

    const canvas = document.createElement("canvas");
    canvas.width = RASTER_W;
    canvas.height = RASTER_H;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    let wow = 0;
    let published = -1;
    const setWow = (next: number) => {
      // Two decimal places is finer than the eye can follow across a 260ms
      // crossing, and it keeps this from writing to the DOM on every frame for
      // changes that cannot be seen.
      const rounded = Math.round(next * 100) / 100;
      if (rounded === published) return;
      published = rounded;
      /* On the root rather than on the hero, because the masthead is fixed page
         chrome that sits outside this section but over it. Both need to know. */
      document.documentElement.style.setProperty("--wow", String(rounded));
    };

    const lums = new Float32Array(RASTER_W * RASTER_H);
    let last = 0;

    const sample = (now: number) => {
      if (!ctx || video.readyState < 2 || video.videoWidth === 0) return;

      /* The visible crop, not the whole frame. The plate is object-fit: cover,
         so on a narrow window a good deal of it is outside the box — and dark
         pixels nobody can see must not hold the effect off. Getting this wrong
         is not theoretical: sampling the full frame while measuring the crop is
         what made the two disagree at 890px wide. */
      const box = video.getBoundingClientRect();
      const scale = Math.max(
        box.width / video.videoWidth,
        box.height / video.videoHeight,
      );
      const sw = box.width / scale;
      const sh = box.height / scale;
      ctx.drawImage(
        video,
        (video.videoWidth - sw) / 2,
        (video.videoHeight - sh) / 2,
        sw,
        sh,
        0,
        0,
        RASTER_W,
        RASTER_H,
      );

      const { data } = ctx.getImageData(0, 0, RASTER_W, RASTER_H);
      for (let i = 0, p = 0; i < data.length; i += 4, p++) {
        // Rec. 709 on the encoded values, for the reason given above FLOOR_LO.
        lums[p] =
          (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
      }
      lums.sort();
      const floor = lums[Math.floor(FLOOR_PERCENTILE * lums.length)];

      const target = Math.min(
        1,
        Math.max(0, (floor - FLOOR_LO) / (FLOOR_HI - FLOOR_LO)),
      );

      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      const step = WOW_RATE * dt;
      wow = Math.abs(target - wow) <= step
        ? target
        : wow + Math.sign(target - wow) * step;
      setWow(wow);
    };

    /* The scheduler, and why it is two schedulers.

       requestVideoFrameCallback fires once per decoded frame, which is the
       right rate while the plate is playing: the picture changes at the clip's
       30fps whatever the display is doing. But it fires only on a decoded
       frame, so a paused video never ticks at all — and the plate is paused, on
       its first frame, for as long as the loading screen is up. That frame is
       the whiteout, and it has to be measured before the curtain lifts or the
       type is still white when it becomes visible.

       So it falls back to requestAnimationFrame whenever the video is paused,
       which keeps the loop alive over a still frame. Which one scheduled the
       pending callback is tracked, because they need different cancels. */
    type FrameHost = HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: (now: number) => void) => number;
      cancelVideoFrameCallback?: (handle: number) => void;
    };
    const host = video as FrameHost;
    const hasRvfc = typeof host.requestVideoFrameCallback === "function";

    let handle = 0;
    let handleIsRvfc = false;
    let running = false;

    const schedule = () => {
      handleIsRvfc = hasRvfc && !video.paused;
      handle = handleIsRvfc
        ? host.requestVideoFrameCallback!(tick)
        : requestAnimationFrame(tick);
    };

    function tick(now: number) {
      if (!running) return;
      sample(now);
      schedule();
    }

    const startSampling = () => {
      if (running) return;
      running = true;
      last = 0;
      schedule();
    };
    const stopSampling = () => {
      running = false;
      if (!handle) return;
      if (handleIsRvfc) host.cancelVideoFrameCallback?.(handle);
      else cancelAnimationFrame(handle);
      handle = 0;
    };

    const play = () => {
      if (reduced.matches) return;
      startSampling();
      // Held means the loading screen is still up and the plate is parked on
      // its first frame. It is still measured — see startSampling — just not
      // advanced.
      if (holdRef.current) return;
      // A rejected play() is not an error worth surfacing: a browser that
      // refuses autoplay leaves the poster up, which is a correct fallback.
      void video.play().catch(() => undefined);
    };

    // So releasing the hold can go through the same path rather than reaching
    // for video.play() itself, which is what left the sampler unstarted: the
    // observer's only call to play() happened while hold was true and returned
    // early, and nothing called it again until the hero was scrolled out of
    // view and back.
    playRef.current = play;
    const pause = () => {
      video.pause();
      stopSampling();
    };

    /* Nothing is gained by decoding a background nobody is looking at, and this
       hero sits at the top of a long page. */
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : pause()),
      { threshold: 0 },
    );
    io.observe(video);

    const onVisibility = () => (document.hidden ? pause() : play());
    const onReducedChange = () => {
      if (reduced.matches) {
        pause();
        // The poster is the mountains, so the page must not be left holding
        // whatever crossing the last sampled frame happened to be part way
        // through.
        wow = 0;
        setWow(0);
      } else {
        play();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onReducedChange);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onReducedChange);
      stopSampling();
      video.removeEventListener("progress", reportProgress);
      video.removeEventListener("timeupdate", reportProgress);
      video.removeEventListener("loadedmetadata", reportProgress);
      video.removeEventListener("canplay", reportProgress);
      video.removeEventListener("suspend", reportProgress);
      video.removeEventListener("stalled", reportProgress);
      video.removeEventListener("canplay", announceReady);
      video.removeEventListener("canplay", reveal);
      video.removeEventListener("playing", reveal);
      video.removeEventListener("error", announceReady);
      video.removeEventListener("loadeddata", onLoadedData);
      document.documentElement.style.removeProperty("--wow");
    };
  }, [chosen]);

  return (
    <div
      className={className}
      aria-hidden="true"
      /* The poster is the ground rather than only the video's placeholder.
         With the loading screen no longer waiting on the download, the plate
         can arrive well after the page does — and on a connection that did not
         justify it, never. Something has to be the background in the meantime,
         and it should be this picture. */
      style={{ backgroundImage: `url(${poster})` }}
    >
      {chosen === null ? null : (
        <video
          ref={videoRef}
          className="hero-video-el"
          data-showing={showing ? "true" : undefined}
          poster={poster}
          src={chosen}
          muted
          loop
          playsInline
          /* The plate is the hero, so it is worth fetching eagerly — and
             +faststart is set on the file, so playback begins long before the
             download finishes. The poster covers the gap either way. */
          preload="auto"
          /* Not autoPlay: the observer starts it, so a hero scrolled past on
             load never decodes a frame. */
          tabIndex={-1}
        />
      )}
    </div>
  );
}
