import { BrandMark } from "./BrandMark";

/* The wordmark: the anvil, then the name on two lines beside it.

   One component rather than a mark and a span assembled at each call site,
   which is what this used to be. The lockup has internal proportions — the
   mark's height against the two-line block, the gap between them, the leading
   that decides that block's height — and those only hold if they are stated
   once. Five places drew it before this existed and three of them had drifted.

   The name is written in title case and set in a unicase face, so the markup
   says "Florian Beermann & Co." and the page shows FLORIAN BEERMANN & CO. That
   split is deliberate: the caps are a property of the drawing, not of the name,
   and everything that reads the text rather than the pixels — a screen reader,
   a search result, a page title — should get the name as it is written.

   The break is a real <br> rather than a width the text wraps inside. The
   lockup is two fixed lines, "Florian Beermann" over "& Co.", and a wrap that
   depends on available width would put "& Co." on line one on a wide screen
   and break the name somewhere else on a narrow one.

   `className` scales the whole lockup: every measurement inside is in em, so a
   caller sets a font-size on it and the mark, the gap and the leading follow. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className ? `wordmark ${className}` : "wordmark"}>
      <BrandMark className="wordmark-mark" />
      <span className="wordmark-name">
        Florian Beermann
        <br />
        &amp; Co.
      </span>
    </span>
  );
}
