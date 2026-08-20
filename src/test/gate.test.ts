import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * The pre-launch gate lives in Apache config and one PHP file, neither of which
 * running the site locally will exercise: `npm run dev` serves everything
 * openly and does not run PHP at all, so the gate is only ever real on the
 * deployed server. These tests cover the parts that can break silently — the
 * ones whose failure is either a site nobody can enter or, far worse, a site
 * anybody can.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const htaccess = readFileSync(path.join(root, "public/.htaccess"), "utf8");
const loginPage = readFileSync(path.join(root, "public/login.php"), "utf8");

/** The `<Files>` and `<FilesMatch>` blocks that grant access without the cookie. */
const exemptions = () => {
  const names = [...htaccess.matchAll(/<Files\s+"([^"]+)"\s*>\s*Require all granted/g)];
  const patterns = [...htaccess.matchAll(/<FilesMatch\s+"([^"]+)"\s*>\s*Require all granted/g)];

  return (basename: string) =>
    names.some(([, name]) => name === basename) ||
    patterns.some(([, pattern]) => new RegExp(pattern).test(basename));
};

/** Every same-origin asset the login page asks the server for. */
const loginPageAssets = () => {
  const markup = loginPage.slice(loginPage.indexOf("<!doctype html>"));
  const refs = [
    ...[...markup.matchAll(/(?:href|src)="([^"]+)"/g)].map(([, ref]) => ref),
    ...[...markup.matchAll(/url\("([^")]+)"\)/g)].map(([, ref]) => ref),
  ];

  // "/" is where a successful sign-in goes, and it is supposed to stay refused
  // until then. login.php posts to itself and is exempt as the page it is.
  return refs.filter(
    (ref) => ref.startsWith("/") && ref !== "/" && !ref.startsWith("/login.php"),
  );
};

describe("pre-launch gate", () => {
  it("denies by default rather than redirecting the unauthorised", () => {
    // The load-bearing choice in the whole design. A mod_rewrite gate that
    // fails to match serves the site to everyone; `Require` denies unless
    // something grants, so the same mistake locks everyone out instead.
    expect(htaccess).toMatch(/^Require env FB_ACCESS$/m);
    expect(htaccess).toMatch(/^SetEnvIf Cookie .*fb_access=__ACCESS_TOKEN__.* FB_ACCESS$/m);

    const gateBlock = htaccess.slice(0, htaccess.indexOf("ErrorDocument 403"));
    expect(gateBlock).not.toMatch(/RewriteRule.*login\.php/);
  });

  it("anchors the cookie match so a lookalike value cannot pass", () => {
    const match = htaccess.match(/^SetEnvIf Cookie "([^"]+)"/m);
    expect(match).not.toBeNull();
    const pattern = match![1];

    // Without the leading boundary a cookie merely *named* something ending in
    // `fb_access` satisfies it; without the trailing one, the token followed by
    // any suffix does.
    expect(pattern.startsWith("(^|;")).toBe(true);
    expect(pattern.endsWith(";|$)")).toBe(true);
  });

  it("keeps the token out of the repository", () => {
    expect(htaccess).toContain("__ACCESS_TOKEN__");
    // The real one is 64 hex characters. Nothing that shape belongs in git.
    expect(htaccess).not.toMatch(/fb_access=[0-9a-f]{32,}/);
  });

  it("never lets the login page carry what it protects", () => {
    // login.php is served to anyone, so the hash and the token have to live in
    // the file .htaccess denies instead.
    expect(loginPage).toContain("require __DIR__ . '/gate-secrets.php'");
    expect(loginPage).not.toMatch(/\$2[aby]\$/);
    expect(loginPage).not.toMatch(/define\(\s*'FB_(PASSWORD_HASH|ACCESS_TOKEN)'/);

    expect(/<Files "gate-secrets\.php">\s*Require all denied/.test(htaccess)).toBe(true);
  });

  it("compares the password and the cookie in constant time", () => {
    // `==` on a token leaks its prefix through timing, and PHP's loose equality
    // additionally treats two numeric-looking strings as equal numbers.
    expect(loginPage).toMatch(/hash_equals\(/);
    expect(loginPage).toMatch(/password_verify\(/);
    expect(loginPage).not.toMatch(/\$_COOKIE\[[^\]]*\]\s*===?\s*FB_ACCESS_TOKEN/);
  });

  it("refuses to be turned into an open redirect", () => {
    // A leading slash alone is not the test: `//evil.com` and `/\evil.com` are
    // both browser-legal ways off the origin, so the second character matters.
    const guard = loginPage.match(/preg_match\('#\^\/\[\^([^\]]*)\]#'/);
    expect(guard, "safe_path() should reject a second character that leaves the origin").not.toBeNull();
    expect(guard![1]).toContain("/");
    expect(guard![1]).toContain("\\");
  });

  it("sets the cookie with every flag that matters", () => {
    for (const flag of ["'secure' => true", "'httponly' => true", "'samesite' => 'Lax'"]) {
      expect(loginPage).toContain(flag);
    }
  });

  it("keeps the deploy manifest and any leftover password file unreachable", () => {
    for (const file of [".htpasswd", ".ftp-deploy-sync-state.json"]) {
      expect(
        new RegExp(`<Files "${file.replace(/\./g, "\\.")}">\\s*Require all denied`).test(htaccess),
        `${file} should be denied over HTTP`,
      ).toBe(true);
    }
  });

  it("sends refused requests to the login page", () => {
    // A local path, not an absolute URL: a full URL makes Apache redirect
    // rather than serve, which loses the path the visitor asked for.
    expect(htaccess).toMatch(/^ErrorDocument 403 \/login\.php$/m);
    expect(exemptions()("login.php")).toBe(true);
  });

  it("leaves version.json readable so the deploy checks keep working", () => {
    expect(exemptions()("version.json")).toBe(true);
  });

  it("exempts every asset the login page loads, and only real ones", () => {
    const isExempt = exemptions();
    const assets = loginPageAssets();

    expect(assets.length).toBeGreaterThan(0);

    for (const asset of assets) {
      const basename = asset.split("/").pop() as string;

      expect(
        isExempt(basename),
        `login.php loads ${asset}, which is still behind the gate. Add it to the Require-all-granted list in public/.htaccess or it will be refused and the page will render without it.`,
      ).toBe(true);

      expect(
        existsSync(path.join(root, "public", asset)),
        `login.php loads ${asset}, which does not exist in public/.`,
      ).toBe(true);
    }
  });

  it("keeps the sentence the deploy greps for to prove the page is live", () => {
    // deploy.yml reads the 403 body back off the wire and looks for this
    // string. Rewording the headline without updating the workflow turns a
    // working deploy into a failing one.
    expect(loginPage).toContain("This site is not public yet");
  });

  it("stays out of the index while it is the only reachable page", () => {
    expect(loginPage).toMatch(/<meta name="robots" content="noindex, nofollow" \/>/);
  });
});
