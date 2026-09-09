const SAMPLE_WIDTH = 32;
const SAMPLE_HEIGHT = 18;
const FLOOR_LOW = 0.14;
const FLOOR_HIGH = 0.76;
const FLOOR_PERCENTILE = 0.005;
const CHANGE_RATE = 7;

export function getCloudPhase(
  pixels: Uint8ClampedArray,
  luminances = new Float32Array(pixels.length / 4),
): number {
  if (!pixels.length || pixels.length % 4 || luminances.length !== pixels.length / 4) {
    throw new RangeError("Cloud sampling requires complete pixels and a matching luminance buffer.");
  }
  for (let index = 0, pixel = 0; index < pixels.length; index += 4, pixel++) {
    luminances[pixel] =
      (0.2126 * pixels[index] + 0.7152 * pixels[index + 1] + 0.0722 * pixels[index + 2]) / 255;
  }
  luminances.sort();
  // The original effect follows the darkest half-percent, not average brightness.
  const floor = luminances[Math.floor(FLOOR_PERCENTILE * luminances.length)];
  return Math.min(1, Math.max(0, (floor - FLOOR_LOW) / (FLOOR_HIGH - FLOOR_LOW)));
}

export function advanceCloudPhase(current: number, target: number, elapsedMilliseconds: number): number {
  if (
    !Number.isFinite(current) || current < 0 || current > 1 ||
    !Number.isFinite(target) || target < 0 || target > 1 ||
    !Number.isFinite(elapsedMilliseconds) || elapsedMilliseconds < 0
  ) {
    throw new RangeError("Cloud animation requires valid phases and elapsed time.");
  }
  const step = CHANGE_RATE * Math.min(elapsedMilliseconds / 1000, 0.1);
  return Math.abs(target - current) <= step
    ? target
    : current + Math.sign(target - current) * step;
}

export function watchCloudColour(video: HTMLVideoElement, onPhase: (phase: number) => void) {
  const frameCanvas = document.createElement("canvas");
  frameCanvas.width = SAMPLE_WIDTH;
  frameCanvas.height = SAMPLE_HEIGHT;
  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE_WIDTH;
  canvas.height = SAMPLE_HEIGHT;
  const luminances = new Float32Array(SAMPLE_WIDTH * SAMPLE_HEIGHT);
  let frameContext: CanvasRenderingContext2D | null | undefined;
  let context: CanvasRenderingContext2D | null | undefined;
  let phase = 0;
  let published = -1;
  let lastTime: number | null = null;
  let handle: number | null = null;
  let disposed = false;
  let failed = false;
  const videoFrames =
    typeof video.requestVideoFrameCallback === "function" &&
    typeof video.cancelVideoFrameCallback === "function";

  const publish = (next: number) => {
    const rounded = Math.round(next * 100) / 100;
    if (rounded === published) return;
    published = rounded;
    onPhase(rounded);
  };

  const sample = (now: number, immediate = false) => {
    if (disposed || failed || video.readyState < 2 || !video.videoWidth || !video.videoHeight) return;
    const box = video.getBoundingClientRect();
    if (!box.width || !box.height) return;

    if (context === undefined) {
      frameContext = frameCanvas.getContext("2d", { willReadFrequently: false });
      context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context || !frameContext) {
        console.warn("Cloud colour sampling is unavailable. Keeping the default text colour.");
        failed = true;
        publish(0);
        return;
      }
    }
    if (!context || !frameContext) return;

    // Match object-fit: cover, including the narrower crop on phones.
    const scale = Math.max(box.width / video.videoWidth, box.height / video.videoHeight);
    const width = box.width / scale;
    const height = box.height / scale;
    let pixels: Uint8ClampedArray;
    try {
      // Downscale before reading pixels so full-resolution frames stay on the
      // accelerated drawing surface instead of being copied into the reading canvas.
      frameContext.drawImage(
        video,
        (video.videoWidth - width) / 2,
        (video.videoHeight - height) / 2,
        width,
        height,
        0,
        0,
        SAMPLE_WIDTH,
        SAMPLE_HEIGHT,
      );
      context.drawImage(frameCanvas, 0, 0);
      pixels = context.getImageData(0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT).data;
    } catch (error) {
      if (!(error instanceof DOMException) ||
        (error.name !== "SecurityError" && error.name !== "InvalidStateError")) throw error;
      console.warn("Cloud colour sampling could not read the video frame:", error);
      failed = true;
      publish(0);
      return;
    }
    const target = getCloudPhase(pixels, luminances);
    const elapsed = lastTime === null ? 0 : Math.max(0, now - lastTime);
    lastTime = now;
    phase = immediate ? target : advanceCloudPhase(phase, target, elapsed);
    publish(phase);
  };

  const stop = () => {
    if (handle === null) return;
    if (videoFrames) video.cancelVideoFrameCallback(handle);
    else cancelAnimationFrame(handle);
    handle = null;
  };

  const schedule = () => {
    if (disposed || failed || video.paused || handle !== null) return;
    handle = videoFrames
      ? video.requestVideoFrameCallback(tick)
      : requestAnimationFrame(tick);
  };

  function tick(now: number) {
    handle = null;
    if (disposed) return;
    sample(now);
    schedule();
  }

  const start = () => {
    stop();
    lastTime = null;
    schedule();
  };
  const seek = () => sample(performance.now(), true);

  video.addEventListener("playing", start);
  video.addEventListener("pause", stop);
  video.addEventListener("seeked", seek);
  schedule();

  return () => {
    disposed = true;
    stop();
    video.removeEventListener("playing", start);
    video.removeEventListener("pause", stop);
    video.removeEventListener("seeked", seek);
    onPhase(0);
  };
}
