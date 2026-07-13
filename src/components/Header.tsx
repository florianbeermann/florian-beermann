import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";

const navLinks = [
  { label: "Value", href: "#value" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const main = document.querySelector("main") as HTMLElement | null;
    const footer = document.querySelector("footer") as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    if (main) main.inert = true;
    if (footer) footer.inert = true;
    document.body.style.overflow = "hidden";
    menuButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = [
        menuButtonRef.current,
        ...(menuRef.current?.querySelectorAll<HTMLElement>("a[href]") ?? []),
      ].filter(Boolean) as HTMLElement[];
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (main) main.inert = false;
      if (footer) footer.inert = false;
      previousFocus?.focus();
    };
  }, [open]);

  const getHref = (hash: string) => (isHome ? hash : `/${hash}`);

  return (
    <>
      <header
        className={`fixed top-4 inset-x-4 md:inset-x-8 z-50 transition-smooth rounded-2xl ${
          scrolled || !isHome || open
            ? "bg-background/95 backdrop-blur-xl border border-border/70 shadow-card py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container max-w-6xl flex items-center justify-between px-6">
          <a
            href={isHome ? "#main-content" : "/"}
            className="flex items-center gap-3 group"
            aria-label="florian beermann & partners — home"
          >
            <img src="/logo.png" alt="" className="h-9 w-auto group-hover:scale-105 transition-transform duration-300 shrink-0" />
            <span className="hidden sm:flex flex-col justify-center leading-none text-left">
              <span className="font-light text-sm tracking-tighter text-foreground lowercase">florian beermann</span>
              <span className="font-light text-xs tracking-tighter text-foreground lowercase mt-0.5">&amp; partners</span>
            </span>
          </a>

          <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={getHref(link.href)}
                className="rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            className="md:hidden rounded-full p-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 bg-background md:hidden" role="dialog" aria-modal="true" aria-label="Site navigation">
          <nav
            ref={menuRef}
            id="mobile-navigation"
            aria-label="Mobile"
            className="flex min-h-full flex-col items-center justify-center gap-8 px-8 text-center"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Navigation</p>
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={getHref(link.href)}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-1 text-4xl font-extralight tracking-tight text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                style={{ animation: `reveal-up 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${index * 70}ms both` }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};
