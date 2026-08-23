import { useEffect, useState } from "react";
// `?inline` rather than a bare CSS import. A bare import is a side effect, so
// Vite emits the stylesheet into production even after the component itself is
// tree-shaken out — 1.25kB of rules for a control that cannot exist. As an
// inline string it is a plain value, and it is dropped along with everything
// else in this file.
import css from "./PaletteSwitcher.css?inline";

/* A development-only control for comparing the five candidate palettes on the
   real page rather than on swatches. It is not part of the site: `App` only
   mounts it under `import.meta.env.DEV`, so it is tree-shaken out of the
   production bundle entirely.
   
   The choice is held in the URL rather than in component state so a palette can
   be linked, reloaded and screenshotted — which is what the contrast harness
   needs, since it has to sweep each palette in a fresh page. */

export const PALETTES = [
  { id: "01", name: "Ultramarine", note: "Max chroma, near-black" },
  { id: "02", name: "Cobalt & Bone", note: "Cold blue, warm page" },
  { id: "03", name: "Azure & Graphite", note: "The incumbent" },
  { id: "04", name: "Prussian & Chalk", note: "Navy as the ink" },
  { id: "05", name: "Electric on Slate", note: "Cool throughout" },
] as const;

const STORAGE_KEY = "fbp:palette";

function initial() {
  const fromUrl = new URLSearchParams(window.location.search).get("palette");
  if (fromUrl && PALETTES.some((p) => p.id === fromUrl)) return fromUrl;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved && PALETTES.some((p) => p.id === saved)) return saved;
  return "03";
}

export function PaletteSwitcher() {
  const [active, setActive] = useState(initial);
  // Persisted, because the panel covers part of the hero lede and comparing
  // that specific area means hiding it — which should survive the reload that
  // switching palettes by URL causes.
  const [open, setOpen] = useState(
    () => window.localStorage.getItem(STORAGE_KEY + ":open") !== "0",
  );

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY + ":open", open ? "1" : "0");
  }, [open]);

  useEffect(() => {
    const style = document.createElement("style");
    style.dataset.paletteSwitcher = "";
    style.textContent = css;
    document.head.append(style);
    return () => style.remove();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.palette = active;
    window.localStorage.setItem(STORAGE_KEY, active);
    const url = new URL(window.location.href);
    url.searchParams.set("palette", active);
    window.history.replaceState(null, "", url);
  }, [active]);

  // Number keys 1–5 switch palettes, so the page can be compared without the
  // pointer ever leaving what is being judged.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      const hit = PALETTES.find((p) => p.id === "0" + e.key);
      if (hit) setActive(hit.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="pal" data-open={open || undefined}>
      <button
        type="button"
        className="pal-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="pal-list"
      >
        {open ? "Hide" : "Palette"}
      </button>
      <div id="pal-list" className="pal-list" hidden={!open}>
        {PALETTES.map((p) => (
          <button
            key={p.id}
            type="button"
            className="pal-item"
            data-active={p.id === active || undefined}
            onClick={() => setActive(p.id)}
          >
            <span className="pal-num">{p.id}</span>
            <span className="pal-name">{p.name}</span>
            <span className="pal-note">{p.note}</span>
            <span className="pal-chips" aria-hidden="true">
              <i data-palette={p.id} className="pal-chip pal-chip--blue" />
              <i data-palette={p.id} className="pal-chip pal-chip--stock" />
              <i data-palette={p.id} className="pal-chip pal-chip--paper" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
