import { useLayoutEffect, useRef, type RefObject } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";

const previousAddresses = new Map([
  ["intro", "top"],
  ["engagements", "expertise"],
  ["about", "florian"],
  ["transition", "approach"],
]);

function initHomeSections(page: HTMLElement) {
  const screens = [...page.querySelectorAll<HTMLElement>(".section-screen")];
  const masthead = page.querySelector<HTMLElement>(".masthead");
  const brand = masthead?.querySelector<HTMLAnchorElement>("a.brand");
  const menu = masthead?.querySelector<HTMLDetailsElement>("details.mobile-menu");
  const dropdown = menu?.querySelector<HTMLElement>("nav");
  const home = screens.find(screen => screen.dataset.screen === "top");
  const homeTarget = home?.querySelector<HTMLElement>("section");
  if (!home || !homeTarget || !masthead || !brand || !menu || !dropdown) {
    throw new Error("The homepage is missing its Home screen or navigation.");
  }

  const root = document.documentElement;
  const links = [...masthead.querySelectorAll<HTMLAnchorElement>("nav a")];
  const positions = new Map<HTMLElement, number>();
  let active: HTMLElement;

  const measureNavigation = () => {
    const height = masthead.getBoundingClientRect().height;
    root.style.setProperty("--screen-header", `${height}px`);
    root.style.setProperty(
      "--mobile-menu-bottom",
      `${menu.open ? dropdown.getBoundingClientRect().bottom : height}px`,
    );
  };
  const outsideClick = (event: MouseEvent) => {
    if (event.target instanceof Node && menu.open && !menu.contains(event.target)) menu.open = false;
  };
  const followMenuLink = (event: MouseEvent) => {
    if (event.target instanceof Element && event.target.closest("a")) menu.open = false;
  };
  const dismissMenu = (event: KeyboardEvent) => {
    if (event.key === "Escape" && menu.open) {
      menu.open = false;
      menu.querySelector("summary")?.focus();
    }
  };
  const desktop = window.matchMedia("(min-width: 801px)");
  const closeOnDesktop = () => { if (desktop.matches) menu.open = false; };
  const observer = typeof ResizeObserver === "function" ? new ResizeObserver(measureNavigation) : null;

  root.classList.add("fixed-sections");
  observer?.observe(masthead);
  observer?.observe(dropdown);
  window.addEventListener("resize", measureNavigation);
  menu.addEventListener("toggle", measureNavigation);
  menu.addEventListener("click", followMenuLink);
  document.addEventListener("click", outsideClick);
  document.addEventListener("keydown", dismissMenu);
  desktop.addEventListener("change", closeOnDesktop);

  return {
    show(hash: string, { focus, restore }: { focus: boolean; restore: boolean }) {
      let id = "top";
      let invalid = false;
      try {
        id = decodeURIComponent(hash.replace(/^#/, "")) || "top";
      } catch (error) {
        if (!(error instanceof URIError)) throw error;
        console.warn("The section address is malformed. Showing Home instead.", hash);
        invalid = true;
      }
      id = previousAddresses.get(id) ?? id;
      let target = document.getElementById(id);
      let screen = target?.closest<HTMLElement>(".section-screen");
      if (!screen || !screens.includes(screen)) {
        console.warn("The requested section does not exist. Showing Home instead.", id);
        screen = home;
        target = homeTarget;
        invalid = true;
      }

      if (active) positions.set(active, active.scrollTop);
      // React owns the structure; this controller only updates navigation state.
      for (const candidate of screens) {
        candidate.hidden = candidate !== screen;
        candidate.inert = candidate !== screen;
        candidate.setAttribute("aria-hidden", String(candidate !== screen));
      }
      active = screen;
      root.dataset.activeScreen = screen.dataset.screen;
      brand.inert = screen === home;
      brand.setAttribute("aria-hidden", String(screen === home));
      if (screen === home) brand.setAttribute("aria-current", "location");
      else brand.removeAttribute("aria-current");
      menu.open = false;
      for (const link of links) {
        if (link.hash === `#${screen.dataset.screen}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
      measureNavigation();
      screen.scrollTop = restore ? positions.get(screen) ?? 0 : 0;
      if (target.id !== screen.dataset.screen) target.scrollIntoView({ block: "start", behavior: "instant" });
      if (focus) {
        const heading = target.matches("h1,h2,h3") ? target : target.querySelector<HTMLElement>("h1,h2,h3");
        if (heading) {
          heading.tabIndex = -1;
          heading.focus({ preventScroll: true });
        }
      }
      return { invalid };
    },
    destroy() {
      observer?.disconnect();
      window.removeEventListener("resize", measureNavigation);
      menu.removeEventListener("toggle", measureNavigation);
      menu.removeEventListener("click", followMenuLink);
      document.removeEventListener("click", outsideClick);
      document.removeEventListener("keydown", dismissMenu);
      desktop.removeEventListener("change", closeOnDesktop);
      screens.forEach(screen => {
        screen.hidden = false;
        screen.inert = false;
        screen.removeAttribute("aria-hidden");
      });
      brand.inert = false;
      brand.removeAttribute("aria-hidden");
      brand.removeAttribute("aria-current");
      links.forEach(link => link.removeAttribute("aria-current"));
      root.classList.remove("fixed-sections");
      delete root.dataset.activeScreen;
      root.style.removeProperty("--screen-header");
      root.style.removeProperty("--mobile-menu-bottom");
    },
  };
}

export function useHomeSections(page: RefObject<HTMLElement>) {
  const { hash, key, search } = useLocation();
  const navigationType = useNavigationType();
  const navigate = useNavigate();
  const controller = useRef<ReturnType<typeof initHomeSections>>();
  const hasSelected = useRef(false);

  useLayoutEffect(() => {
    if (!page.current) throw new Error("The homepage must be mounted before its navigation.");
    controller.current = initHomeSections(page.current);
    return () => {
      controller.current?.destroy();
      controller.current = undefined;
      hasSelected.current = false;
    };
  }, [page]);

  useLayoutEffect(() => {
    const result = controller.current?.show(hash, {
      focus: hasSelected.current,
      restore: navigationType === "POP",
    });
    hasSelected.current = true;
    if (result?.invalid) navigate({ pathname: "/", search, hash: "#top" }, { replace: true });
  }, [hash, key, search, navigationType, navigate]);
}
