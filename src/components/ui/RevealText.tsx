import { useEffect, useRef, useState } from "react";

interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

export const RevealText = ({ text, className = "", delay = 0, stagger = 60 }: RevealTextProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <span ref={containerRef} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="reveal-wrapper inline-block mr-[0.2em] py-[0.1em] -my-[0.1em]">
          <span
            className="reveal-item inline-block"
            style={{
              animationPlayState: isVisible ? "running" : "paused",
              animationDelay: `${delay + i * stagger}ms`,
            }}
          >
            {word === "" ? "\u00A0" : word}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
};
