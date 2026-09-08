import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Wordmark } from "./Wordmark";
import { MobileNav } from "./MobileNav";

const GROUNDS = "main > section, main > footer, .site-page > footer";
const DEEP_BELOW = 0.35;
const DARK_BELOW = 0.06;
const NAV_LINKS = [
  { href: "#engagements", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

type Ground = "dark" | "deep" | "light";

function groundOf(el: Element): Ground | null {
  const parts = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
  if (!parts) return null;
  const [r, g, b, a = 1] = parts.map(Number);
  // Transparent sections keep the treatment of the ground behind them.
  if (!a) return null;
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  if (luminance < DARK_BELOW) return "dark";
  return luminance < DEEP_BELOW ? "deep" : "light";
}

function markerOf(el: Element): string {
  return getComputedStyle(el).getPropertyValue("--marker").trim();
}

export function Masthead() {
  const ref = useRef<HTMLElement | null>(null);
  const desktopLinkRef = useRef<HTMLAnchorElement>(null);
  const [ground, setGround] = useState<Ground>("dark");
  const [markColor, setMarkColor] = useState<string>("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;

    let observer: IntersectionObserver | null = null;
    let frame = 0;

    // Observe the row's centre line, without sampling video frames or scrolling.
    const build = () => {
      observer?.disconnect();
      observer = null;

      const box = el.getBoundingClientRect();
      const line = Math.round(box.top + box.height / 2);
      const vh = window.innerHeight;
      if (line < 0 || line >= vh) return;

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const next = groundOf(entry.target);
            if (!next) continue;
            setGround(next);
            setMarkColor(markerOf(entry.target));
          }
        },
        { rootMargin: `-${line}px 0px -${vh - line - 1}px 0px`, threshold: 0 },
      );

      document.querySelectorAll(GROUNDS).forEach((s) => observer?.observe(s));
    };

    // Responsive header sizing changes the observation line.
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(build);
    };

    build();
    window.addEventListener("resize", schedule);
    const ro =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    ro?.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      ro?.disconnect();
      observer?.disconnect();
    };
  }, []);

  return (
    <header
      ref={ref}
      className="site-masthead"
      data-ground={ground}
      style={markColor ? ({ "--mark-color": markColor } as CSSProperties) : undefined}
      role="banner"
    >
      <a className="masthead-mark" href="#top" aria-label="Florian Beermann, home">
        <Wordmark className="masthead-wordmark" />
      </a>
      <nav className="glass masthead-rail" aria-label="Primary navigation">
        <ul>
          {NAV_LINKS.slice(0, 2).map((link, index) => (
            <li key={link.href}>
              <a ref={index === 0 ? desktopLinkRef : undefined} href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <a className="control control--solid masthead-cta" href="#contact">
        Get in touch
      </a>
      <MobileNav links={NAV_LINKS} desktopFocusRef={desktopLinkRef} />
    </header>
  );
}
