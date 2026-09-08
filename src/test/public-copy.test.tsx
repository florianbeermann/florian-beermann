import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { EnquiryProvider } from "@/components/EnquiryProvider";
import Home from "@/pages/Home";
import Imprint from "@/pages/Imprint";
import Privacy from "@/pages/Privacy";
import NotFound from "@/pages/NotFound";

const acronyms = /\b(?:B2B|SaaS|CS|CSMs?|QBRs?|EBRs?|GDPR|DDG|MStV|IP)\b/;
const narrowPositioning = /\b(?:larger business customers|larger customers|upmarket|up-market)\b/i;

function expectPlainCopy(container: HTMLElement) {
  const text = [
    container.textContent,
    ...[...container.querySelectorAll("[alt], [aria-label], [placeholder], [title]")].flatMap(
      (element) => ["alt", "aria-label", "placeholder", "title"].map((name) => element.getAttribute(name)),
    ),
  ].filter(Boolean).join(" ");
  expect(text).not.toMatch(acronyms);
  expect(text).not.toContain("\u2014");
  expect(text).not.toMatch(narrowPositioning);
}

describe("public copy preferences", () => {
  for (const [name, Page] of [
    ["home", Home],
    ["legal notice", Imprint],
    ["privacy", Privacy],
    ["missing page", NotFound],
  ] as const) {
    it(`uses full terms and no em dashes on the ${name} page`, () => {
      const { container } = render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <EnquiryProvider><Page /></EnquiryProvider>
        </MemoryRouter>,
      );
      expectPlainCopy(container);
      if (name === "home") {
        fireEvent.click(screen.getByRole("button", { name: "Add company details (optional)" }));
        expectPlainCopy(container);
      }
    });
  }

  it("keeps the private preview copy free of acronyms and em dashes", () => {
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
    const source = readFileSync(path.join(root, "public/login.php"), "utf8");
    const body = source.slice(source.indexOf("<body"));
    const text = body.replace(/<\?[\s\S]*?\?>|<!--[\s\S]*?-->|<[^>]*>/g, " ");
    expect(text).not.toMatch(acronyms);
    expect(text).not.toContain("\u2014");
    expect(text).not.toMatch(narrowPositioning);
  });
});
