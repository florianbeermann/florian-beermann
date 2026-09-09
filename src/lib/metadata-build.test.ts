import { build } from "vite";
import { beforeAll, describe, expect, it } from "vitest";
import { routeMetadataPlugin } from "../../vite.config";
import { canonicalUrl, pageMetadata, setPageMetadata } from "./metadata";

describe("route metadata build output", () => {
  const pages = new Map<string, string>();

  beforeAll(async () => {
    const result = await build({
      configFile: false,
      root: process.cwd(),
      logLevel: "silent",
      plugins: [
        {
          name: "metadata-test-shell",
          transformIndexHtml: {
            order: "pre",
            handler(html) {
              // Exercise the real HTML pipeline without building unrelated application code.
              const page = new DOMParser().parseFromString(html, "text/html");
              page.querySelector('script[src="/src/main.tsx"]')?.remove();
              page.title = "Stale homepage title";
              return `<!doctype html>${page.documentElement.outerHTML}`;
            },
          },
        },
        routeMetadataPlugin(),
      ],
      build: {
        write: false,
        copyPublicDir: false,
        emptyOutDir: false,
      },
    });
    if (Array.isArray(result) || !("output" in result)) {
      throw new Error("Expected a single in-memory build result.");
    }
    for (const output of result.output) {
      if (output.type === "asset" && output.fileName.endsWith(".html")) {
        pages.set(
          output.fileName,
          typeof output.source === "string" ? output.source : new TextDecoder().decode(output.source),
        );
      }
    }
  }, 20_000);

  it("emits the homepage and both legal routes as initial HTML", () => {
    expect([...pages.keys()].sort()).toEqual([
      "imprint/index.html",
      "index.html",
      "privacy/index.html",
    ]);
  });

  it.each([
    ["index.html", pageMetadata.home],
    ["imprint/index.html", pageMetadata.imprint],
    ["privacy/index.html", pageMetadata.privacy],
  ] as const)("emits complete metadata before scripts run in %s", (fileName, metadata) => {
    const source = pages.get(fileName);
    expect(source).toBeDefined();
    expect(source).not.toContain("fb-intro");
    expect(source).not.toContain("intro-done");
    const page = new DOMParser().parseFromString(source!, "text/html");
    expect(page.title).toBe(metadata.title);
    expect(page.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(
      metadata.description,
    );
    expect(page.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      canonicalUrl(metadata.path),
    );
    expect(page.querySelector('meta[property="og:url"]')?.getAttribute("content")).toBe(
      canonicalUrl(metadata.path),
    );
    expect(page.querySelector('meta[name="twitter:url"]')?.getAttribute("content")).toBe(
      canonicalUrl(metadata.path),
    );
    expect(page.querySelector("#root")).not.toBeNull();
    expect(page.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("index, follow");

    const previousHead = document.head.innerHTML;
    try {
      document.head.innerHTML = page.head.innerHTML;
      const initialHead = document.head.innerHTML;
      setPageMetadata(metadata);
      expect(document.head.innerHTML).toBe(initialHead);
    } finally {
      document.head.innerHTML = previousHead;
    }
  });
});
