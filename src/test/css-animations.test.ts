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

  it("keeps the reel and its rail on one symmetric curve", () => {
    const home = cssFiles.find(({ file }) => file === "src/pages/Home.css");
    const css = withoutComments(home!.css);

    // The bounce is a shape, not a duration — the reel is locked to the scroll,
    // so there is no clock to put a duration on. Linear here is the version
    // that reads as a strip being dragged.
    const curve = /cubic-bezier\(\s*0?\.62\s*,\s*0?\.09\s*,\s*0?\.38\s*,\s*0?\.91\s*\)/;
    const reelRule = css.match(/\.home-engagement\s*\{[^}]*animation-timeline[^}]*\}/);
    expect(
      reelRule![0],
      "the engagements must travel on the eased curve, not linearly",
    ).toMatch(curve);

    const barRule = css.match(/\.home-engagement-progress-bar\s*\{[^}]*\}/);
    expect(
      barRule![0],
      "the rail's segment must be shaped like the cards or it drifts off them",
    ).toMatch(curve);

    // And it needs its own midpoint, or one easing spans both segments and the
    // bar crawls while a card is mid-crossing. Sliced rather than matched:
    // a keyframes body has nested braces, which a regex character class cannot
    // cross.
    const progressAt = css.indexOf("@keyframes engagement-progress");
    const progressBody = css.slice(progressAt, css.indexOf("@keyframes", progressAt + 1));
    expect(
      progressBody,
      "the rail's travel needs a midpoint keyframe to be eased per card",
    ).toMatch(/50%\s*\{\s*transform:\s*translateX\(100%\)/);

    // The readout switches at the quarter points, which are the moments the
    // cards are exactly half crossed — true only while the curve is symmetric.
    const stepAt = css.indexOf("@keyframes engagement-step-second");
    const stepBody = css.slice(stepAt, css.indexOf("@keyframes", stepAt + 1));
    expect(
      stepBody,
      "the numbered readout must switch on the crossing points",
    ).toMatch(/24\.99%/);
  });
});
