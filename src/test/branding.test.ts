import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

const read = (file: string) => readFileSync(resolve(file), "utf8");
const declaration = (css: string, selector: string, property: string) => {
  let value: string | undefined;
  postcss.parse(css).walkRules(selector, (rule) => {
    rule.walkDecls(property, (decl) => {
      value = decl.value;
    });
  });
  return value;
};

describe("brand identity", () => {
  it("uses the approved blue in the shared palette and its component-library mirrors", () => {
    const palette = read("src/styles/palettes.css");
    expect(declaration(palette, ":root", "--p-blue")).toBe("#305cde");
    expect(declaration(palette, ":root", "--p-blue-rgb")).toBe("48 92 222");
    expect(declaration(palette, ":root", "--p-blue-hsl")).toBe("224.83 72.5% 52.94%");
    expect(declaration(palette, ":root", "--p-pig-dark")).toContain("var(--p-blue)");
    expect(declaration(palette, ":root", "--p-pig-light")).toContain("var(--p-blue)");
    expect(declaration(read("src/styles/shell.css"), ".site-brand-lockup", "color")).toBe(
      "var(--p-blue)",
    );
    expect(read("src/lib/gradient-background.ts")).toContain("var(--p-blue, #305cde)");
    const favicon = new DOMParser().parseFromString(read("public/favicon.svg"), "image/svg+xml");
    expect(favicon.documentElement.getAttribute("aria-label")).toBe("Beermann & Company");
    expect(favicon.querySelector("g")?.getAttribute("fill")).toBe("#305CDE");
    expect(favicon.querySelector("g")?.getAttribute("stroke")).toBe("#305CDE");
  });

  it("preloads the licensed wordmark font rather than the retired face", () => {
    const page = new DOMParser().parseFromString(read("index.html"), "text/html");
    const fonts = [...page.querySelectorAll('link[rel="preload"][as="font"]')].map(
      (font) => font.getAttribute("href"),
    );
    expect(fonts).toContain("/fonts/LibreCaslonDisplay-Regular.woff2");
    expect(fonts).toHaveLength(3);
    expect(existsSync(resolve("public/fonts/LibreCaslonDisplay-Regular.woff2"))).toBe(true);
    expect(read("public/fonts/LICENSE-LIBRE-CASLON-DISPLAY.txt")).toContain(
      "SIL OPEN FONT LICENSE Version 1.1",
    );
  });

  it.each([
    ["public/login.php", ".gate-brand", ".gate-mark", ".gate-wordmark"],
    ["scripts/social-card.html", ".lockup", ".lockup svg", ".lockup span"],
  ])("keeps the standalone logo in %s aligned with the horizontal app logo", (file, logo, mark, name) => {
    const source = read(file);
    const page = new DOMParser().parseFromString(
      source.slice(source.indexOf("<!doctype html>")),
      "text/html",
    );
    const css = page.querySelector("style")!.textContent!;
    const shared = read("src/styles/wordmark.css");
    expect(page.querySelector(logo)?.getAttribute("aria-label")).toBe("Beermann & Company");
    expect(page.querySelector(name)?.textContent?.trim()).toBe("BEERMANN");
    expect(declaration(css, ":root", "--blue")).toBe("#305cde");
    for (const property of ["flex-direction", "gap"]) {
      expect(declaration(css, logo, property)).toBe(declaration(shared, ".wordmark", property));
    }
    expect(declaration(css, mark, "height")).toBe(declaration(shared, ".wordmark-mark", "height"));
    for (const property of ["line-height", "letter-spacing", "font-weight"]) {
      expect(declaration(css, name, property)).toBe(declaration(shared, ".wordmark-name", property));
    }
    expect(css).toContain('url("/fonts/LibreCaslonDisplay-Regular.woff2")');
  });
});
