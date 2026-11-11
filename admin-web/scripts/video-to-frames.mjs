// Turn any video into the 120-frame scroll sequence DispatchFilm plays.
//   node scripts/video-to-frames.mjs path/to/footage.mp4 [outDir=public/frames/dispatch] [frames=120]
// Needs ffmpeg on PATH. If you change the frame count, update FRAME_COUNT in
// components/marketing/dispatch-film.tsx to match, and re-time the BEATS / FOCUS tables.
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const [src, out = "public/frames/dispatch", frames = "120"] = process.argv.slice(2);
if (!src) {
  console.error("usage: node scripts/video-to-frames.mjs <video> [outDir] [frames]");
  process.exit(1);
}
mkdirSync(out, { recursive: true });
const probe = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src]).toString();
const fps = Number(frames) / Number(probe.trim());
execFileSync(
  "ffmpeg",
  ["-y", "-i", src, "-vf", `fps=${fps},scale=1280:-2`, "-frames:v", frames, "-c:v", "libwebp", "-quality", "74", `${out}/f%03d.webp`],
  { stdio: "inherit" },
);
console.log(`wrote ${frames} frames to ${out}`);
