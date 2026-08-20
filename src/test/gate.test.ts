import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * The pre-launch gate lives in Apache config, which no amount of running the
 * site locally will exercise: `npm run dev` serves everything openly, so the
 * gate is only ever real on the deployed server. These tests cover the parts of
 * it that can break silently and would only surface as a visitor seeing either
 * Apache's grey default page or, far worse, the whole site.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const htaccess = readFileSync(path.join(root, "public/.htaccess"), "utf8");
const gatePage = readFileSync(path.join(root, "public/401.html"), "utf8");

/** The `<Files>` and `<FilesMatch>` blocks that hand out unauthenticated access. */
const exemptions = () => {
  const names = [...htaccess.matchAll(/<Files\s+"([^"]+)"\s*>\s*Require all granted/g)];
  const patterns = [...htaccess.matchAll(/<FilesMatch\s+"([^"]+)"\s*>\s*Require all granted/g)];

  return (basename: string) =>
    names.some(([, name]) => name === basename) ||
    patterns.some(([, pattern]) => new RegExp(pattern).test(basename));
};

/** Every same-origin asset 401.html asks the server for. */
const gatePageAssets = () => {
  const refs = [
    ...[...gatePage.matchAll(/(?:href|src)="([^"]+)"/g)].map(([, ref]) => ref),
    ...[...gatePage.matchAll(/url\("([^")]+)"\)/g)].map(([, ref]) => ref),
  ];

  // "/" is the sign-in link. It is supposed to 401 — that is the whole point of
  // the page — so it is the one reference that must not be exempted.
  return refs.filter((ref) => ref.startsWith("/") && ref !== "/");
};

describe("pre-launch gate", () => {
  it("refuses the site to anyone without credentials", () => {
    expect(htaccess).toMatch(/^AuthType Basic$/m);
    expect(htaccess).toMatch(/^Require valid-user$/m);

    // The literal path is substituted at deploy time from a secret. If it ever
    // gets committed instead, a public repository is advertising where the
    // password file lives.
    expect(htaccess).toMatch(/^AuthUserFile __HTPASSWD_PATH__$/m);
  });

  it("keeps the password file and the deploy manifest off the web", () => {
    for (const file of [".htpasswd", ".ftp-deploy-sync-state.json"]) {
      expect(htaccess).toContain(`<Files "${file}">`);
      expect(
        new RegExp(`<Files "${file.replace(/\./g, "\\.")}">\\s*Require all denied`).test(htaccess),
      ).toBe(true);
    }
  });

  it("hands 401s to the branded page rather than Apache's default", () => {
    // A full URL here is accepted by Apache and then quietly breaks the
    // credential prompt, so the leading slash is load-bearing.
    expect(htaccess).toMatch(/^ErrorDocument 401 \/401\.html$/m);
    expect(exemptions()("401.html")).toBe(true);
  });

  it("leaves version.json readable so the deploy checks keep working", () => {
    // Both workflows read it anonymously. Gating it does not fail loudly; it
    // just turns the drift check into a permanent red X.
    expect(exemptions()("version.json")).toBe(true);
  });

  it("exempts every asset the 401 page loads, and only real ones", () => {
    const isExempt = exemptions();
    const assets = gatePageAssets();

    expect(assets.length).toBeGreaterThan(0);

    for (const asset of assets) {
      const basename = asset.split("/").pop() as string;

      expect(
        isExempt(basename),
        `401.html loads ${asset}, which is still behind the gate. Add it to the Require-all-granted list in public/.htaccess or it will 401 and the page will render without it.`,
      ).toBe(true);

      expect(
        existsSync(path.join(root, "public", asset)),
        `401.html loads ${asset}, which does not exist in public/.`,
      ).toBe(true);
    }
  });

  it("keeps the sentence the deploy greps for to prove the page is live", () => {
    // deploy.yml reads the 401 body back off the wire and looks for this
    // string, because Apache silently falls back to its own error page when it
    // cannot serve ours. Rewording the headline without updating the workflow
    // turns a working deploy into a failing one.
    expect(gatePage).toContain("This site is not public yet");
  });

  it("stays out of the index while it is the only reachable page", () => {
    expect(gatePage).toMatch(/<meta name="robots" content="noindex, nofollow" \/>/);
  });
});
