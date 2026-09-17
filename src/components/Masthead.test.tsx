import { type CSSProperties } from "react";
import { act, cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Masthead } from "./Masthead";

const originalObserver = globalThis.IntersectionObserver;
const originalWindowObserver = window.IntersectionObserver;

const setObserver = (value: unknown) => {
  Object.defineProperty(globalThis, "IntersectionObserver", { value });
  Object.defineProperty(window, "IntersectionObserver", { value });
};

afterEach(() => {
  cleanup();
  Object.defineProperty(globalThis, "IntersectionObserver", { value: originalObserver });
  Object.defineProperty(window, "IntersectionObserver", { value: originalWindowObserver });
  vi.restoreAllMocks();
});

describe("masthead", () => {
  it("uses a horizontal BEERMANN logo below the intro with the full company home link", () => {
    render(<Masthead />);
    const home = screen.getByRole("link", { name: "Beermann & Company, home" });
    const name = home.querySelector(".wordmark-name");

    expect(home).toHaveAttribute("href", "#intro");
    expect(name).toHaveTextContent(/^BEERMANN$/);
    expect(name?.querySelectorAll("br")).toHaveLength(0);
    expect(home.querySelector(".wordmark")).toHaveAttribute("data-layout", "horizontal");
    expect(home.querySelector(".wordmark-mark")).toBeInTheDocument();
    expect(home).not.toHaveAccessibleName(/—/);
  });

  it("uses Services and About navigation with one concise primary contact action", () => {
    render(<Masthead />);
    const banner = screen.getByRole("banner");
    const navigation = within(banner).getByRole("navigation", { name: "Primary navigation" });
    expect(within(navigation).getByRole("list")).toBeInTheDocument();
    expect(within(navigation).getAllByRole("link")).toHaveLength(2);
    expect(within(navigation).getByRole("link", { name: "Services" })).toHaveAttribute("href", "#engagements");
    expect(within(navigation).getByRole("link", { name: "About" })).toHaveAttribute("href", "#about");
    expect(within(banner).getByRole("link", { name: "Get in touch" })).toHaveAttribute("href", "#contact");
    expect(within(banner).queryByText("Work")).not.toBeInTheDocument();
    expect(within(banner).queryByText("Start a conversation")).not.toBeInTheDocument();
  });

  it("stays hidden over the intro and restores navigation over the content grounds", () => {
    let report!: IntersectionObserverCallback;
    const observe = vi.fn();
    const disconnect = vi.fn();
    setObserver(class {
      constructor(callback: IntersectionObserverCallback) {
        report = callback;
      }
      observe = observe;
      disconnect = disconnect;
    });

    const { container, unmount } = render(
      <div className="site-page">
        <Masthead hideOnIntro />
        <main>
          <section id="intro" data-masthead-ground="intro" style={{ backgroundColor: "rgb(48, 92, 222)" }} />
          <section id="top" style={{ backgroundColor: "rgb(24, 29, 38)" }} />
          <section
            id="engagements"
            style={{
              backgroundColor: "rgb(241, 242, 243)",
              "--marker": "rgb(48, 92, 222)",
            } as CSSProperties}
          />
          <section id="method" style={{ backgroundColor: "rgb(48, 92, 222)" }} />
          <section id="transparent" style={{ backgroundColor: "transparent" }} />
        </main>
      </div>,
    );
    const banner = screen.getByRole("banner", { hidden: true });
    const reportSection = (id: string, isIntersecting = true) => {
      act(() => report(
        [{ target: container.querySelector(`#${id}`)!, isIntersecting }] as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      ));
    };

    expect(observe).toHaveBeenCalledTimes(5);
    expect(banner).toHaveAttribute("data-intro-hidden", "true");
    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    reportSection("intro");
    expect(banner).toHaveAttribute("data-ground", "intro");
    expect(banner).toHaveAttribute("aria-hidden", "true");
    reportSection("engagements");
    expect(banner).toHaveAttribute("data-ground", "light");
    expect(banner).not.toHaveAttribute("aria-hidden");
    expect(banner).not.toHaveAttribute("data-intro-hidden");
    expect(screen.getByRole("link", { name: "Services" })).toBeInTheDocument();
    expect(banner.style.getPropertyValue("--mark-color")).toBe("rgb(48, 92, 222)");
    expect(banner.querySelector(".wordmark")).toHaveAttribute("data-layout", "horizontal");
    reportSection("method", false);
    expect(banner).toHaveAttribute("data-ground", "light");
    reportSection("method");
    expect(banner).toHaveAttribute("data-ground", "deep");
    expect(banner.querySelector(".wordmark")).toHaveAttribute("data-layout", "horizontal");
    reportSection("transparent");
    expect(banner).toHaveAttribute("data-ground", "deep");
    reportSection("top");
    expect(banner).toHaveAttribute("data-ground", "dark");
    expect(banner.querySelector(".wordmark-name")).toBeVisible();
    expect(banner.querySelector(".wordmark")).toHaveAttribute("data-layout", "horizontal");
    expect(banner).not.toHaveAttribute("data-over-hero");
    reportSection("intro");
    expect(banner).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("button", { name: "Open menu" })).not.toBeInTheDocument();

    unmount();
    expect(disconnect).toHaveBeenCalledOnce();
  });

  it("still provides navigation when intersection observation is unavailable", () => {
    setObserver(undefined);
    render(<Masthead hideOnIntro />);
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", "#engagements");
    expect(screen.getByRole("link", { name: "Beermann & Company, home" })).toBeVisible();
  });
});
