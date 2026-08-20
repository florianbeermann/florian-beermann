/* Sizes the sticky offset for each cover-scroll panel.
 *
 * Panels pin so the next section can slide up over them, which is trivial for a
 * panel that fits the viewport — `top: 0` and it holds. It is wrong for one that
 * does not: a sticky element pins its *top* edge, so a section taller than the
 * window would park with its overflow permanently below the fold and the visitor
 * could never scroll to it.
 *
 * The fix is a negative offset equal to the overflow, which parks the panel's
 * *bottom* edge at the bottom of the window instead. It scrolls fully into view,
 * then holds while the next panel covers it. That offset is the element's own
 * height, which CSS cannot see: percentages in `top` resolve against the
 * containing block, and container query units resolve for descendants of a
 * container rather than for the container itself.
 *
 * So it is measured here and published as a custom property. This runs on
 * layout, never on scroll — there is no scroll listener anywhere in this
 * project, and the cover effect itself is entirely CSS.
 */

/* Matches the fallback in shell.css. Large enough that an unmeasured panel
   resolves to a `top` far outside the document and so never pins at all, which
   is a page that simply scrolls rather than a page with its content cut off. */
const UNMEASURED = "9999px";

export function startPanelScroll(root: ParentNode = document): () => void {
  const panels = Array.from(root.querySelectorAll<HTMLElement>(".site-panel"));
  if (!panels.length || typeof ResizeObserver === "undefined") return () => {};

  const apply = (panel: HTMLElement) => {
    /* `offsetHeight` rather than the observer's own box: it is the border box
       in layout pixels, which is what the sticky offset is measured in, and it
       stays correct if a panel ever takes a transform. */
    const h = panel.offsetHeight;
    panel.style.setProperty("--panel-h", h > 0 ? `${h}px` : UNMEASURED);

    /* The scroll stop that precedes the panel needs the same number: it snaps
       to where the panel will park, and a panel too tall to clear the masthead
       parks a little higher. It is a sibling rather than a child — a sticky
       element is a moving target and cannot carry the stop itself — so the
       value has to be handed to it rather than inherited. */
    const stop = panel.previousElementSibling;
    if (stop instanceof HTMLElement && stop.classList.contains("site-stop")) {
      stop.style.setProperty("--panel-h", h > 0 ? `${h}px` : "0px");
    }
  };

  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) apply(entry.target as HTMLElement);
  });

  for (const panel of panels) {
    apply(panel);
    observer.observe(panel);
  }

  return () => {
    observer.disconnect();
    for (const panel of panels) {
      panel.style.removeProperty("--panel-h");
      const stop = panel.previousElementSibling;
      if (stop instanceof HTMLElement) stop.style.removeProperty("--panel-h");
    }
  };
}
