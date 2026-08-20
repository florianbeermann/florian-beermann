/* Advances the page one section per gesture.
 *
 * CSS scroll snapping cannot do this, and it is worth being precise about why.
 * `scroll-snap-stop: always` governs the *inertial* phase of a scroll — the
 * glide after the fingers leave the trackpad. During the pan itself the page
 * tracks the fingers one to one with no snapping at all, so a firm two-finger
 * push has already travelled a thousand pixels and crossed three sections
 * before the browser has any say. Snapping then tidies up wherever it landed.
 * Capping the distance means answering the wheel.
 *
 * The previous attempt at this froze the page, and the reason matters because
 * it dictates the shape of this one. It re-armed on *silence* — a step was
 * allowed only once wheel events had stopped for a moment. A trackpad emits
 * events continuously while a finger rests on it, so the silence never came,
 * the handler never re-armed, and since it was also cancelling every event the
 * page simply stopped. Arming here is on a *clock* instead: a step is allowed
 * whenever enough time has passed since the last one, which is a condition
 * that always eventually becomes true. Nothing about the visitor's input can
 * hold it shut.
 *
 * Only the wheel is answered. Keyboard, scrollbar, anchor links and
 * find-in-page are untouched, and the CSS snapping underneath stays in place,
 * so if this never runs the page still scrolls and still paces itself loosely.
 */

/* A gap this long between wheel events means the fingers left and came back —
   a new, deliberate gesture rather than the tail of the last one. */
const SILENCE_MS = 120;

/* Least time between steps. Short, so two deliberate flicks in a row both
   land, but long enough that the first few events of one push cannot fire
   twice. */
const QUICK_MS = 260;

/* Change in delta that counts as a real change rather than rounding. */
const NOISE = 0.5;

/* Deltas below this are the dribble at the end of a gesture, not a request. */
const INTENT = 2;

/* How close counts as already there, past the browser's own rounding. */
const ARRIVED = 2;

export function startSectionScroll(root: ParentNode = document): () => void {
  const main = root.querySelector<HTMLElement>("#site-main");
  const steps = root.querySelector<HTMLElement>(".home-engagement-steps");
  if (!main || !steps || typeof window === "undefined") return () => {};

  const stopEls = Array.from(root.querySelectorAll<HTMLElement>(".site-stop"));
  if (!stopEls.length) return () => {};

  let last = 0;
  let seen = 0;
  let size = 0;
  let coasting = false;
  let direction = 0;
  /* Where the current smooth scroll is headed. The next step is measured from
     here rather than from the live scroll position, so a step taken while the
     previous one is still gliding advances by one and not by two. It is only
     trusted while it is fresh — see `from` below — which means no event has to
     arrive to clear it and nothing can be left pointing at a stale target. */
  let pending: number | null = null;

  /* CSS decides whether the page is paced at all: the reel's markers are laid
     out only where the scrubbed layout applies — a desktop window, motion
     allowed, view timelines supported — and that is exactly where this belongs.

     The second test is what keeps anyone from being trapped. A panel taller
     than the window cannot be shown at once, so no single stop stands for it
     and stepping over it would put its middle out of reach. There the page is
     left alone entirely. */
  const paced = () => {
    if (getComputedStyle(steps).display === "none") return false;
    const panels = main.querySelectorAll<HTMLElement>(":scope > .site-panel");
    for (const panel of panels) {
      if (panel.offsetHeight > window.innerHeight) return false;
    }
    return true;
  };

  /* The stops are the markers' own positions, less the offset each one carries.
     They are static elements in the flow — deliberately not the sticky panels,
     whose boxes report wherever they are currently pinned — so this is a stable
     list that does not depend on where the page happens to be. */
  const stops = () => {
    const max = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    const found = [0, max];

    for (const el of stopEls) {
      const margin =
        parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
      found.push(el.getBoundingClientRect().top + window.scrollY - margin);
    }
    for (const mark of Array.from(steps.children) as HTMLElement[]) {
      found.push(mark.getBoundingClientRect().top + window.scrollY);
    }

    const sorted = found
      .map((y) => Math.round(Math.min(Math.max(y, 0), max)))
      .sort((a, b) => a - b);

    /* Near-identical stops are one stop; the bottom always survives, since
       losing it to a neighbour is what would hide the footer. */
    const merged: number[] = [];
    for (const y of sorted) {
      const prev = merged[merged.length - 1];
      if (prev === undefined || y - prev >= 80) merged.push(y);
      else if (y === max) merged[merged.length - 1] = y;
    }
    return merged;
  };

  const onWheel = (event: WheelEvent) => {
    /* Zoom and sideways gestures are not ours. */
    if (event.ctrlKey) return;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    /* A scrollable box under the pointer keeps its own gesture while it still
       has somewhere to go, which is how a nested scroller behaves natively. */
    const box = (event.target as Element | null)?.closest?.(
      "textarea, [data-scrollable]",
    );
    if (box instanceof HTMLElement && box.scrollHeight > box.clientHeight) {
      const room =
        event.deltaY > 0
          ? box.scrollTop + box.clientHeight < box.scrollHeight - 1
          : box.scrollTop > 0;
      if (room) return;
    }

    if (!paced()) return;
    const list = stops();
    if (list.length < 2) return;

    event.preventDefault();

    if (Math.abs(event.deltaY) < INTENT) return;

    const now = performance.now();
    const gap = now - seen;
    seen = now;
    const dir = event.deltaY > 0 ? 1 : -1;
    const size2 = Math.abs(event.deltaY);

    /* Is this the visitor pushing, or the page coasting?
    
       It is the only question that matters here, and the deltas answer it. A
       momentum tail decays: once the fingers are off, each event is smaller
       than the one before it, all the way down. A push does the opposite — it
       ramps up. So a falling delta means coasting and a rising one means the
       visitor is asking for something, and a pause means a new gesture either
       way. Deltas that are merely equal leave the verdict as it stands.
    
       Without this a flick is answered twice: once for the push and again when
       the tail outlasts whatever fixed delay is used to ignore it. Tails run
       well over a second on a trackpad, and any delay long enough to cover one
       is long enough to make the page feel stuck. */
    if (gap > SILENCE_MS) coasting = false;
    else if (size2 > size + NOISE) coasting = false;
    else if (size2 < size - NOISE) coasting = true;
    size = size2;

    /* Turning around is always answered at once. Waiting after a reversal would
       read as the page ignoring a deliberate change of mind. */
    if (dir !== direction) {
      last = 0;
      coasting = false;
    }

    /* A coast is never answered, however long it runs. There is no timeout
       paired with this, and that is deliberate: any fixed one is either shorter
       than some real momentum tail, which lets a hard flick count twice, or
       long enough to be felt as the page ignoring the visitor. It is safe to
       wait indefinitely because `coasting` is only ever set by a *falling*
       delta, and it is cleared by a rise or a pause — so a push during the
       coast is answered at once, and when the coast simply dies out the next
       gesture arrives after a gap and clears it. A device with steady deltas,
       a mouse wheel, never sets it in the first place. */
    if (coasting) return;
    if (now - last < QUICK_MS) return;

    /* The previous destination counts only while the scroll it belongs to could
       still be running. Older than that and the page is wherever it is, which
       is the honest reference. */
    const live = pending !== null && now - last < 900;
    const from = live ? (pending as number) : window.scrollY;
    const next =
      dir > 0
        ? list.find((stop) => stop > from + ARRIVED)
        : [...list].reverse().find((stop) => stop < from - ARRIVED);
    if (next === undefined) return;

    last = now;
    direction = dir;
    pending = next;
    window.scrollTo({ top: next, behavior: "smooth" });
  };

  window.addEventListener("wheel", onWheel, { passive: false });

  return () => {
    window.removeEventListener("wheel", onWheel);
  };
}
