import { useEffect, useRef, useState } from "react";
import { watchCloudColour } from "@/lib/cloud-colour";

type Props = {
  className?: string;
  poster: string;
  src: string;
  srcSmall: string;
  onCloudPhase?: (phase: number) => void;
};

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

function pickSource(src: string, srcSmall: string): string | null {
  const connection = (navigator as Navigator & { connection?: NetworkInfo }).connection;
  if (
    connection?.saveData ||
    (connection?.effectiveType && ["slow-2g", "2g", "3g"].includes(connection.effectiveType))
  ) {
    return null;
  }
  return window.innerWidth >= 900 ? src : srcSmall;
}

export function HeroVideo({ className, poster, src, srcSmall, onCloudPhase }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [source] = useState(() => pickSource(src, srcSmall));
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(() => !document.hidden);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [loadVideo, setLoadVideo] = useState(false);
  const [showing, setShowing] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [videoError, setVideoError] = useState("");
  const shouldPlay = visible && documentVisible && !reducedMotion && !blocked;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => {
      setReducedMotion(media.matches);
    };
    const onVisibilityChange = () => setDocumentVisible(!document.hidden);
    media.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      media.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source) return;
    if (!shouldPlay) {
      if (!video.paused) video.pause();
      return;
    }
    // The poster is usable immediately. Reduced motion never downloads video.
    if (!loadVideo) {
      setLoadVideo(true);
      return;
    }

    let cancelled = false;
    video.play().catch((error: unknown) => {
      if (cancelled || (error instanceof DOMException && error.name === "AbortError")) return;
      setBlocked(true);
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        console.info("Automatic background playback was blocked. Showing the still image.");
        return;
      }
      console.warn("Background video could not play:", error);
      setVideoError("The background video could not play. The still image is available.");
    });
    return () => {
      cancelled = true;
      if (!video.paused) video.pause();
    };
  }, [shouldPlay, loadVideo, source]);

  useEffect(() => {
    onCloudPhase?.(0);
    const video = videoRef.current;
    if (!video || !showing || !shouldPlay || !onCloudPhase) return;
    return watchCloudColour(video, onCloudPhase);
  }, [onCloudPhase, showing, shouldPlay]);

  return (
    <>
      <div
        ref={containerRef}
        className={className}
        style={{ backgroundImage: `url("${poster}")` }}
        aria-hidden="true"
      >
        {source && (
          <video
            ref={videoRef}
            className="hero-video-el"
            src={loadVideo ? source : undefined}
            poster={poster}
            preload="none"
            muted
            loop
            playsInline
            tabIndex={-1}
            data-showing={showing || undefined}
            onLoadedMetadata={(event) => {
              // Open after the loop seam, as in the original cloud animation.
              if (event.currentTarget.duration > 2.4) event.currentTarget.currentTime = 2.4;
            }}
            onPlaying={() => setShowing(true)}
            onError={() => {
              console.warn("Background video failed to load.");
              setShowing(false);
              setBlocked(true);
              setVideoError("The background video could not load. The still image is available.");
            }}
          />
        )}
      </div>
      {videoError && <p className="hero-video-status" role="status">{videoError}</p>}
    </>
  );
}
