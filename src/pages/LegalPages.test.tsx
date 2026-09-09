import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Imprint from "@/pages/Imprint";
import Privacy from "@/pages/Privacy";

const renderPage = (path: string, page: React.ReactNode) =>
  render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      {page}
    </MemoryRouter>,
  );

describe("legal pages", () => {
  it("presents the legal notice in the editorial site shell", () => {
    renderPage("/imprint", <Imprint />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Legal notice" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "hello@florianbeermann.com" }),
    ).toHaveAttribute("href", "mailto:hello@florianbeermann.com");
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute(
      "href",
      "/#engagements",
    );
    expect(screen.getByRole("link", { name: "Legal notice" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("preserves the Privacy Policy content and external references", () => {
    renderPage("/privacy", <Privacy />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Privacy policy" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Last updated: 7 September 2026")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Hetzner privacy policy" }),
    ).toHaveAttribute(
      "href",
      "https://www.hetzner.com/legal/privacy-policy",
    );
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
