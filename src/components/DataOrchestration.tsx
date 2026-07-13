import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ShieldCheck, GitMerge, LayoutGrid } from "lucide-react";

type Particle = {
  x: number;
  y: number;
  anchorX: number;
  anchorY: number;
  vx: number;
  vy: number;
  ordered: boolean;
  influence: number;
};

const SymmetryGraphic = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: -1000, y: -1000, active: false, pressed: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !frame || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let particles: Particle[] = [];
    let animationFrame = 0;
    let size = 0;
    let isVisible = false;
    let frameNumber = 0;
    let connections: Array<[number, number]> = [];

    const buildParticles = () => {
      const columns = size < 330 ? 16 : 18;
      const rows = columns;
      const step = size / columns;
      const top = step * 0.75;
      const bottom = size - 48;
      const usableHeight = bottom - top;

      particles = [];
      for (let column = 0; column < columns; column += 1) {
        for (let row = 0; row < rows; row += 1) {
          const ordered = column < columns / 2;
          const anchorX = step * column + step / 2;
          const anchorY = top + (row / (rows - 1)) * usableHeight;
          particles.push({
            x: ordered ? anchorX : size / 2 + Math.random() * (size / 2 - step),
            y: ordered ? anchorY : top + Math.random() * usableHeight,
            anchorX,
            anchorY,
            vx: ordered ? 0 : (Math.random() - 0.5) * 1.4,
            vy: ordered ? 0 : (Math.random() - 0.5) * 1.4,
            ordered,
            influence: 0,
          });
        }
      }
      connections = [];
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const nextSize = Math.round(bounds.width);
      if (!nextSize || nextSize === size) return;
      size = nextSize;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * pixelRatio);
      canvas.height = Math.round(size * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      buildParticles();
      draw();
    };

    const refreshConnections = () => {
      const nextConnections: Array<[number, number]> = [];
      const connectionDistance = size / 9;
      for (let first = 0; first < particles.length; first += 1) {
        for (let second = first + 1; second < particles.length; second += 1) {
          const a = particles[first];
          const b = particles[second];
          if (a.ordered !== b.ordered) continue;
          if (Math.hypot(a.x - b.x, a.y - b.y) < connectionDistance) {
            nextConnections.push([first, second]);
          }
        }
      }
      connections = nextConnections;
    };

    const update = () => {
      const pointer = pointerRef.current;
      const top = size / 18;
      const bottom = size - 48;

      particles.forEach((particle) => {
        if (pointer.active) {
          const distance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y);
          const radius = pointer.pressed ? size * 0.25 : size * 0.14;
          if (distance > 0 && distance < radius) {
            const force = (1 - distance / radius) * (pointer.pressed ? 0.9 : 0.35);
            particle.vx += ((particle.x - pointer.x) / distance) * force;
            particle.vy += ((particle.y - pointer.y) / distance) * force;
            particle.influence = Math.max(particle.influence, 1 - distance / radius);
          }
        }

        if (particle.ordered) {
          particle.vx += (particle.anchorX - particle.x) * 0.035;
          particle.vy += (particle.anchorY - particle.y) * 0.035;
          particle.vx *= 0.82;
          particle.vy *= 0.82;
        } else {
          particle.vx += (Math.random() - 0.5) * 0.12;
          particle.vy += (Math.random() - 0.5) * 0.12;
          particle.vx *= 0.985;
          particle.vy *= 0.985;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.influence *= 0.94;

        const leftEdge = particle.ordered ? size / 30 : size / 2 + size / 40;
        const rightEdge = particle.ordered ? size / 2 - size / 40 : size - size / 30;
        if (particle.x < leftEdge || particle.x > rightEdge) {
          particle.x = Math.max(leftEdge, Math.min(rightEdge, particle.x));
          particle.vx *= -0.75;
        }
        if (particle.y < top || particle.y > bottom) {
          particle.y = Math.max(top, Math.min(bottom, particle.y));
          particle.vy *= -0.75;
        }
      });
    };

    function draw() {
      if (!size) return;
      context.clearRect(0, 0, size, size);

      const gradient = context.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, "rgba(16, 133, 249, 0.075)");
      gradient.addColorStop(1, "rgba(0, 47, 95, 0.018)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);

      if (frameNumber % 12 === 0 || connections.length === 0) refreshConnections();
      const connectionDistance = size / 9;
      connections.forEach(([first, second]) => {
        const a = particles[first];
        const b = particles[second];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        const alpha = Math.max(0, 1 - distance / connectionDistance) * (a.ordered ? 0.12 : 0.16);
        context.strokeStyle = a.ordered ? `rgba(0, 64, 128, ${alpha})` : `rgba(16, 133, 249, ${alpha})`;
        context.lineWidth = 0.7;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
      });

      particles.forEach((particle) => {
        context.fillStyle = particle.ordered ? "rgba(0, 64, 128, 0.76)" : "rgba(16, 133, 249, 0.82)";
        if (particle.influence > 0.35) {
          context.shadowBlur = particle.influence * 8;
          context.shadowColor = particle.ordered ? "rgb(0, 64, 128)" : "rgb(16, 133, 249)";
        }
        context.beginPath();
        context.arc(particle.x, particle.y, particle.ordered ? 2.3 : 2.6, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
      });

      context.strokeStyle = "rgba(16, 133, 249, 0.26)";
      context.lineWidth = 1;
      context.setLineDash([5, 7]);
      context.beginPath();
      context.moveTo(size / 2, size / 14);
      context.lineTo(size / 2, size - 22);
      context.stroke();
      context.setLineDash([]);

      context.fillStyle = "rgba(0, 64, 128, 0.92)";
      context.font = `600 ${Math.max(8, size * 0.027)}px "Inter Variable", sans-serif`;
      context.letterSpacing = `${Math.max(0.8, size * 0.003)}px`;
      context.fillText("STRUCTURED SIGNALS", size * 0.06, size - 17);
      context.fillText("FRAGMENTED INPUTS", size * 0.57, size - 17);
    }

    const animate = () => {
      if (!isVisible || document.hidden || reducedMotion.matches) {
        animationFrame = 0;
        return;
      }
      update();
      frameNumber += 1;
      draw();
      animationFrame = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!animationFrame && isVisible && !document.hidden && !reducedMotion.matches) {
        animationFrame = window.requestAnimationFrame(animate);
      } else if (reducedMotion.matches) {
        draw();
      }
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) startAnimation();
      else if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    }, { threshold: 0.05 });

    const handleMotionPreference = () => {
      if (reducedMotion.matches && animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        draw();
      } else {
        startAnimation();
      }
    };
    const handleDocumentVisibility = () => startAnimation();
    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(canvas);
    visibilityObserver.observe(frame);
    reducedMotion.addEventListener("change", handleMotionPreference);
    document.addEventListener("visibilitychange", handleDocumentVisibility);
    resize();

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      reducedMotion.removeEventListener("change", handleMotionPreference);
      document.removeEventListener("visibilitychange", handleDocumentVisibility);
    };
  }, []);

  const updatePointer = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerRef.current.x = event.clientX - bounds.left;
    pointerRef.current.y = event.clientY - bounds.top;
    pointerRef.current.active = true;
  };

  const resetPointer = () => {
    pointerRef.current = { x: -1000, y: -1000, active: false, pressed: false };
  };

  return (
    <div ref={frameRef} className="group relative aspect-square w-full max-w-[400px] overflow-hidden rounded-3xl border border-border/80 bg-card p-4 shadow-elegant">
      <div className="pointer-events-none absolute left-4 top-4 h-3.5 w-3.5 rounded-tl border-l-2 border-t-2 border-accent/25 transition-colors group-hover:border-accent/60" />
      <div className="pointer-events-none absolute right-4 top-4 h-3.5 w-3.5 rounded-tr border-r-2 border-t-2 border-accent/25 transition-colors group-hover:border-accent/60" />
      <div className="pointer-events-none absolute bottom-4 left-4 h-3.5 w-3.5 rounded-bl border-b-2 border-l-2 border-accent/25 transition-colors group-hover:border-accent/60" />
      <div className="pointer-events-none absolute bottom-4 right-4 h-3.5 w-3.5 rounded-br border-b-2 border-r-2 border-accent/25 transition-colors group-hover:border-accent/60" />
      <canvas
        ref={canvasRef}
        className="block aspect-square w-full touch-pan-y"
        role="img"
        aria-describedby="signals-animation-description"
        onPointerEnter={updatePointer}
        onPointerMove={updatePointer}
        onPointerDown={(event) => {
          updatePointer(event);
          pointerRef.current.pressed = true;
        }}
        onPointerUp={() => { pointerRef.current.pressed = false; }}
        onPointerCancel={resetPointer}
        onPointerLeave={resetPointer}
      />
      <p id="signals-animation-description" className="sr-only">
        An interactive animation contrasts structured Customer Success signals with fragmented inputs. Motion pauses when the graphic is off screen and is disabled when reduced motion is preferred.
      </p>
    </div>
  );
};

export const DataOrchestration = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const current = containerRef.current;
    if (!current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="orchestration" ref={containerRef} className="py-24 lg:py-32 bg-white border-t border-border/60 overflow-hidden relative">
      <div className="absolute top-1/2 left-0 h-96 w-96 rounded-full bg-accent/5 blur-[100px] -translate-y-1/2 pointer-events-none" />
      <div className="container max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className={`motion-reveal min-w-0 lg:col-span-5 flex justify-center order-2 lg:order-1 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <SymmetryGraphic />
          </div>

          <div className={`motion-reveal min-w-0 lg:col-span-7 space-y-8 order-1 lg:order-2 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold">Symmetry and order</p>
              <h2 className="text-4xl md:text-5xl tracking-tight text-foreground text-balance">Bringing symmetry to your Customer Success data</h2>
            </div>

            <p className="text-base text-muted-foreground leading-relaxed font-light">
              Your CRM, support logs, product events and billing history contain the indicators needed to improve retention. We turn fragmented signals into structured health models and usable playbook triggers.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-accent/10 flex items-center justify-center"><GitMerge className="h-5 w-5 text-primary" aria-hidden="true" /></div>
                  <h3 className="font-semibold text-foreground text-sm">Fragmented inputs</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">Ad-hoc customer actions, product usage and support tickets create noise when they are not connected to a consistent operating model.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-accent/10 flex items-center justify-center"><LayoutGrid className="h-5 w-5 text-primary" aria-hidden="true" /></div>
                  <h3 className="font-semibold text-foreground text-sm">Structured outcomes</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">A clear mapping layer turns those signals into health scores, prioritised actions and proactive automation.</p>
              </div>
            </div>

            <div className="pt-4">
              <div className="p-5 rounded-2xl border border-border/80 bg-card flex items-start gap-4 shadow-card">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-medium text-foreground text-sm">Operational rigour</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed font-light">Clean signals in tools such as Dynamics, Gainsight or Salesforce help CSMs move from reactive work to deliberate retention and expansion motions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
