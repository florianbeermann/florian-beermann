import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { EnquiryProvider } from "@/components/EnquiryProvider";
import Home from "./pages/Home.tsx";
import Imprint from "./pages/Imprint.tsx";
import Privacy from "./pages/Privacy.tsx";
import NotFound from "./pages/NotFound.tsx";
import { useEffect, useLayoutEffect, useRef } from "react";

const ScrollRestoration = () => {
  const { key, pathname, search, hash } = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map<string, { left: number; top: number }>());
  const entryKey = `${key}:${pathname}${search}${hash}`;
  const currentKey = useRef(entryKey);
  const previousLocation = useRef({ pathname, search, hash });

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    const rememberPosition = () => {
      positions.current.set(currentKey.current, {
        left: window.scrollX,
        top: window.scrollY,
      });
    };
    window.addEventListener("scroll", rememberPosition, { passive: true });
    // Capture the position before a link replaces the long homepage.
    document.addEventListener("click", rememberPosition, true);
    return () => {
      window.history.scrollRestoration = previous;
      window.removeEventListener("scroll", rememberPosition);
      document.removeEventListener("click", rememberPosition, true);
    };
  }, []);

  useLayoutEffect(() => {
    const previous = previousLocation.current;
    const fragmentNavigation =
      previous.pathname === pathname &&
      previous.search === search &&
      previous.hash !== hash;
    previousLocation.current = { pathname, search, hash };
    currentKey.current = entryKey;
    // Native fragment links are reported as POP too. Their destination takes
    // priority over an earlier position stored under the same history key.
    const saved = navigationType === "POP" && !fragmentNavigation
      ? positions.current.get(entryKey)
      : undefined;
    if (saved) {
      window.scrollTo({ ...saved, behavior: "instant" });
      return;
    }
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) {
      target.scrollIntoView({ behavior: "instant" });
      return;
    }
    window.scrollTo({ left: 0, top: 0, behavior: "instant" });
  }, [entryKey, pathname, search, hash, navigationType]);

  return null;
};

const App = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <EnquiryProvider>
      <ScrollRestoration />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/imprint" element={<Imprint />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </EnquiryProvider>
    <Sonner />
  </BrowserRouter>
);

export default App;
