import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
        <a href={isHome ? "#" : "/"} className="flex items-center gap-2" aria-label="Florian Beermann Consulting">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="246 263 531 485"
            className={`h-8 w-auto transition-smooth ${
              showSolidHeader ? "text-foreground" : "text-white"
            }`}
          >
            <path
              d="M 629.0 495.0 L 643.0 495.0 L 652.0 497.0 L 655.0 498.0 L 665.0 503.0 L 668.0 505.0 L 681.0 518.0 L 685.0 524.0 L 688.0 530.0 L 691.0 539.0 L 692.0 544.0 L 692.0 564.0 L 691.0 569.0 L 688.0 578.0 L 685.0 584.0 L 681.0 590.0 L 669.0 602.0 L 663.0 606.0 L 655.0 610.0 L 649.0 612.0 L 644.0 613.0 L 628.0 613.0 L 623.0 612.0 L 614.0 609.0 L 608.0 606.0 L 601.0 601.0 L 591.0 591.0 L 587.0 585.0 L 586.0 582.0 L 584.0 580.0 L 584.0 578.0 L 582.0 575.0 L 580.0 569.0 L 579.0 565.0 L 579.0 544.0 L 582.0 533.0 L 588.0 521.0 L 590.0 518.0 L 602.0 506.0 L 608.0 502.0 L 614.0 499.0 L 620.0 497.0 Z M 741.0 501.0 L 730.0 483.0 L 709.0 461.0 L 694.0 451.0 L 670.0 441.0 L 655.0 438.0 L 628.0 438.0 L 606.0 444.0 L 584.0 457.0 L 579.0 458.0 L 579.0 376.0 L 576.0 359.0 L 570.0 342.0 L 561.0 326.0 L 550.0 313.0 L 536.0 302.0 L 515.0 292.0 L 492.0 287.0 L 464.0 287.0 L 430.0 296.0 L 418.0 302.0 L 401.0 314.0 L 385.0 330.0 L 372.0 349.0 L 364.0 365.0 L 357.0 385.0 L 349.0 439.0 L 272.0 440.0 L 273.0 493.0 L 350.0 495.0 L 350.0 576.0 L 344.0 612.0 L 331.0 639.0 L 318.0 652.0 L 305.0 659.0 L 290.0 663.0 L 270.0 665.0 L 270.0 722.0 L 271.0 724.0 L 297.0 723.0 L 317.0 719.0 L 331.0 714.0 L 345.0 707.0 L 368.0 689.0 L 386.0 667.0 L 399.0 642.0 L 410.0 600.0 L 412.0 584.0 L 413.0 494.0 L 485.0 493.0 L 485.0 440.0 L 413.0 438.0 L 415.0 410.0 L 420.0 391.0 L 426.0 378.0 L 432.0 369.0 L 445.0 356.0 L 458.0 349.0 L 472.0 346.0 L 483.0 346.0 L 495.0 349.0 L 502.0 353.0 L 511.0 362.0 L 515.0 370.0 L 517.0 378.0 L 518.0 416.0 L 517.0 543.0 L 520.0 579.0 L 529.0 606.0 L 540.0 624.0 L 553.0 639.0 L 575.0 656.0 L 591.0 664.0 L 607.0 669.0 L 627.0 672.0 L 644.0 672.0 L 664.0 669.0 L 677.0 665.0 L 694.0 657.0 L 710.0 646.0 L 725.0 631.0 L 737.0 614.0 L 750.0 581.0 L 753.0 561.0 L 752.0 537.0 L 748.0 519.0 Z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
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

