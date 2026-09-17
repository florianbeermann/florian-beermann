import { globSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (file: string) => readFileSync(path.join(root, file), "utf8");
const cssFiles = globSync("src/**/*.css", { cwd: root }).map(file => ({ file, css: read(file) }));
const home = read("src/pages/Home.css");
const sections = read("src/pages/home-sections.css");
const markup = read("src/pages/Home.tsx");
const withoutComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

describe("homepage reading and motion", () => {
  it("never uses a nameless animation shorthand that minification could break", () => {
    const offenders: string[] = [];
    for (const { file, css } of cssFiles) {
      const source = withoutComments(css);
      const names = [...source.matchAll(/@keyframes\s+([\w-]+)/g)].map(([, name]) => name);
      for (const match of source.matchAll(/(^|[;{])\s*animation:\s*([^;}]+)/g)) {
        const value = match[2].trim();
        if (value !== "none" && !names.some(name => new RegExp(`\\b${name}\\b`).test(value))) {
          offenders.push(`${file}: animation: ${value}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("uses fixed, internally scrolling screens instead of the retired service reel", () => {
    expect(markup).toContain("useHomeSections(page)");
    expect(markup.match(/<SectionScreen id=/g)).toHaveLength(6);
    expect(markup).not.toMatch(/useEngagementReel|scroll-panels\.css|site-stop|home-engagement-reel/);
    expect(sections).toContain("height: calc(100dvh - var(--screen-header))");
    expect(sections).toContain("overflow-y: auto");
    expect(sections).toContain("overscroll-behavior: contain");
    expect(sections).toContain(".fixed-sections .section-screen[hidden]");
  });

  it("centres the stacked Home logo against the full viewport", () => {
    expect(home).toMatch(/\.boutique-page \.opening-brand\s*\{[^}]*inset:\s*0/);
    expect(sections).toMatch(/\.fixed-sections\[data-active-screen="top"\] #section-viewport\s*\{[^}]*top:\s*0/);
    expect(sections).not.toMatch(/\.fixed-sections\[data-active-screen="top"\] \.opening-brand\s*\{[^}]*top:\s*var\(--screen-header\)/);
    expect(sections).toContain("height: 100dvh");
  });

  it("reserves separate, measured space for the mobile menu", () => {
    expect(sections).toContain(":has(.mobile-menu[open]) .opening-brand");
    expect(sections).toContain("top: var(--mobile-menu-bottom, var(--screen-header))");
    expect(sections).toContain("clamp(96px, 30dvh, 160px)");
    const navigation = read("src/hooks/useHomeSections.ts");
    expect(navigation).toContain("dropdown.getBoundingClientRect().bottom");
    expect(navigation).toContain("observer?.observe(dropdown)");
  });

  it("keeps the legacy custom scrollbar from narrowing the approved homepage", () => {
    const rules = postcss.parse(read("src/index.css"));
    rules.walkRules(rule => {
      if (rule.selector.includes("::-webkit-scrollbar")) {
        expect(rule.selectors.every(selector => selector.startsWith("html:not(.fixed-sections)"))).toBe(true);
      }
    });
  });

  it("preserves navigation dimensions while hiding only the Home header brand", () => {
    const rules = postcss.parse(sections);
    const hiddenBrand: string[] = [];
    rules.walkRules('.fixed-sections .masthead .brand[aria-hidden="true"]', rule => { hiddenBrand.push(rule.toString()); });
    expect(hiddenBrand).toHaveLength(1);
    expect(hiddenBrand[0]).toContain("visibility: hidden");
    expect(hiddenBrand[0]).not.toContain("display: none");
    expect(home).toMatch(/\.boutique-page \.masthead\s*\{[^}]*background:\s*var\(--paper\)/);
    expect(sections).toMatch(/\.fixed-sections\[data-active-screen="top"\] \.masthead\s*\{[^}]*background:\s*transparent/);
  });

  it("preserves the colour portrait's definite width and original ratio", () => {
    expect(home).toMatch(/\.boutique-page \.portrait\s*\{[^}]*width:\s*min\(100%, 390px\)/);
    expect(home).toMatch(/\.boutique-page \.portrait img\s*\{[^}]*width:\s*100%[^}]*height:\s*auto/);
    expect(markup).toContain('width="1023" height="1537"');
    expect(home).not.toMatch(/grayscale\(/);
  });

  it("removes only reading-focus boxes from section headings, not control focus indicators", () => {
    const selector = '.fixed-sections .section-screen :is(h1, h2, h3)[tabindex="-1"]:focus';
    const rules = postcss.parse(sections);
    const headingOutlines: string[] = [];
    rules.walkRules(selector, rule => {
      rule.walkDecls("outline", declaration => { headingOutlines.push(declaration.value); });
    });
    expect(headingOutlines).toEqual(["none"]);
    const controlOutlines: string[] = [];
    postcss.parse(home).walkRules(".boutique-page :is(a, button, input, textarea, summary):focus-visible", rule => {
      rule.walkDecls("outline", declaration => { controlOutlines.push(declaration.value); });
    });
    expect(controlOutlines).toEqual(["2px solid currentColor"]);
  });

  it("uses real italic faces and one readable label without hover underlines", () => {
    expect(home).toContain('font-family: "Libre Caslon Text"');
    expect(home).toContain("LibreCaslonText-Italic.woff2");
    expect(home).toContain("Switzer-Italic.woff2");
    expect(home).toContain("font-synthesis: none");
    expect(home).toContain("text-decoration-line: none");
    expect(home).toContain("visibility: hidden");
    expect(read("src/components/LinkLabel.tsx").match(/<span/g)).toHaveLength(2);
  });

  it("keeps the opening immediately available without retired video or gradient effects", () => {
    expect(withoutComments(home)).not.toMatch(/text-align:\s*justify/);
    expect(markup).not.toMatch(/HeroLoader|HeroVideo|BrandIntro|hero-loop|hero-poster/);
    expect(read("src/components/ArtworkGallery.tsx")).toContain('data-interval="4000"');
    expect(read("src/components/ArtworkGallery.tsx")).toContain('data-fade-duration="1200"');
  });
});
