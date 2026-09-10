import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  applyPageMetadataToHtml,
  canonicalUrl,
  pageMetadata,
  renderPageMetadataHtml,
  setPageMetadata,
  type PageMetadata,
} from "./metadata";

const indexHtml = readFileSync(resolve("index.html"), "utf8");
const originalHead = document.head.innerHTML;
const parseHtml = (html: string) => new DOMParser().parseFromString(html, "text/html");
const metaContent = (page: Document, key: string, attribute = "name") =>
  page.head.querySelector(`meta[${attribute}="${key}"]`)?.getAttribute("content");

function expectMetadata(page: Document, metadata: PageMetadata) {
  const socialTitle = metadata.socialTitle ?? metadata.title;
  const url = canonicalUrl(metadata.path);
  expect(page.title).toBe(metadata.title);
  expect(metaContent(page, "description")).toBe(metadata.description);
  expect(metaContent(page, "robots")).toBe(metadata.noIndex ? "noindex, follow" : "index, follow");
  expect(page.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(url);
  expect(metaContent(page, "og:title", "property")).toBe(socialTitle);
  expect(metaContent(page, "twitter:title")).toBe(socialTitle);
  expect(metaContent(page, "og:description", "property")).toBe(metadata.description);
  expect(metaContent(page, "twitter:description")).toBe(metadata.description);
  expect(metaContent(page, "og:url", "property")).toBe(url);
  expect(metaContent(page, "twitter:url")).toBe(url);
  expect(metaContent(page, "og:image", "property")).toBe(
    "https://florianbeermann.com/social-preview.jpg",
  );
  expect(metaContent(page, "twitter:image")).toBe(metaContent(page, "og:image", "property"));
  expect(metaContent(page, "og:image:type", "property")).toBe("image/jpeg");
  expect(metaContent(page, "og:image:width", "property")).toBe("1200");
  expect(metaContent(page, "og:image:height", "property")).toBe("630");
  expect(metaContent(page, "og:image:alt", "property")).toBe(
    "Florian Beermann & Co. with a portrait of Florian Beermann. Your customers have changed. Your approach should too.",
  );
  expect(metaContent(page, "twitter:image:alt")).toBe(
    metaContent(page, "og:image:alt", "property"),
  );
  expect(metaContent(page, "og:type", "property")).toBe("website");
  expect(metaContent(page, "og:site_name", "property")).toBe("Florian Beermann & Co.");
  expect(metaContent(page, "og:locale", "property")).toBe("en_GB");
  expect(metaContent(page, "twitter:card")).toBe("summary_large_image");
}

beforeEach(() => {
  document.head.innerHTML = "";
});

afterEach(() => {
  document.head.innerHTML = originalHead;
});

describe("page metadata", () => {
  it("does not run the retired introductory session-storage script", () => {
    expect(indexHtml).not.toContain("fb-intro");
    expect(indexHtml).not.toContain("intro-done");
  });

  it("uses the approved homepage search description, title and sharing headline", () => {
    expect(pageMetadata.home).toEqual({
      title: "Florian Beermann & Co.",
      description:
        "Customer Success consulting for software companies serving different business customers. Strategy, practical customer processes and team training.",
      path: "/",
      socialTitle: "Your customers have changed. Your approach should too.",
    });
    expectMetadata(parseHtml(indexHtml), pageMetadata.home);
    expect(applyPageMetadataToHtml(indexHtml, pageMetadata.home)).toBe(indexHtml);
  });

  it("keeps the initial homepage and runtime metadata identical", () => {
    const initial = parseHtml(indexHtml);
    document.head.innerHTML = initial.head.innerHTML;
    const before = document.head.innerHTML;
    setPageMetadata(pageMetadata.home);
    expectMetadata(document, pageMetadata.home);
    expect(document.head.innerHTML).toBe(before);
  });

  it("updates all metadata between routes and restores indexing after a missing page", () => {
    for (const metadata of [
      pageMetadata.home,
      pageMetadata.imprint,
      pageMetadata.privacy,
      { ...pageMetadata.notFound, path: "/missing/?ref=share#details" },
      pageMetadata.imprint,
      { ...pageMetadata.notFound, path: "/another-missing-page" },
      pageMetadata.home,
    ]) {
      setPageMetadata(metadata);
      expectMetadata(document, metadata);
    }
  });

  it("preserves the original title, description and path function contract", () => {
    setPageMetadata({ ...pageMetadata.notFound, path: "/missing" });
    const metadata = {
      title: "A page title",
      description: "A page description.",
      path: "/example/",
    };
    setPageMetadata(metadata);
    expectMetadata(document, metadata);
  });

  it("uses page-specific legal and missing-page sharing titles", () => {
    expect(pageMetadata.imprint.title).toBe("Legal notice | Florian Beermann & Co.");
    expect(pageMetadata.imprint.path).toBe("/imprint");
    expect(pageMetadata.imprint.description).not.toContain("..");
    for (const metadata of [pageMetadata.imprint, pageMetadata.privacy, pageMetadata.notFound]) {
      setPageMetadata(metadata);
      expect(metaContent(document, "og:title", "property")).toBe(metadata.title);
      expect(metaContent(document, "twitter:title")).not.toBe(pageMetadata.home.socialTitle);
    }
  });

  it("removes duplicate managed elements without changing unrelated head content", () => {
    document.head.innerHTML = `
      <title>Old title</title><title>Duplicate title</title>
      <meta name="description" content="Old description">
      <meta name="description" content="Duplicate description">
      <meta property="og:title" content="Old share title">
      <meta property="og:title" content="Duplicate share title">
      <meta name="robots" content="noindex">
      <meta name="robots" content="noindex, nofollow">
      <link rel="canonical" href="https://example.com">
      <link rel="canonical" href="https://example.com/duplicate">
      <meta name="theme-color" content="#181D26">
    `;
    setPageMetadata(pageMetadata.privacy);
    setPageMetadata(pageMetadata.home);
    expectMetadata(document, pageMetadata.home);
    for (const selector of [
      "title",
      'meta[name="description"]',
      'meta[property="og:title"]',
      'meta[name="robots"]',
      'link[rel="canonical"]',
    ]) {
      expect(document.head.querySelectorAll(selector)).toHaveLength(1);
    }
    expect(metaContent(document, "theme-color")).toBe("#181D26");
  });
});

describe("canonical addresses", () => {
  it.each([
    ["", "/"],
    ["/", "/"],
    ["?campaign=launch#contact", "/"],
    ["#about", "/"],
    ["/imprint/", "/imprint"],
    ["privacy/", "/privacy"],
    ["/privacy/?ref=share#your-rights", "/privacy"],
    ["/missing//page///", "/missing/page"],
    ["/old/../privacy", "/privacy"],
    ["/a path/", "/a%20path"],
    ["/caf\u00e9/", "/caf%C3%A9"],
    ["https://florianbeermann.com:443/privacy/?ref=share#rights", "/privacy"],
    ["https://example.com/privacy", "/"],
    ["//example.com/imprint", "/"],
    ["https://florianbeermann.com.example.com/privacy", "/"],
    ["https://someone:example@florianbeermann.com/privacy", "/"],
    ["javascript:alert(1)", "/"],
    ["https://[invalid", "/"],
  ])("normalizes trusted paths and rejects invalid addresses: %j", (path, expectedPath) => {
    const homeAliases = ["", "/", "?campaign=launch#contact", "#about"];
    if (expectedPath === "/" && !homeAliases.includes(path)) {
      expect(() => canonicalUrl(path)).toThrow(TypeError);
    } else {
      expect(canonicalUrl(path)).toBe(`https://florianbeermann.com${expectedPath}`);
    }
  });
});

describe("initial HTML metadata", () => {
  it.each(Object.entries(pageMetadata))("renders matching initial metadata for %s", (_name, metadata) => {
    const html = applyPageMetadataToHtml(indexHtml, metadata);
    const page = parseHtml(html);
    expectMetadata(page, metadata);
    expect(page.body.innerHTML).toBe(parseHtml(indexHtml).body.innerHTML);
    expect(page.querySelector('script[type="application/ld+json"]')?.textContent).toBe(
      parseHtml(indexHtml).querySelector('script[type="application/ld+json"]')?.textContent,
    );
    document.head.innerHTML = page.head.innerHTML;
    const before = document.head.innerHTML;
    setPageMetadata(metadata);
    expect(document.head.innerHTML).toBe(before);
  });

  it("escapes text and attributes while preserving their runtime values", () => {
    const metadata = {
      title: '</title><script>alert("title")</script> & a title',
      description: '"><img src=x onerror="alert(1)"> & \'quoted\' content',
      socialTitle: '"Sharing" & <headlines>',
      path: "/a 'quoted' path/?query=discarded#fragment",
    };
    const rendered = renderPageMetadataHtml(metadata);
    expect(rendered).toContain("&lt;/title&gt;");
    expect(rendered).toContain("&quot;");
    expect(rendered).toContain("&#39;");
    expect(rendered).toContain("&amp;");
    const page = parseHtml(`<!doctype html><html><head>${rendered}</head><body></body></html>`);
    expectMetadata(page, metadata);
    expect(page.querySelector("script, img")).toBeNull();
    setPageMetadata(metadata);
    expectMetadata(document, metadata);
    expect(document.head.querySelector("script, img")).toBeNull();
  });

  it("only replaces the explicitly marked metadata block", () => {
    const sentinel = '<meta name="unrelated" content="Keep &amp; preserve"><!-- untouched -->';
    const template = indexHtml.replace("</head>", `${sentinel}</head>`);
    const updated = applyPageMetadataToHtml(template, pageMetadata.privacy);
    const start = template.indexOf("<!-- page-metadata:start -->");
    const end = template.indexOf("<!-- page-metadata:end -->");
    expect(updated.slice(0, start)).toBe(template.slice(0, start));
    expect(updated.slice(updated.indexOf("<!-- page-metadata:end -->"))).toBe(template.slice(end));
    expect(updated).toContain(sentinel);
    expect(applyPageMetadataToHtml(updated, pageMetadata.home)).toBe(template);
  });

  it.each([
    "",
    "<!-- page-metadata:start -->",
    "<!-- page-metadata:end -->",
    "<!-- page-metadata:end --><!-- page-metadata:start -->",
    "<!-- page-metadata:start --><!-- page-metadata:start --><!-- page-metadata:end -->",
    "<!-- page-metadata:start --><!-- page-metadata:end --><!-- page-metadata:end -->",
  ])("rejects a missing or ambiguous metadata block: %j", (html) => {
    expect(() => applyPageMetadataToHtml(html, pageMetadata.home)).toThrow(
      "Expected exactly one ordered page metadata block",
    );
  });
});

describe("public metadata copy", () => {
  const acronyms = /\b(?:B2B|B2C|SaaS|CS|CSMs?|QBRs?|EBRs?|GDPR|DDG|MStV|IP|CRM|ROI)\b/;
  const narrowPositioning = /\b(?:larger business customers|larger customers|upmarket|up-market)\b/i;

  function expectPlainCopy(text: string) {
    expect(text).not.toMatch(acronyms);
    expect(text).not.toContain("\u2014");
    expect(text).not.toMatch(narrowPositioning);
  }

  it("uses full terms and no em dashes in public search and sharing text", () => {
    for (const metadata of Object.values(pageMetadata)) {
      const page = parseHtml(applyPageMetadataToHtml(indexHtml, metadata));
      expectPlainCopy(
        [
          page.title,
          metaContent(page, "description"),
          metaContent(page, "og:site_name", "property"),
          metaContent(page, "og:title", "property"),
          metaContent(page, "og:description", "property"),
          metaContent(page, "og:image:alt", "property"),
          metaContent(page, "twitter:title"),
          metaContent(page, "twitter:description"),
          metaContent(page, "twitter:image:alt"),
        ].join(" "),
      );
    }
  });

  it("uses the approved services and description in structured readable data", () => {
    const page = parseHtml(indexHtml);
    const data = JSON.parse(page.querySelector('script[type="application/ld+json"]')!.textContent!);
    expect(data.description).toBe(pageMetadata.home.description);
    expect(data.serviceType).toEqual([
      "Customer Success strategy",
      "Customer lifecycle processes",
      "Customer Success team training",
    ]);
    expectPlainCopy(
      [data.name, data.description, data.founder.name, data.founder.jobTitle, ...data.serviceType].join(
        " ",
      ),
    );
    expect(data["@type"]).toBe("ProfessionalService");
    expect(data.address.addressCountry).toBe("DE");
  });

  it("keeps the social-card copy and preserved brand assets aligned", () => {
    const source = readFileSync(resolve("scripts/social-card.html"), "utf8");
    const page = parseHtml(source);
    expect(page.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      pageMetadata.home.socialTitle,
    );
    expect(page.querySelector(".lockup br")).not.toBeNull();
    expect(page.querySelector(".plate img")?.getAttribute("src")).toBe("/portrait.jpg");
    expect(page.querySelector(".caption")).toBeNull();
    expect(page.body.textContent).not.toContain("Fig. 01");
    expectPlainCopy(page.body.textContent ?? "");
  });
});
