import { useEffect, useState } from "react";
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
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showSolidHeader = scrolled || !isHome;

  const getHref = (hash: string) => {
    return isHome ? hash : `/${hash}`;
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-smooth ${
        showSolidHeader
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-card"
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <a href={isHome ? "#" : "/"} className="flex items-center gap-3 group" aria-label="florian beermann & partners">
          <img
            src="/logo.png"
            alt="florian beermann & partners"
            className="h-10 w-auto group-hover:opacity-85 transition-smooth"
          />
          <div className="flex flex-col justify-center items-center leading-none hidden sm:flex text-center">
            <span
              className="font-light text-sm font-logo-screenshot tracking-tighter text-foreground transition-smooth lowercase"
              style={{ fontFeatureSettings: "'ss01'" }}
            >
              ƒlorian beermann
            </span>
            <span
              className="font-light text-xs font-logo-screenshot tracking-tighter text-foreground transition-smooth lowercase mt-0.5"
              style={{ fontFeatureSettings: "'ss01'" }}
            >
              & partners
            </span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={getHref(l.href)}
              className="text-sm font-medium transition-smooth hover:text-accent text-muted-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <X className="text-foreground" />
          ) : (
            <Menu className="text-foreground" />
          )}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container py-4 flex flex-col gap-4">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={getHref(l.href)}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-foreground"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

