import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Index from "@/pages/Index";

const renderHome = () => render(
  <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Index />
  </MemoryRouter>,
);

describe("homepage", () => {
  it("uses an outcome-focused semantic heading without an unverified client count", () => {
    renderHome();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Scaling with precision");
    expect(screen.queryByText(/100\+ clients advised/i)).not.toBeInTheDocument();
    expect(screen.getByText("Selected experience")).toBeInTheDocument();
  });

  it("reveals optional qualification fields on request", () => {
    renderHome();

    expect(screen.queryByText("Company size")).not.toBeInTheDocument();
    const detailsButton = screen.getByRole("button", { name: "Add optional company context" });
    fireEvent.click(detailsButton);

    expect(detailsButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Company size")).toBeInTheDocument();
    expect(screen.getByText("Current CS tooling")).toBeInTheDocument();
  });

  it("exposes and closes the mobile navigation accessibly", () => {
    renderHome();

    const openButton = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(openButton);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog", { name: "Site navigation" })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Site navigation" })).not.toBeInTheDocument();
  });
});
