import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import NotFound from "@/pages/NotFound";

const renderNotFound = () =>
  render(
    <MemoryRouter
      initialEntries={["/does-not-exist"]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <NotFound />
    </MemoryRouter>,
  );

describe("404 page", () => {
  it("explains the error in the site shell and offers a way back", () => {
    renderNotFound();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Page not found",
    );
    expect(screen.getByText("Error 404")).toBeInTheDocument();

    const suggestions = screen.getByRole("navigation", {
      name: "Suggested pages",
    });
    expect(suggestions).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to homepage" }),
    ).toHaveAttribute("href", "/");
    expect(
      screen.getByRole("link", { name: "Email me directly" }),
    ).toHaveAttribute("href", "mailto:hello@florianbeermann.com");
  });

  it("sets its own page title instead of inheriting the previous one", () => {
    renderNotFound();

    expect(document.title).toBe(
      "Page not found | Florian Beermann & Co.",
    );
  });
});
