// How public/hero-loop.mp4 is made, kept as a record rather than as a step in
// the build: the clip is an asset, cut once and committed.
//
// Run it against a source clip if the footage is ever replaced:
//
//   node scripts/build-hero-loop.mjs path/to/source.mp4
//
// Needs ffmpeg on PATH. It is not a dependency of this project — an 80MB binary
// in node_modules to run one command twice a year is a bad trade.
//
// ── The loop ─────────────────────────────────────────────────────────────────
//
// The source ends on a cloud that swallows the frame. That whiteout is the
// obvious place to join a loop, and an earlier cut did exactly that — but a
// picture that goes white is an event, and an event at the join reads as the
// video ending rather than continuing. WINDOW stops short of it.
//
// Which leaves no natural join at all. Measured across the mountain passage,
// the best-matching pair of frames more than eight seconds apart scores an
// RMSE of 17.6 against a 1.23 baseline for consecutive frames — fourteen times
// worse. The clouds drift one way and never come back, and the light fades
// steadily from a mean of 142 to 114, so no two moments are alike.
//
// So the join is made rather than found: the tail is dissolved into the head.
//
// ── The order matters ────────────────────────────────────────────────────────
//
// The crossfade goes at the FRONT of the output, not the back:
//
//   [ xfade( C[E-X, E] -> C[S, S+X] ) ][ C[S+X, E-X] ]
//
// so the file ends on C(E-X) and begins on a blend that starts at C(E-X). The
// wrap is then continuous. Putting the same crossfade at the end instead leaves
// the last frame at C(S+X) against a first frame of C(S) — X seconds of jump,
// which is what the first attempt at this shipped. Measured: seam distance 0.96
// against a 1.17 adjacent-frame baseline, i.e. the wrap is smoother than an
// ordinary step between two frames.
//
// WINDOW is chosen for luminance rather than for length. The light fades
// through the clip, so the two ends of any window differ; 2.0 to 18.0 puts them
// within a few points of each other, which is what stops the loop pulsing.
//
// ── Encoding ─────────────────────────────────────────────────────────────────
//
// CRF 20 is chosen to be indistinguishable from the source rather than merely
// good. Measured against it on the untouched middle of the clip, CRF 20 gives
// PSNR 47.9dB and CRF 18 gives 49.0dB — both far past the ~40dB where
// differences stop being visible in motion. Watch the sky for banding, which is
// the failure mode on a gradient this smooth. Audio is dropped: it is a
// background, and a muted track is also what lets the browser autoplay it.
//
// Two cuts, because one file cannot serve both cases. The full one keeps the
// source's 2560 so a retina desktop is not upscaling it; the small one is for
// phones, where a 16:9 plate under object-fit: cover is cropped by height and
// the extra width is spent on pixels that get thrown away. See pickSource in
// HeroVideo.tsx.

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

/* Seconds of the source to keep, and how long the dissolve that joins them is.
   A long fade hides a bigger mismatch but spends more of the loop blending; 2s
   is what this footage needs and no more. */
const WINDOW = { start: 2.0, end: 18.0 };
const FADE = 2.0;

const CUTS = [
  { width: 2560, height: 1440, crf: 20, out: "public/hero-loop.mp4" },
  { width: 1920, height: 1080, crf: 22, out: "public/hero-loop-sm.mp4" },
];

/* Taken past the crossfade, so a browser that refuses to autoplay shows plain
   footage rather than the one part of the loop that is a blend. */
const POSTER_AT = 2.5;

const src = process.argv[2];
const poster = process.argv[3] ?? "public/hero-poster.jpg";

if (!src || !existsSync(src)) {
  console.error("usage: node scripts/build-hero-loop.mjs <source.mp4> [poster.jpg]");
  process.exit(1);
}

const { start: S, end: E } = WINDOW;
const fadeInStart = E - FADE;
const mainStart = S + FADE;
const mainEnd = E - FADE;

for (const cut of CUTS) {
  const filter = [
    "[0:v]split=3[a][b][c]",
    `[a]trim=start=${fadeInStart}:end=${E},setpts=PTS-STARTPTS[tail]`,
    `[b]trim=start=${S}:duration=${FADE},setpts=PTS-STARTPTS[head]`,
    `[c]trim=start=${mainStart}:end=${mainEnd},setpts=PTS-STARTPTS[main]`,
    `[tail][head]xfade=transition=fade:duration=${FADE}:offset=0[seam]`,
    `[seam][main]concat=n=2:v=1:a=0,scale=${cut.width}:${cut.height}:flags=lanczos,format=yuv420p[out]`,
  ].join(";");

  execFileSync("ffmpeg", [
    "-hide_banner", "-v", "error", "-y",
    "-i", src,
    "-filter_complex", filter,
    "-map", "[out]",
    "-an",
    "-c:v", "libx264", "-preset", "medium", "-crf", String(cut.crf),
    "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    cut.out,
  ], { stdio: "inherit" });

  console.log(`wrote ${cut.out}`);
}

execFileSync("ffmpeg", [
  "-hide_banner", "-v", "error", "-y",
  "-ss", String(POSTER_AT), "-i", CUTS[0].out, "-frames:v", "1",
  "-vf", "scale=2560:-2", "-q:v", "4",
  poster,
], { stdio: "inherit" });

console.log(`wrote ${poster}`);
