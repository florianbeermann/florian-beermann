import { useEffect, useRef, useState } from "react";

export const Cursor = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [scale, setScale] = useState(1);

  // Mouse coordinates
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Hide default cursor on desktop devices
    document.documentElement.classList.add("custom-cursor-active");

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleCursorChange = (e: CustomEvent<{ text?: string; scale?: number; active?: boolean }>) => {
      if (e.detail.active !== undefined) setIsHovered(e.detail.active);
      if (e.detail.text !== undefined) setText(e.detail.text);
      if (e.detail.scale !== undefined) setScale(e.detail.scale);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("cursor-change", handleCursorChange as EventListener);

    // Lerp loop for the lagging ring
    let animId: number;
    const updateRing = () => {
      const ease = 0.12; // Lag/interpolation speed
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * ease;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) scale(${scale})`;
      }
      animId = requestAnimationFrame(updateRing);
    };
    animId = requestAnimationFrame(updateRing);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("cursor-change", handleCursorChange as EventListener);
      cancelAnimationFrame(animId);
    };
  }, [scale]);

  return (
    <>
      {/* Center dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-accent pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out hidden md:block"
        style={{ mixBlendMode: "difference" }}
      />
      {/* Outer Spring Ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-accent pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300 ease-out hidden md:block"
        style={{
          backgroundColor: isHovered ? "rgba(16, 133, 249, 0.08)" : "transparent",
          borderColor: isHovered ? "rgba(16, 133, 249, 0.4)" : "rgba(16, 133, 249, 0.7)",
        }}
      >
        {text && (
          <span className="text-[8px] uppercase font-bold tracking-widest text-accent text-center whitespace-nowrap px-1">
            {text}
          </span>
        )}
      </div>
    </>
  );
};

export const triggerCursor = (active: boolean, text: string = "", scale: number = 2) => {
  const event = new CustomEvent("cursor-change", {
    detail: { active, text, scale },
  });
  window.dispatchEvent(event);
};
