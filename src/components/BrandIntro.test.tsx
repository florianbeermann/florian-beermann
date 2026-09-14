import { StrictMode } from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GradientBackgroundElement } from "@/lib/gradient-background";
import { BrandIntro } from "./BrandIntro";

afterEach(() => vi.restoreAllMocks());

describe("brand intro", () => {
  it("registers its renderer at runtime, retains the shared logo and offers a static fallback", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<StrictMode><BrandIntro /></StrictMode>);
    const background = document.getElementById("intro-background")!;
    expect(background).toBeInstanceOf(GradientBackgroundElement);
    expect(background).toHaveAttribute("aria-hidden", "true");
    expect(background.shadowRoot?.querySelectorAll(".column")).toHaveLength(5);
    expect(background).not.toHaveAttribute("data-renderer-ready");
    expect(screen.getByRole("link", { name: "Scroll to content" })).toHaveAttribute("href", "#top");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    const name = document.querySelector(".brand-intro-wordmark .wordmark-name")!;
    expect(name).toHaveTextContent(/Florian Beermann.*& Co\./);
    expect(name.querySelectorAll("br")).toHaveLength(1);
    expect(document.querySelector(".brand-intro-wordmark .wordmark-mark")).toBeInTheDocument();
  });

  it("offers only a labelled icon link, without the old text buttons", () => {
    render(<BrandIntro />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
    const cue = screen.getByRole("link", { name: "Scroll to content" });
    expect(cue.textContent).toBe("");
    expect(cue.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByText("Continue")).not.toBeInTheDocument();
    expect(screen.queryByText("Pause animation")).not.toBeInTheDocument();
  });

  it("disconnects the element and releases its canvas on unmount", () => {
    const { unmount } = render(<BrandIntro />);
    const background = document.getElementById("intro-background") as GradientBackgroundElement;
    unmount();
    expect(background.motionState).toEqual({ playing: false, reason: "disconnected" });
    expect(background.shadowRoot?.querySelector("canvas")?.width).toBe(1);
  });
});
