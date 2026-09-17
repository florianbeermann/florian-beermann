import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const originalScrollY = Object.getOwnPropertyDescriptor(window, "scrollY")!;
const originalScrollIntoView = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollIntoView");
let scrolledElements: Element[] = [];

beforeEach(() => {
  window.history.replaceState({ idx: 0 }, "", "/");
  scrolledElements = [];
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: function (this: HTMLElement) { scrolledElements.push(this); },
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  Object.defineProperty(window, "scrollY", originalScrollY);
  if (originalScrollIntoView) {
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", originalScrollIntoView);
  } else {
    Reflect.deleteProperty(HTMLElement.prototype, "scrollIntoView");
  }
  window.history.replaceState({ idx: 0 }, "", "/");
});

function recordScroll(top: number) {
  const section = document.querySelector<HTMLElement>(".section-screen:not([hidden])")!;
  section.scrollTop = top;
  fireEvent.scroll(section);
}

function nativeFragment(id: string) {
  act(() => {
    window.history.pushState(null, "", `/#${id}`);
    window.dispatchEvent(new PopStateEvent("popstate", { state: null }));
  });
}

describe("page and fragment navigation", () => {
  it("honours native contact links by selecting the Contact screen", () => {
    render(<App />);
    recordScroll(400);
    nativeFragment("contact");
    expect(document.documentElement).toHaveAttribute("data-active-screen", "contact");
    expect(document.querySelector('.section-screen[data-screen="contact"]')).not.toHaveAttribute("hidden");
  });

  it("honours a repeated section link even when that fragment has a saved position", () => {
    render(<App />);
    nativeFragment("about");
    recordScroll(1800);
    nativeFragment("contact");
    recordScroll(2400);
    nativeFragment("about");
    expect(document.documentElement).toHaveAttribute("data-active-screen", "about");
    expect(document.querySelector<HTMLElement>('.section-screen[data-screen="about"]')?.scrollTop).toBe(1800);
  });

  it("replaces legacy fragments without adding an extra history entry", () => {
    render(<App />);
    const initialLength = window.history.length;
    nativeFragment("florian");
    expect(document.documentElement).toHaveAttribute("data-active-screen", "expertise");
    expect(window.location.hash).toBe("#expertise");
    expect(window.history.length).toBe(initialLength + 1);
  });

  it("preserves the reading position when a restored bookmark is canonicalised", () => {
    render(<App />);
    nativeFragment("expertise");
    recordScroll(900);
    nativeFragment("contact");
    nativeFragment("florian");
    expect(window.location.hash).toBe("#expertise");
    expect(document.querySelector<HTMLElement>('.section-screen[data-screen="expertise"]')?.scrollTop).toBe(900);
  });

  it("restores the enquiry position when returning from the privacy policy", async () => {
    render(<App />);
    nativeFragment("contact");
    const enquiry = document.querySelector<HTMLDetailsElement>(".enquiry")!;
    fireEvent.click(enquiry.querySelector("summary")!);
    fireEvent(enquiry, new Event("toggle"));
    recordScroll(2400);
    fireEvent.click(screen.getByRole("link", { name: "Read the privacy policy" }));
    expect(screen.getByRole("heading", { name: "Privacy policy", level: 1 })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Return to your enquiry" }));
    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-active-screen", "contact");
      expect(document.querySelector<HTMLElement>('.section-screen[data-screen="contact"]')?.scrollTop).toBe(2400);
    });
  });
});
