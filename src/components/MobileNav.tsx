import { useEffect, useRef, useState } from "react";

/* The mobile navigation: a disclosure button and a full-screen sheet.

   WHY IT EXISTS. Below the breakpoint the masthead cannot hold a mark, a glass
   pill of links and a solid action on one row — measured at 390px they need
   about 500px between them. Wrapping is what it did instead, which stacked the
   pill under the action and made the header read as two competing bars.

   The reference solves it by removing the pill entirely on mobile: one row of
   mark, action, and a disclosure toggle, with the links moving into a sheet.
   That is the arrangement here. The action stays visible because it is the one
   thing the page is asking for; only the navigation is folded away.

   A disclosure hiding two links is a fair thing to question. It is still the
   right call at this width: those two labels need about 130px that the row does
   not have, and the alternative — shrinking them until they fit — puts
   navigation below the size at which it is comfortably tappable.

   WHAT THE ACCESSIBILITY COSTS. A menu behind a button is a disclosure, not a
   dialog, but a *full-screen* one has to behave like a modal or it strands
   keyboard and screen reader users behind it. So: the button owns
   `aria-expanded` and `aria-controls`; focus moves into the sheet on open and
   returns to the button on close; Escape closes; focus is trapped while open;
   the page behind is inert to the accessibility tree and locked against
   scrolling. None of that is optional once the sheet covers the viewport. */

const FOCUSABLE = 'a[href], button:not([disabled])';

export function MobileNav({
  links,
  action,
}: {
  links: { href: string; label: string }[];
  action: { href: string; label: string };
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  // Whether the sheet was opened by keyboard. A pointer user does not expect
  // focus to jump; a keyboard user is stranded without it.
  const viaKeyboard = useRef(false);

  useEffect(() => {
    if (!open) return;

    const sheet = sheetRef.current;
    if (!sheet) return;

    if (viaKeyboard.current) {
      sheet.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        // Escape is a keyboard action by definition, so focus has to come back
        // to the control that opened this — otherwise it is left on an element
        // that has just been made inert and the tab order restarts from the
        // top of the document.
        buttonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      // Trap. Without this, Tab walks into the page behind the sheet, which is
      // visually covered and inert — the focus ring simply disappears.
      const items = [...sheet.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !sheet.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    // Scroll lock. Set on the element rather than the body so it composes with
    // whatever the page already does, and restored to its previous value
    // rather than cleared.
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      root.style.overflow = prevOverflow;
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="masthead-disclosure"
        aria-expanded={open}
        aria-controls="hero-nav-sheet"
        aria-label={open ? "Close menu" : "Open menu"}
        onPointerDown={() => {
          viaKeyboard.current = false;
        }}
        onClick={(e) => {
          // `detail` is 0 for a click synthesised from Enter or Space, which is
          // the only reliable way to tell the two apart here.
          if (e.detail === 0) viaKeyboard.current = true;
          setOpen((v) => !v);
        }}
      >
        <span className="masthead-disclosure-bars" aria-hidden="true">
          <span />
          <span />
        </span>
      </button>

      {/* Rendered whether or not it is open, so the button's `aria-controls`
          always resolves to something and the sheet has a state to transition
          from. `inert` keeps it out of the tree and out of the tab order while
          closed, which `visibility: hidden` alone would not guarantee across
          the transition. */}
      <div
        id="hero-nav-sheet"
        ref={sheetRef}
        className={`masthead-sheet${open ? " is-open" : ""}`}
        {...(open ? {} : { inert: "" })}
      >
        <nav className="masthead-sheet-nav" aria-label="Primary navigation">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={close}>
              {l.label}
            </a>
          ))}
        </nav>
        <a
          className="control control--solid masthead-sheet-action"
          href={action.href}
          onClick={close}
        >
          {action.label}
        </a>
      </div>
    </>
  );
}
