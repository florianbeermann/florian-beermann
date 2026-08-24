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
 * Measured across the loop, the floor sits at 0.07 to 0.12 through the open
 * mountain passages, lifts to 0.22 and 0.28 as the two cloud banks drift across
 * at about 13.2s and 8.4s, and reaches 0.79 in the final whiteout. So FLOOR_LO
 * sits just above the baseline and FLOOR_HI at the settled white, which puts
 * the two banks around a fifth of the way to blue — visible as a lean, not as a
 * change of state — and the whiteout at the full crossing.
 *
 * A low percentile rather than the true minimum, so one stray dark pixel from
 * compression cannot hold the effect off; on this clip the two differ by about
 * 0.015. Values are sRGB, because this is a threshold on how light the picture
 * looks rather than a contrast calculation. */
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
};

/* Which cut to fetch.
 *
 * The full plate is 2560 wide and 7.7MB, which is the right file for a desktop
 * hero and the wrong one for a phone on cellular. A portrait phone cannot use
 * the resolution in any case: the plate is 16:9 and object-fit: cover, so on a
 * tall box the crop is driven by height, and a 393pt screen at 3x wants 2556
 * device pixels of height — which no 16:9 file under 4500 wide would satisfy.
 * The extra width is spent on a crop that is thrown away.
 *
 * Decided once, before the element gets a src, rather than with `media` on a
 * <source>: browsers only evaluate that at load time anyway, and several have
 * dropped it, so doing it here is both more portable and more honest about
 * being a one-time choice.
 *
 * Save-Data is respected where it is offered. A visitor who has asked for less
 * data has asked for less data. */
function pickSource(src: string, srcSmall: string) {
  if (typeof window === "undefined") return src;

  const conn = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  if (conn?.saveData) return srcSmall;

  // The CSS width the full cut starts paying for itself at, in the landscape
  // case. Below it the box is narrow, the crop is severe, and the light cut is
  // already more resolution than the screen can show.
  return window.innerWidth >= 900 ? src : srcSmall;
}

export function HeroVideo({ className, poster, src, srcSmall }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Resolved once on mount and kept, so a window resize cannot swap the file
  // mid-loop and restart it.
  const [chosen] = useState(() => pickSource(src, srcSmall));

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

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

    /* requestVideoFrameCallback where it exists, because it fires once per
       decoded frame rather than once per display refresh — the same rate the
       picture actually changes, on a 30fps clip and a 120Hz screen alike. */
    type FrameHost = HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: (now: number) => void) => number;
      cancelVideoFrameCallback?: (handle: number) => void;
    };
    const host = video as FrameHost;
    const useRvfc = typeof host.requestVideoFrameCallback === "function";

    let handle = 0;
    let running = false;
    const tick = (now: number) => {
      if (!running) return;
      sample(now);
      handle = useRvfc
        ? host.requestVideoFrameCallback!(tick)
        : requestAnimationFrame(tick);
    };
    const startSampling = () => {
      if (running) return;
      running = true;
      last = 0;
      handle = useRvfc
        ? host.requestVideoFrameCallback!(tick)
        : requestAnimationFrame(tick);
    };
    const stopSampling = () => {
      running = false;
      if (!handle) return;
      if (useRvfc) host.cancelVideoFrameCallback?.(handle);
      else cancelAnimationFrame(handle);
      handle = 0;
    };

    const play = () => {
      if (reduced.matches) return;
      // A rejected play() is not an error worth surfacing: a browser that
      // refuses autoplay leaves the poster up, which is a correct fallback.
      void video.play().catch(() => undefined);
      startSampling();
    };
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
      document.documentElement.style.removeProperty("--wow");
    };
  }, []);

  return (
    <div className={className} aria-hidden="true">
      <video
        ref={videoRef}
        className="hero-video-el"
        poster={poster}
        src={chosen}
        muted
        loop
        playsInline
        /* The plate is the hero, so it is worth fetching eagerly — and
           +faststart is set on the file, so playback begins long before the
           download finishes. The poster covers the gap either way. */
        preload="auto"
        /* Not autoPlay: the observer starts it, so a hero scrolled past on load
           never decodes a frame. */
        tabIndex={-1}
      />
    </div>
  );
}
