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
  it("retains the complete two-line wordmark and a clearly named home link", () => {
    render(<Masthead />);
    const home = screen.getByRole("link", { name: "Florian Beermann, home" });
    const name = home.querySelector(".wordmark-name");

    expect(home).toHaveAttribute("href", "#top");
    expect(name).toHaveTextContent(/Florian Beermann.*& Co\./);
    expect(name?.querySelectorAll("br")).toHaveLength(1);
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

  it("adapts to paper, blue and dark sections without retracting the brand", () => {
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
        <Masthead />
        <main>
          <section id="top" style={{ backgroundColor: "rgb(24, 29, 38)" }} />
          <section
            id="engagements"
            style={{
              backgroundColor: "rgb(241, 242, 243)",
              "--marker": "rgb(0, 71, 255)",
            } as CSSProperties}
          />
          <section id="method" style={{ backgroundColor: "rgb(0, 71, 255)" }} />
          <section id="transparent" style={{ backgroundColor: "transparent" }} />
        </main>
      </div>,
    );
    const banner = screen.getByRole("banner");
    const reportSection = (id: string, isIntersecting = true) => {
      act(() => report(
        [{ target: container.querySelector(`#${id}`)!, isIntersecting }] as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      ));
    };

    expect(observe).toHaveBeenCalledTimes(4);
    reportSection("engagements");
    expect(banner).toHaveAttribute("data-ground", "light");
    expect(banner.style.getPropertyValue("--mark-color")).toBe("rgb(0, 71, 255)");
    reportSection("method", false);
    expect(banner).toHaveAttribute("data-ground", "light");
    reportSection("method");
    expect(banner).toHaveAttribute("data-ground", "deep");
    reportSection("transparent");
    expect(banner).toHaveAttribute("data-ground", "deep");
    reportSection("top");
    expect(banner).toHaveAttribute("data-ground", "dark");
    expect(banner.querySelector(".wordmark-name")).toBeVisible();
    expect(banner).not.toHaveAttribute("data-over-hero");

    unmount();
    expect(disconnect).toHaveBeenCalledOnce();
  });

  it("still provides navigation when intersection observation is unavailable", () => {
    setObserver(undefined);
    render(<Masthead />);
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", "#engagements");
    expect(screen.getByRole("link", { name: "Florian Beermann, home" })).toBeVisible();
  });
});
