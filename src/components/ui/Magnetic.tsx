import React, { useRef, useEffect } from "react";

interface MagneticProps {
  children: React.ReactElement;
  range?: number;
  strength?: number;
}

export const Magnetic = ({ children, range = 60, strength = 0.25 }: MagneticProps) => {
  const ref = useRef<HTMLElement>(null);
  
  // Refs to track coordinates for smooth interpolation (lerp)
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const elementX = rect.left + rect.width / 2;
      const elementY = rect.top + rect.height / 2;

      const distanceX = e.clientX - elementX;
      const distanceY = e.clientY - elementY;
      const distance = Math.hypot(distanceX, distanceY);

      if (distance < range) {
        // Attract target position towards cursor
        target.current.x = distanceX * strength;
        target.current.y = distanceY * strength;
      } else {
        // Snap back to anchor
        target.current.x = 0;
        target.current.y = 0;
      }
    };

    const handleMouseLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    const element = ref.current;
    if (element) {
      element.addEventListener("mouseleave", handleMouseLeave);
    }

    // Spring interpolation frame loop
    let animId: number;
    const tick = () => {
      const ease = 0.08; // Smaller ease makes it lag longer and float smoother
      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;

      if (element) {
        element.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (element) {
        element.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animId);
    };
  }, [range, strength]);

  return React.cloneElement(children, {
    ref,
  });
};
