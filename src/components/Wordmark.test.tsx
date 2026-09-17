import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Wordmark } from "./Wordmark";

describe("wordmark", () => {
  it("defaults to the horizontal surname logo with the full company accessible name", () => {
    render(<Wordmark className="site-closing-wordmark" />);
    const logo = screen.getByRole("img", { name: "Beermann & Company" });
    expect(logo).toHaveClass("wordmark", "site-closing-wordmark");
    expect(logo).toHaveAttribute("data-layout", "horizontal");
    expect(logo).toHaveTextContent(/^BEERMANN$/);
    expect(logo.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(logo.querySelector("svg")).toHaveAttribute("viewBox", "115.9 379 1021.1 524");
    expect(logo.querySelector(".wordmark-name")).toHaveAttribute("aria-hidden", "true");
  });

  it("changes layout without replacing or hiding the anvil or surname", () => {
    const { rerender } = render(<Wordmark layout="stacked" />);
    const logo = screen.getByRole("img", { name: "Beermann & Company" });
    const anvil = logo.querySelector("svg");
    const name = logo.querySelector(".wordmark-name");
    expect(logo).toHaveAttribute("data-layout", "stacked");
    rerender(<Wordmark layout="horizontal" />);
    expect(logo).toHaveAttribute("data-layout", "horizontal");
    expect(logo.querySelector("svg")).toBe(anvil);
    expect(logo.querySelector(".wordmark-name")).toBe(name);
    expect(name).toBeVisible();
  });
});
