import { globSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const cssFiles = globSync("src/**/*.css", { cwd: root }).map((file) => ({
  file,
  css: readFileSync(path.join(root, file), "utf8"),
}));
const withoutComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

describe("homepage reading and motion", () => {
  it("scans the page stylesheets", () => {
    expect(cssFiles.map(({ file }) => file)).toContain("src/pages/Home.css");
  });

  it("never uses a nameless animation shorthand that minification could break", () => {
    const offenders: string[] = [];
    for (const { file, css } of cssFiles) {
      const source = withoutComments(css);
      const names = [...source.matchAll(/@keyframes\s+([\w-]+)/g)].map(([, name]) => name);
      for (const match of source.matchAll(/(^|[;{])\s*animation:\s*([^;}]+)/g)) {
        const value = match[2].trim();
        if (value === "none") continue;
        if (!names.some((name) => new RegExp(`\\b${name}\\b`).test(value))) {
          offenders.push(`${file}: animation: ${value}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("restores mandatory panel stops and the original three-screen service reel", () => {
    const styles = cssFiles.map(({ css }) => withoutComments(css)).join("\n");
    const markup = readFileSync(path.join(root, "src/pages/Home.tsx"), "utf8");
    expect(styles).toMatch(/scroll-snap-type:\s*y\s+mandatory/);
    expect(styles).toMatch(/scroll-snap-stop:\s*always/);
    expect(styles).toContain("height: calc(3 * 100svh)");
    expect(styles).toContain("animation-timeline: --engagement-reel");
    expect(styles).toContain("animation-range: contain 0% contain 100%");
    expect(styles).toContain("(prefers-reduced-motion: no-preference) and (min-width: 901px)");
    expect(markup).toContain('className="home-engagement-reel"');
    expect(markup).not.toContain("home-service-overview");
    expect(markup.match(/className="site-stop"/g)).toHaveLength(
      (markup.match(/<section\b/g) ?? []).length,
    );
    expect(markup).toMatch(/className="home-engagement-steps"[^>]*>\s*(<span\s*\/>\s*){3}/);
    const reelRule = styles.match(/\.home-engagement\s*\{[^}]*animation-timeline[^}]*\}/);
    expect(reelRule?.[0]).toContain("animation-fill-mode: both");
    expect(reelRule?.[0]).toContain("grid-area: 1 / 1");
  });

  it("does not hide native snap points behind scroll-animation support", () => {
    const source = cssFiles.find(({ file }) => file === "src/pages/scroll-panels.css")!;
    const rules = postcss.parse(source.css);
    let snapRules = 0;
    rules.walkDecls(/^scroll-snap-/, (declaration) => {
      snapRules++;
      const guards: string[] = [];
      let parent: postcss.AtRule | postcss.Rule | postcss.Root | postcss.Document | undefined = declaration.parent;
      while (parent) {
        if (parent.type === "atrule") guards.push(`@${parent.name} ${parent.params}`);
        parent = parent.parent;
      }
      expect(guards).not.toEqual(expect.arrayContaining([expect.stringContaining("animation-timeline")]));
      expect(guards).toContain(
        "@media (prefers-reduced-motion: no-preference) and (min-width: 901px)",
      );
    });
    expect(snapRules).toBeGreaterThan(0);
  });

  it("pauses the same reel keyframes for the non-native timeline fallback", () => {
    const source = cssFiles.find(({ file }) => file === "src/pages/scroll-panels.css")!;
    const rules = postcss.parse(source.css);
    const fallbacks: string[] = [];
    rules.walkAtRules("supports", (rule) => {
      if (rule.params === "not (animation-timeline: view())") fallbacks.push(rule.toString());
    });
    expect(fallbacks).toHaveLength(1);
    for (const selector of [".home-engagement,", ".home-engagement-progress-bar,", ".home-engagement-progress li"]) {
      expect(fallbacks[0]).toContain(selector);
    }
    expect(fallbacks[0]).toContain("animation-duration: 1s");
    expect(fallbacks[0]).toContain("animation-play-state: paused");
    const markup = readFileSync(path.join(root, "src/pages/Home.tsx"), "utf8");
    expect(markup).toContain("useEngagementReel(engagementTrackRef)");
    expect(markup).toContain('ref={engagementTrackRef} id="engagements"');
  });

  it("keeps body copy left aligned and the opening immediately available", () => {
    const home = cssFiles.find(({ file }) => file === "src/pages/Home.css")!;
    const styles = cssFiles.map(({ css }) => withoutComments(css)).join("\n");
    const markup = readFileSync(path.join(root, "src/pages/Home.tsx"), "utf8");
    expect(withoutComments(home.css)).not.toMatch(/text-align:\s*justify/);
    expect(styles).not.toMatch(/animation:\s*sheet-arrive/);
    expect(markup).not.toContain("HeroLoader");
  });

  it("uses ordinary section colours after the intro without mountain or cloud effects", () => {
    const styles = cssFiles.map(({ css }) => withoutComments(css)).join("\n");
    const markup = readFileSync(path.join(root, "src/pages/Home.tsx"), "utf8");
    expect(styles).not.toContain("--wow");
    expect(markup).not.toMatch(/HeroVideo|hero-loop|hero-poster|onCloudPhase/);
    expect(markup).toContain('id="top" className="home-opening home-section site-inverted site-panel"');
    expect(styles).toMatch(/\.home-opening \.home-opening-copy p\s*\{[^}]*color:\s*var\(--prose\)/);
    expect(styles).toMatch(/\.home-page \.home-opening\s*\{[^}]*scroll-margin-top:\s*0/);
  });

  it("keeps scrolling content from showing or receiving clicks through the header", () => {
    const masthead = withoutComments(
      cssFiles.find(({ file }) => file === "src/styles/masthead.css")!.css,
    );
    for (const [ground, token] of [["light", "--p-paper"], ["deep", "--p-blue"]]) {
      const rule = masthead.match(
        new RegExp(`\\.site-masthead\\[data-ground="${ground}"\\]\\s*\\{([^}]+)\\}`),
      );
      expect(rule?.[1]).toContain(`background: var(${token})`);
      expect(rule?.[1]).toContain("pointer-events: auto");
    }
  });
});
