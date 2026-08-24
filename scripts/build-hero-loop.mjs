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
// ── What it does ─────────────────────────────────────────────────────────────
//
// The source ends on a cloud that swallows the frame, which is the natural
// place to loop. But its white is a peak rather than a plateau: the brightest
// frame is the last one, so cutting there and crossfading straight back to the
// opening blends the white with the mountains and the picture never actually
// reaches white. That matters here, because the page turns its type blue in
// proportion to how white the frame is, and a whiteout diluted to a haze never
// triggers the effect it exists for.
//
// So the last frame is held first, and the crossfade is taken from inside that
// hold. The result reaches a real white, sits in it, and dissolves out of it
// into the opening — and because the tail being dissolved is the same held
// frame the file ends on, the loop point is seamless. Measured on the output:
// the mean absolute delta from the last frame to the first is 0.11, against
// 0.25 for an ordinary adjacent pair.
//
// ── Numbers ──────────────────────────────────────────────────────────────────
//
// HOLD    how long the final frame is frozen before the dissolve begins.
// OVERLAP how much of that hold is spent dissolving into the opening. The
//         difference, HOLD - OVERLAP, is how long the page sits at full white.
// CRF 30 at 1920 takes a 2560x1440 source from 22.5MB to 2.0MB with no banding
//         in the sky, which is the failure mode to watch for on a gradient this
//         smooth. Audio is dropped: it is a background, and a muted track is
//         also what lets the browser autoplay it.

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

const HOLD = 0.7;
const OVERLAP = 0.35;
const WIDTH = 1920;
const HEIGHT = 1080;
const CRF = 30;

const src = process.argv[2];
const out = process.argv[3] ?? "public/hero-loop.mp4";
const poster = process.argv[4] ?? "public/hero-poster.jpg";

if (!src || !existsSync(src)) {
  console.error("usage: node scripts/build-hero-loop.mjs <source.mp4> [out.mp4] [poster.jpg]");
  process.exit(1);
}

const probe = execFileSync("ffmpeg", ["-hide_banner", "-i", src], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"],
}).toString();
// ffmpeg reports on stderr and exits non-zero with no output file, so the
// duration is read back out of what it printed.
const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(probe);
if (!m) {
  console.error("could not read a duration from ffmpeg");
  process.exit(1);
}
const duration = Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);

const padded = duration + HOLD;
const tailStart = padded - OVERLAP;

const filter = [
  `[0:v]tpad=stop_mode=clone:stop_duration=${HOLD}[c]`,
  "[c]split=3[c1][c2][c3]",
  `[c1]trim=start=0:end=${OVERLAP},setpts=PTS-STARTPTS[head]`,
  `[c2]trim=start=${tailStart}:end=${padded},setpts=PTS-STARTPTS[tail]`,
  `[c3]trim=start=${OVERLAP}:end=${tailStart},setpts=PTS-STARTPTS[mid]`,
  `[tail][head]xfade=transition=fade:duration=${OVERLAP}:offset=0[xf]`,
  `[xf][mid]concat=n=2:v=1:a=0,scale=${WIDTH}:${HEIGHT}:flags=lanczos,format=yuv420p[out]`,
].join(";");

execFileSync("ffmpeg", [
  "-hide_banner", "-v", "error", "-y",
  "-i", src,
  "-filter_complex", filter,
  "-map", "[out]",
  "-an",
  "-c:v", "libx264", "-preset", "slow", "-crf", String(CRF),
  "-profile:v", "high", "-pix_fmt", "yuv420p",
  "-movflags", "+faststart",
  out,
], { stdio: "inherit" });

// The poster is taken past the dissolve, so a browser that refuses to autoplay
// shows the mountains rather than a white screen it will never move off.
execFileSync("ffmpeg", [
  "-hide_banner", "-v", "error", "-y",
  "-ss", "1.2", "-i", out, "-frames:v", "1",
  "-vf", "scale=1280:-2", "-q:v", "6",
  poster,
], { stdio: "inherit" });

console.log(`wrote ${out} and ${poster}`);
