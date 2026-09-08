import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const encoder = readFileSync(path.join(root, "scripts/build-hero-loop.mjs"), "utf8");
const code = encoder.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, "");

describe("hero video quality", () => {
  it("retains the original resolution and encoding quality", () => {
    expect(code).toContain('width: 2560, height: 1440, crf: 20, out: "public/hero-loop.mp4"');
    expect(code).toContain('width: 1920, height: 1080, crf: 22, out: "public/hero-loop-sm.mp4"');
  });

  it("does not replace the source frame cadence with an imposed frame rate", () => {
    expect(code).not.toMatch(/\bfps\s*=/);
    expect(code).not.toMatch(/["']-(?:r|framerate)["']/);
  });
});
