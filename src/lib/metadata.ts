/// <reference lib="dom" />

export interface PageMetadata {
  title: string;
  description: string;
  path: string;
  socialTitle?: string;
  noIndex?: boolean;
}

export const pageMetadata = {
  home: {
    title: "Florian Beermann & Co.",
    description:
      "Customer Success consulting for software companies serving different business customers. Strategy, practical customer processes and team training.",
    path: "/",
    socialTitle: "Your customers have changed. Your approach should too.",
  },
  imprint: {
    title: "Legal notice | Florian Beermann & Co.",
    description:
      "Legal notice and company information for Florian Beermann & Co., Customer Success consulting in Hamburg, Germany.",
    path: "/imprint",
  },
  privacy: {
    title: "Privacy policy | Florian Beermann & Co.",
    description:
      "How Florian Beermann & Co. handles personal data, which information this website collects and how to exercise your rights.",
    path: "/privacy",
  },
  notFound: {
    title: "Page not found | Florian Beermann & Co.",
    description:
      "This page could not be found. Return to the homepage to explore Customer Success consulting from Florian Beermann & Co.",
    path: "/",
    noIndex: true,
  },
} as const satisfies Record<"home" | "imprint" | "privacy" | "notFound", PageMetadata>;

const siteOrigin = "https://florianbeermann.com";
const siteName = "Florian Beermann & Co.";
const socialImage = `${siteOrigin}/social-preview.jpg`;
const socialImageDescription =
  "Florian Beermann & Co. with a portrait of Florian Beermann. Your customers have changed. Your approach should too.";

export function canonicalUrl(path: string): string {
  const url = new URL(path, `${siteOrigin}/`);
  if (url.origin !== siteOrigin || url.username || url.password) {
    throw new TypeError("Canonical metadata must use this site's origin without credentials.");
  }
  const pathname = url.pathname.replace(/\/{2,}/g, "/").replace(/\/+$/, "") || "/";
  return `${siteOrigin}${pathname}`;
}

type MetaTag = readonly [attribute: "name" | "property", key: string, content: string];

function resolveMetadata({
  title,
  description,
  path,
  socialTitle = title,
  noIndex = false,
}: PageMetadata) {
  const url = canonicalUrl(path);
  const tags: MetaTag[] = [
    ["name", "description", description],
    ["name", "robots", noIndex ? "noindex, follow" : "index, follow"],
    ["property", "og:type", "website"],
    ["property", "og:site_name", siteName],
    ["property", "og:locale", "en_GB"],
    ["property", "og:title", socialTitle],
    ["property", "og:description", description],
    ["property", "og:url", url],
    ["property", "og:image", socialImage],
    ["property", "og:image:type", "image/jpeg"],
    ["property", "og:image:width", "1200"],
    ["property", "og:image:height", "630"],
    ["property", "og:image:alt", socialImageDescription],
    ["name", "twitter:card", "summary_large_image"],
    ["name", "twitter:title", socialTitle],
    ["name", "twitter:description", description],
    ["name", "twitter:url", url],
    ["name", "twitter:image", socialImage],
    ["name", "twitter:image:alt", socialImageDescription],
  ];
  return { title, url, tags };
}

function headElement<Tag extends keyof HTMLElementTagNameMap>(tag: Tag, selector: string) {
  const [existing, ...duplicates] = Array.from(
    document.head.querySelectorAll<HTMLElementTagNameMap[Tag]>(selector),
  );
  duplicates.forEach((element) => element.remove());
  if (existing) return existing;
  return document.head.appendChild(document.createElement(tag));
}

export function setPageMetadata(metadata: PageMetadata): void {
  const { title, url, tags } = resolveMetadata(metadata);
  headElement("title", "title").textContent = title;

  const canonical = headElement("link", 'link[rel="canonical"]');
  canonical.rel = "canonical";
  canonical.href = url;

  for (const [attribute, key, content] of tags) {
    const meta = headElement("meta", `meta[${attribute}="${key}"]`);
    meta.setAttribute(attribute, key);
    meta.content = content;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderPageMetadataHtml(metadata: PageMetadata): string {
  const { title, url, tags } = resolveMetadata(metadata);
  return [
    `<title>${escapeHtml(title)}</title>`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    ...tags.map(
      ([attribute, key, content]) =>
        `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`,
    ),
  ].join("\n    ");
}

export function applyPageMetadataToHtml(html: string, metadata: PageMetadata): string {
  // An explicit block preserves unrelated markup and fails the build if the template drifts.
  const startMarker = "<!-- page-metadata:start -->";
  const endMarker = "<!-- page-metadata:end -->";
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker);
  if (
    start === -1 ||
    end < start + startMarker.length ||
    html.indexOf(startMarker, start + startMarker.length) !== -1 ||
    html.indexOf(endMarker, end + endMarker.length) !== -1
  ) {
    throw new Error("Expected exactly one ordered page metadata block in the HTML template.");
  }
  return (
    html.slice(0, start + startMarker.length) +
    `\n    ${renderPageMetadataHtml(metadata)}\n    ` +
    html.slice(end)
  );
}
