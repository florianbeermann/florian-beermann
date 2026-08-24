import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

/* jsdom does not implement IntersectionObserver, and the hero's background uses
   one to avoid decoding a video nobody is looking at.
 
   This gap was here before and went unnoticed: the shader that used to hold
   that spot also constructed one, but only after asking for a WebGL context,
   which jsdom refuses — so it always returned first and never reached the line
   that would have thrown. A stub rather than a mock: no test asserts on
   visibility behaviour, they just need the constructor to exist. */
class NoopIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: readonly number[] = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: NoopIntersectionObserver,
});
Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: NoopIntersectionObserver,
});
