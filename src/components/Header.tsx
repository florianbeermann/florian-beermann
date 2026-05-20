import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LineChart, Menu, X } from "lucide-react";
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
        <a href={isHome ? "#" : "/"} className="flex items-center gap-2 font-bold text-lg">
          <div className="h-8 w-8 rounded-lg bg-gradient-accent flex items-center justify-center shadow-accent">
            <LineChart className="h-4 w-4 text-accent-foreground" />
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={getHref(l.href)}
              className={`text-sm font-medium transition-smooth hover:text-accent ${
                showSolidHeader ? "text-muted-foreground" : "text-white/80"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button variant="accent" size="sm" asChild>
            <a href={getHref("#contact")}>Get a CS Audit</a>
          </Button>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <X className={showSolidHeader ? "text-foreground" : "text-white"} />
          ) : (
            <Menu className={showSolidHeader ? "text-foreground" : "text-white"} />
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
            <Button variant="accent" asChild>
              <a href={getHref("#contact")} onClick={() => setOpen(false)}>Get a CS Audit</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

