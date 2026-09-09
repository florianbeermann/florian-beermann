import { type RefObject, useEffect, useId, useRef, useState } from "react";

// Keep this in sync with the desktop navigation breakpoint in masthead.css.
const DESKTOP_QUERY = "(min-width: 48rem)";

export function MobileNav({
  links,
  desktopFocusRef,
}: {
  links: { href: string; label: string }[];
  desktopFocusRef?: RefObject<HTMLAnchorElement>;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus({ preventScroll: true });
    };

    const dismissOutside = (event: Event) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", dismissOutside, true);
    document.addEventListener("focusin", dismissOutside);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", dismissOutside, true);
      document.removeEventListener("focusin", dismissOutside);
    };
  }, [open]);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onViewportChange = () => {
      if (!desktop.matches) return;
      const active = document.activeElement;
      if (rootRef.current?.contains(active)) {
        if (desktopFocusRef?.current) {
          desktopFocusRef.current.focus({ preventScroll: true });
        } else if (active instanceof HTMLElement) {
          active.blur();
        }
      }
      setOpen(false);
    };

    onViewportChange();
    desktop.addEventListener("change", onViewportChange);
    return () => desktop.removeEventListener("change", onViewportChange);
  }, [desktopFocusRef]);

  return (
    <div ref={rootRef} className="masthead-mobile-nav">
      <button
        ref={buttonRef}
        type="button"
        className="masthead-disclosure"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="masthead-disclosure-bars" aria-hidden="true">
          <span />
          <span />
        </span>
      </button>

      <nav
        id={panelId}
        className="masthead-panel"
        aria-label="Primary navigation"
        hidden={!open}
      >
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
