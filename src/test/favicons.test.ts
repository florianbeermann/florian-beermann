import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const origin = "https://florianbeermann.com";
const sourceIco = readFileSync(path.join(root, "public/favicon.ico"));
const icoFrames = Array.from({ length: sourceIco.readUInt16LE(4) }, (_, index) => {
  const entry = 6 + index * 16;
  const length = sourceIco.readUInt32LE(entry + 8);
  const offset = sourceIco.readUInt32LE(entry + 12);
  return {
    width: sourceIco[entry] || 256,
    height: sourceIco[entry + 1] || 256,
    data: sourceIco.subarray(offset, offset + length),
  };
});

describe.each(["index.html", "public/login.php"])("%s favicons", (file) => {
  const source = readFileSync(path.join(root, file), "utf8");
  const page = new DOMParser().parseFromString(
    source.slice(source.indexOf("<!doctype html>")),
    "text/html",
  );
  const icons = [...page.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]')];

  it("offers the cropped ICO fallback before a pre-cropped PNG, not the SVG or full anvil", () => {
    expect(
      icons.map((icon) => ({
        path: new URL(icon.getAttribute("href")!, origin).pathname,
        type: icon.getAttribute("type"),
        sizes: icon.getAttribute("sizes"),
      })),
    ).toEqual([
      { path: "/favicon-crop.ico", type: "image/x-icon", sizes: "16x16 32x32 48x48" },
      { path: "/favicon-crop.png", type: "image/png", sizes: "32x32" },
    ]);
  });

  it("uses new asset filenames rather than query-only cache versions", () => {
    expect(icons).toHaveLength(2);

    for (const icon of icons) {
      const url = new URL(icon.getAttribute("href")!, origin);
      expect(url.pathname).toMatch(/^\/favicon-crop\.(ico|png)$/);
      expect(url.search).toBe("");
      expect(existsSync(path.join(root, "public", url.pathname))).toBe(true);
    }
  });

  it("keeps the full-anvil Apple touch icon separate from tab icons", () => {
    const touchIcon = page.querySelector('link[rel="apple-touch-icon"]');
    expect(touchIcon?.getAttribute("href")).toBe("/apple-touch-icon.png");
    expect(touchIcon?.getAttribute("sizes")).toBe("180x180");
  });

  if (file === "index.html") {
    it("retains the full-size PNG as the organisation logo", () => {
      const metadata = page.querySelector('script[type="application/ld+json"]');
      const organisation = JSON.parse(metadata!.textContent!);
      expect(organisation.logo).toBe(`${origin}/favicon.png`);
    });
  }
});

it("preserves the approved crop and all advertised sizes in the renamed ICO", () => {
  const ico = readFileSync(path.join(root, "public/favicon-crop.ico"));
  expect(ico).toEqual(sourceIco);
  expect(sourceIco.readUInt16LE(0)).toBe(0);
  expect(sourceIco.readUInt16LE(2)).toBe(1);

  const sizes = icoFrames.map(({ width, height }) => `${width}x${height}`);
  expect(sizes).toEqual(["16x16", "32x32", "48x48"]);
});

it("bakes the existing 32px crop into the standalone PNG without rescaling it", () => {
  const png = readFileSync(path.join(root, "public/favicon-crop.png"));
  const frame = icoFrames.find(({ width, height }) => width === 32 && height === 32);
  expect(frame).toBeDefined();
  expect(png).toEqual(frame?.data);
  expect(png.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  expect(png.readUInt32BE(16)).toBe(32);
  expect(png.readUInt32BE(20)).toBe(32);
});
