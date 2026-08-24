import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * The scroll-driven sections are the one part of this site that a production
 * build can break on its own.
 *
 * `animation: linear both` is a legal shorthand and a nameless one: with no
 * name given it means `animation-name: none`. A minifier reading that rule in
 * isolation is entitled to conclude the animation can never run and collapse
 * the whole declaration to `animation: none` — which silently discards the
 * `linear` and the `both` alongside it. When the name actually arrives from a
 * more specific rule, as it does for `.home-engagement:nth-child(n)`, the
 * optimisation is locally valid and globally wrong.
 *
 * Losing the fill mode is what does the damage: outside the animation's active
 * range each element reverts to its untransformed position, and the three
 * engagements share one grid cell, so they land on top of one another. It ships
 * looking perfect, because a dev server serves unminified CSS and the reel
 * works there right up until it is deployed.
 *
 * So the rule is: never write a nameless `animation` shorthand. Put the shared
 * properties in longhands, which no minifier will fold together.
 *
 * The reel runs on a scroll-driven animation over the track's own view
 * timeline, and the scroll that drives it is paced by the browser's snapping —
 * no JavaScript on either side. The last tests here guard the two things that
 * have each silently broken it: the fill mode that holds the cards apart, and
 * the snap positions that make `mandatory` safe to use on the document.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const cssFiles = globSync("src/**/*.css", { cwd: root }).map((file) => ({
  file,
  css: readFileSync(path.join(root, file), "utf8"),
}));

/** Strip comments so a shorthand quoted in prose is not read as code. */
const withoutComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

describe("scroll-driven animation declarations", () => {
  it("scans the stylesheets it is supposed to scan", () => {
    expect(cssFiles.length).toBeGreaterThan(0);
    expect(cssFiles.map(({ file }) => file)).toContain("src/pages/Home.css");
  });

  it("never uses a nameless animation shorthand", () => {
    const offenders: string[] = [];

    for (const { file, css } of cssFiles) {
      const source = withoutComments(css);
      const names = [...source.matchAll(/@keyframes\s+([\w-]+)/g)].map(([, n]) => n);

      for (const match of source.matchAll(/(^|[;{])\s*animation:\s*([^;}]+)/g)) {
        const value = match[2].trim();

        // `animation: none` is the one nameless form that means what it says:
        // it switches an animation off rather than configuring a pending one.
        if (value === "none") continue;

        if (!names.some((name) => new RegExp(`\\b${name}\\b`).test(value))) {
          offenders.push(`${file}: animation: ${value}`);
        }
      }
    }

    expect(
      offenders,
      `A nameless 'animation' shorthand is folded to 'animation: none' by the ` +
        `production minifier, taking its timing function and fill mode with it. ` +
        `Use animation-timing-function / animation-fill-mode longhands instead:\n` +
        offenders.map((o) => `  ${o}`).join("\n"),
    ).toEqual([]);
  });

  it("keeps the engagement reel's fill mode, which is what stops it stacking", () => {
    const home = cssFiles.find(({ file }) => file === "src/pages/Home.css");
    const css = withoutComments(home!.css);

    // All three engagements share one grid cell, so the fill mode is the only
    // thing holding them apart outside the animation's active range. Lose it
    // and all three land on top of one another — and only in a production
    // build, because it takes a minifier to lose it.
    const reelRule = css.match(/\.home-engagement\s*\{[^}]*animation-timeline[^}]*\}/);
    expect(reelRule, "the engagement reel rule should still drive a timeline").not.toBeNull();
    expect(reelRule![0]).toMatch(/animation-fill-mode:\s*both/);
    expect(reelRule![0]).toMatch(/grid-area:\s*1\s*\/\s*1/);
  });

  it("keeps a snap position on every panel, which is what makes mandatory safe", () => {
    const home = cssFiles.find(({ file }) => file === "src/pages/Home.css");
    const css = withoutComments(home!.css);
    const markup = readFileSync(
      path.join(root, "src/pages/Home.tsx"),
      "utf8",
    );

    // This is the invariant the whole section rests on, and the one that has
    // already been broken once.
    //
    // `mandatory` is the only strictness that cannot be overshot, and it is the
    // reason a flick cannot cross the engagements or stop between two of them.
    // `proximity` has a catch radius it does not let you name — measured at
    // 220-240px against a 679px window — so a 2000px flick lands 314px past the
    // section and is not caught at all.
    //
    // The price of mandatory is that the scroll can never rest anywhere that is
    // not a snap position, so every panel needs one or it cannot be stopped on.
    // Delete the markers and the footer becomes unreachable, which forces a
    // retreat to proximity, which breaks the reel. They are load-bearing, and
    // that includes the ones on panels with nothing to do with the reel.
    expect(
      css,
      "snapping must stay mandatory, or a flick can cross the engagements",
    ).toMatch(/scroll-snap-type:\s*y\s+mandatory/);
    expect(
      css,
      "a snap position that can be scrolled over is not a stop",
    ).toMatch(/scroll-snap-stop:\s*always/);

    // Every section on the page, plus the closing panel, less the engagements
    // track — which carries its own three positions instead, one per
    // engagement, because it is three screens tall.
    const sections = markup.match(/<section\b/g) ?? [];
    const stops = markup.match(/className="site-stop"/g) ?? [];
    const expected = sections.length - 1 + 1;
    expect(
      stops.length,
      `every panel needs somewhere to catch: ${sections.length} sections and a closing panel, but ${stops.length} stops`,
    ).toBe(expected);

    // And the three inside the track, since it is three screens tall and its
    // own top will not hold a fling.
    const steps = markup.match(
      /className="home-engagement-steps"[^>]*>\s*(<span\s*\/>\s*){3}/,
    );
    expect(
      steps,
      "the engagements track needs one snap position per engagement",
    ).not.toBeNull();
  });
});
