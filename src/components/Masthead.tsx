import { useEffect, useRef, useState } from "react";
import { BrandMark } from "./BrandMark";
import { MobileNav } from "./MobileNav";

/* The masthead, and it now belongs to the page rather than to the hero.

   It used to be `position: sticky` inside the first viewport, which meant it
   travelled with the shader and then stopped at the hero's bottom edge. Fixed,
   it crosses every section — and that is the whole problem this component
   exists to solve, because the sections underneath it are not one ground. The
   hero is a dark shader, the sheets are pale, and the statement band is a
   saturated blue. A single treatment cannot sit on all three: the glass film is
   a *light* film at 10%, which lifts a dark ground and disappears entirely on a
   pale one, and the type is the paper colour, which is invisible on the sheet.

   The reference solves it by adapting rather than by compromising, and the
   values here are measured off it rather than guessed: the blur stays at 50px
   throughout, the film goes from a 10% light film on the dark hero to a 40%
   white film on the light sections, and the links flip from white to near-black.

   WHAT IS DIFFERENT HERE: the reference keeps its call to action a constant
   white plate, because its light sections are darker than its plate. Ours are
   not — a paper plate on the paper sheet is invisible — so the action takes the
   blue below the fold. That is the better answer anyway: the blue is the
   signal, this is the one thing the page asks for, and it gets louder exactly
   where the visitor has read enough to act. */

/* Which sections can be a ground. Anything with an opaque background; the rest
   are skipped at read time. */
const GROUNDS = "main > section, main > footer, .site-page > footer";

/* Three grounds, not two, and the third one is not a nicety.

   The 10% light film works by being negligible: it lifts the backdrop by a
   tenth of a near-white, which is nothing on the hero and fatal on anything
   mid-dark. Measured off real pixels, the statement band composited to
   rgb(23,92,253) and the paper links on it landed at 4.48:1 — a fail at 13px,
   by 0.02. The band is a saturated mid-dark colour, which is neither of the
   other two materials, and treating it as "dark" is what produced the failure.

   So it gets a film of its own that darkens instead of lifting, and the pill
   reads as an inset in the band rather than a plate on it. 6.5:1 measured.

   The page's grounds sit at 0.012 (hero), 0.117 (statement band) and 0.843
   (sheets), so both thresholds fall in wide gaps. */
const DEEP_BELOW = 0.35;
const DARK_BELOW = 0.06;

type Ground = "dark" | "deep" | "light";

function groundOf(el: Element): Ground | null {
  const parts = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
  if (!parts) return null;
  const [r, g, b, a = "1"] = parts.map(Number) as number[];
  // A transparent section is not a ground — it shows whatever is behind it.
  if (!a) return null;
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  if (luminance < DARK_BELOW) return "dark";
  return luminance < DEEP_BELOW ? "deep" : "light";
}

/* What the mark should be printed in, taken from the section rather than from
   the ground.

   The two are not the same question. The ground decides the film and the type,
   and there are only three of those. The mark belongs to the marker register —
   the labels, figures and headings a reader scans — and that register is the
   blue on the inverted bands and the slate on the plain ones, both of which are
   the same "light" ground. Colouring the mark from the ground put it in the
   blue over a section whose headings were slate.

   So it reads `--marker`, which is the token that register already resolves
   from, and is therefore right by construction in any section added later. */
function markerOf(el: Element): string {
  return getComputedStyle(el).getPropertyValue("--marker").trim();
}

export function Masthead() {
  const ref = useRef<HTMLElement | null>(null);
  const [ground, setGround] = useState<Ground>("dark");
  const [markColor, setMarkColor] = useState<string>("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* Both are guarded rather than assumed. The component must not throw where
       they are missing — a test renderer, or any non-browser environment — and
       the failure mode without them is only that the masthead keeps its
       starting treatment instead of adapting. */
    if (typeof IntersectionObserver === "undefined") return;

    let observer: IntersectionObserver | null = null;
    let frame = 0;

    /* The ground is whichever section covers the masthead's own centre line.
       A one-pixel band rather than a scroll listener: sections are stacked and
       do not overlap, so exactly one crosses that line at a time, and the
       browser reports the change instead of the page recomputing it every
       frame — which matters on a page already running a shader. */
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

    // The masthead's offset and height are both clamped against the viewport,
    // so the band moves when the window does and the observer has to be rebuilt
    // with it. Coalesced to one rebuild per frame.
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
    /* Explicit `banner`, and outside <main> so the landmark is not nested
       inside another one. */
    <header
      ref={ref}
      className="site-masthead"
      data-ground={ground}
      style={markColor ? ({ "--mark-color": markColor } as React.CSSProperties) : undefined}
      role="banner"
    >
      {/* The mark carries the accessible name now that the wordmark has left
          the bar — otherwise the only route home would be an unlabelled
          graphic. */}
      <a className="masthead-mark" href="#top" aria-label="Florian Beermann &amp; Partners — home">
        <BrandMark />
      </a>
      <nav className="glass masthead-rail" aria-label="Primary navigation">
        <a href="#engagements">Work</a>
        <a href="#about">About</a>
      </nav>
      <a className="control control--solid masthead-cta" href="#contact">
        Start a conversation
      </a>
      {/* Below 48rem the pill above is hidden and this takes over. Both are
          always in the DOM; CSS decides which is shown, so there is no
          viewport-width branch in JavaScript to get out of step with the
          breakpoint. */}
      <MobileNav
        links={[
          { href: "#engagements", label: "Work" },
          { href: "#about", label: "About" },
        ]}
        action={{ href: "#contact", label: "Start a conversation" }}
      />
    </header>
  );
}
