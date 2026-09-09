import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const origin = "https://florianbeermann.com";

describe.each(["index.html", "public/login.php"])("%s favicons", (file) => {
  const source = readFileSync(path.join(root, file), "utf8");
  const page = new DOMParser().parseFromString(
    source.slice(source.indexOf("<!doctype html>")),
    "text/html",
  );
  const icons = [...page.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]')];

  it("offers the cropped ICO fallback before the SVG, not the full-anvil PNG", () => {
    expect(
      icons.map((icon) => ({
        path: new URL(icon.getAttribute("href")!, origin).pathname,
        type: icon.getAttribute("type"),
        sizes: icon.getAttribute("sizes"),
      })),
    ).toEqual([
      { path: "/favicon.ico", type: "image/x-icon", sizes: "16x16 32x32 48x48" },
      { path: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
    ]);
  });

  it("uses versioned URLs for both formats and points to real assets", () => {
    expect(icons).toHaveLength(2);

    for (const icon of icons) {
      const url = new URL(icon.getAttribute("href")!, origin);
      expect(url.searchParams.get("v")).toBe("anvil-crop");
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

it("ships every size advertised for the cropped ICO fallback", () => {
  const ico = readFileSync(path.join(root, "public/favicon.ico"));
  expect(ico.readUInt16LE(0)).toBe(0);
  expect(ico.readUInt16LE(2)).toBe(1);

  const sizes = Array.from({ length: ico.readUInt16LE(4) }, (_, index) => {
    const offset = 6 + index * 16;
    const width = ico[offset] || 256;
    const height = ico[offset + 1] || 256;
    return `${width}x${height}`;
  });
  expect(sizes).toEqual(["16x16", "32x32", "48x48"]);
});
