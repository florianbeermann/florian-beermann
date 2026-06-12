import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Magnetic } from "@/components/ui/Magnetic";

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

  const getHref = (hash: string) => {
    return isHome ? hash : `/${hash}`;
  };

  return (
    <>
      <header
        className={`fixed top-4 inset-x-4 md:inset-x-8 z-50 transition-smooth rounded-2xl ${
          scrolled || !isHome
            ? "bg-background/70 backdrop-blur-xl border border-border/60 shadow-card py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container max-w-6xl flex items-center justify-between px-6">
          <a
            href={isHome ? "#" : "/"}
            className="flex items-center gap-3 group"
            aria-label="florian beermann & partners"
          >
            <img
              src="/logo.png"
              alt="florian beermann & partners"
              className="h-9 w-auto group-hover:scale-105 transition-transform duration-300 shrink-0"
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

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Magnetic key={l.href}>
                <a
                  href={getHref(l.href)}
                  className="text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-accent transition-smooth px-4 py-2"
                >
                  {l.label}
                </a>
              </Magnetic>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Magnetic>
              <button
                className="md:hidden text-foreground p-2 z-50 relative"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* Full-screen mobile curtain menu overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl md:hidden flex flex-col justify-center items-center animate-in fade-in duration-300">
          <div className="flex flex-col gap-8 text-center">
            <div className="text-[10px] uppercase tracking-widest text-accent font-semibold mb-2">
              Navigation
            </div>
            {navLinks.map((l, i) => (
              <div key={l.href} className="overflow-hidden">
                <a
                  href={getHref(l.href)}
                  onClick={() => setOpen(false)}
                  className="text-4xl font-extralight text-foreground tracking-tight hover:text-accent transition-smooth block"
                  style={{
                    animation: `reveal-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s both`,
                  }}
                >
                  {l.label}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
