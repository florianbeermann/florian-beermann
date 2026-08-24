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
 * The reel itself no longer runs on a scroll-driven animation — it is a
 * transition on an index, see useEngagementReel.ts — but the stacking hazard it
 * carried is a property of the layout rather than of the mechanism, so the last
 * test here follows it to whatever is holding the cards apart now.
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

  it("keeps the engagement reel's parked position, which is what stops it stacking", () => {
    const home = cssFiles.find(({ file }) => file === "src/pages/Home.css");
    const css = withoutComments(home!.css);

    // All three engagements share one grid cell, so something has to hold them
    // apart. It used to be a scroll-driven animation's fill mode; it is now the
    // transform they sit at by default, with the rules below pulling exactly
    // one of them in. Lose that default and all three land on top of each
    // other — the same failure, from the other direction.
    const reelRule = css.match(/\.home-engagement\s*\{[^}]*grid-area:\s*1\s*\/\s*1[^}]*\}/);
    expect(
      reelRule,
      "the engagement reel rule should still share one grid cell",
    ).not.toBeNull();
    expect(
      reelRule![0],
      "every engagement must park off-screen by default, or they stack",
    ).toMatch(/transform:\s*translateX\(100%\)/);
    expect(
      reelRule![0],
      "the travel is a transition now, not a scroll-driven animation",
    ).toMatch(/transition:\s*transform/);

    // And the index has to actually pull one in. Without these the reel is
    // three cards parked off-screen and the section is empty.
    expect(
      css,
      "an active engagement must be pulled into the frame",
    ).toMatch(/\[data-active="0"\][^{]*:nth-child\(1\)/);
  });

});
