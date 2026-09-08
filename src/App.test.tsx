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
  Object.defineProperty(window, "scrollY", { configurable: true, value: top });
  fireEvent.scroll(window);
}

function nativeFragment(id: string) {
  act(() => {
    window.history.pushState(null, "", `/#${id}`);
    window.dispatchEvent(new PopStateEvent("popstate", { state: null }));
  });
}

describe("page and fragment navigation", () => {
  it("honours native contact links rather than restoring the previous scroll position", () => {
    render(<App />);
    recordScroll(400);
    nativeFragment("contact");
    expect(scrolledElements.at(-1)).toBe(document.getElementById("contact"));
  });

  it("honours a repeated section link even when that fragment has a saved position", () => {
    render(<App />);
    nativeFragment("about");
    recordScroll(1800);
    nativeFragment("contact");
    recordScroll(2400);
    nativeFragment("about");
    expect(scrolledElements.at(-1)).toBe(document.getElementById("about"));
  });

  it("restores the enquiry position when returning from the privacy policy", async () => {
    render(<App />);
    nativeFragment("contact");
    recordScroll(2400);
    fireEvent.click(screen.getByRole("link", { name: "Read the privacy policy" }));
    expect(screen.getByRole("heading", { name: "Privacy policy", level: 1 })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Return to your enquiry" }));
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "What needs to change?" })).toBeInTheDocument();
      expect(window.scrollTo).toHaveBeenLastCalledWith({
        left: 0,
        top: 2400,
        behavior: "instant",
      });
    });
  });
});
