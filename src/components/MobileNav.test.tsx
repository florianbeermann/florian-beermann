import { createRef } from "react";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MobileNav } from "./MobileNav";

const links = [
  { href: "#engagements", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

let desktop: MediaQueryList;
const originalOverflow = document.documentElement.style.overflow;

beforeEach(() => {
  desktop = Object.assign(new EventTarget(), {
    matches: false,
    media: "(min-width: 48rem)",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }) as MediaQueryList;
  vi.spyOn(window, "matchMedia").mockReturnValue(desktop);
});

afterEach(() => {
  cleanup();
  document.documentElement.style.overflow = originalOverflow;
  vi.restoreAllMocks();
});

const resizeToDesktop = (matches: boolean) => {
  act(() => {
    Object.defineProperty(desktop, "matches", { configurable: true, value: matches });
    desktop.dispatchEvent(new Event("change"));
  });
};

describe("mobile navigation disclosure", () => {
  it("keeps a valid controlled panel and hides closed links from navigation", () => {
    render(<MobileNav links={links} />);
    const button = screen.getByRole("button", { name: "Open menu" });
    const panel = document.getElementById(button.getAttribute("aria-controls")!);

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(panel).toHaveAttribute("hidden");
    expect(panel).not.toBeVisible();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("opens and closes with the same named button without moving focus", () => {
    render(<MobileNav links={links} />);
    const button = screen.getByRole("button", { name: "Open menu" });
    button.focus();
    fireEvent.click(button);

    expect(screen.getByRole("button", { name: "Close menu" })).toBe(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveFocus();
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();

    fireEvent.click(button);
    expect(button).toHaveAccessibleName("Open menu");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("presents Services, About and Contact as ordinary links in one list", () => {
    render(<MobileNav links={links} />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    const list = within(navigation).getByRole("list");

    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
    expect(within(list).getAllByRole("link")).toHaveLength(3);
    for (const link of links) {
      expect(within(list).getByRole("link", { name: link.label })).toHaveAttribute("href", link.href);
    }
    expect(within(navigation).queryByRole("button")).not.toBeInTheDocument();
    expect(within(navigation).queryByText("Get in touch")).not.toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on Escape and restores focus to the disclosure button", () => {
    render(<MobileNav links={links} />);
    const button = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(button);
    const serviceLink = screen.getByRole("link", { name: "Services" });
    serviceLink.focus();
    fireEvent.keyDown(serviceLink, { key: "Escape" });

    expect(button).toHaveFocus();
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it.each(links)("closes after activating $label", ({ label }) => {
    render(<MobileNav links={links} />);
    const button = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(button);
    fireEvent.click(screen.getByRole("link", { name: label }));

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("dismisses outside clicks without preventing the outside action", () => {
    const onClick = vi.fn();
    render(
      <>
        <MobileNav links={links} />
        <button onClick={onClick}>Page action</button>
      </>,
    );
    const button = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(button);
    fireEvent.click(screen.getByRole("list"));
    expect(button).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(screen.getByRole("button", { name: "Page action" }));
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(onClick).toHaveBeenCalledOnce();

    fireEvent.click(button);
    fireEvent.click(document.body);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("leaves scrolling and keyboard focus free, closing when focus leaves", () => {
    document.documentElement.style.overflow = "scroll";
    render(
      <>
        <MobileNav links={links} />
        <main><button>Page action</button></main>
      </>,
    );
    const button = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(button);

    expect(document.documentElement.style.overflow).toBe("scroll");
    expect(document.querySelector("[inert], [aria-modal]")).toBeNull();
    const first = screen.getByRole("link", { name: "Services" });
    const last = screen.getByRole("link", { name: "Contact" });
    first.focus();
    expect(fireEvent.keyDown(first, { key: "Tab", shiftKey: true })).toBe(true);
    last.focus();
    expect(fireEvent.keyDown(last, { key: "Tab" })).toBe(true);

    const outside = screen.getByRole("button", { name: "Page action" });
    act(() => outside.focus());
    expect(outside).toHaveFocus();
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(document.documentElement.style.overflow).toBe("scroll");
  });

  it("closes at the desktop breakpoint and transfers focus to visible navigation", () => {
    const desktopFocusRef = createRef<HTMLAnchorElement>();
    render(
      <>
        <a ref={desktopFocusRef} href="#engagements">Desktop services</a>
        <MobileNav links={links} desktopFocusRef={desktopFocusRef} />
      </>,
    );
    const button = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(button);
    screen.getByRole("link", { name: "About" }).focus();
    resizeToDesktop(true);

    expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 48rem)");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(desktopFocusRef.current).toHaveFocus();
    resizeToDesktop(false);
    expect(button).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("does not steal outside focus when resizing and removes its breakpoint listener", () => {
    const removeListener = vi.spyOn(desktop, "removeEventListener");
    const { unmount } = render(
      <>
        <MobileNav links={links} />
        <button>Page action</button>
      </>,
    );
    const outside = screen.getByRole("button", { name: "Page action" });
    outside.focus();
    resizeToDesktop(true);
    expect(outside).toHaveFocus();

    unmount();
    expect(removeListener).toHaveBeenCalledWith("change", expect.any(Function));
  });
});
