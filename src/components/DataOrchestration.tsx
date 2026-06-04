import { useEffect, useRef, useState } from "react";
import { ShieldCheck, GitMerge, LayoutGrid, Cpu } from "lucide-react";

interface SymmetryCanvasProps {
  size?: number;
}

export const SymmetryCanvas = ({ size = 400 }: SymmetryCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    // Florian Beermann & Partners Brand Colors
    // Navy: hsl(210, 100%, 18.6%) -> rgb(0, 47, 95)
    // Accent Blue: hsl(210, 95%, 52%) -> rgb(16, 133, 249)
    const colorGrid = { r: 0, g: 47, b: 95 };
    const colorMoving = { r: 16, g: 133, b: 249 };

    class Particle {
      x: number;
      y: number;
      size: number;
      isOrdered: boolean;
      velocity: { x: number; y: number };
      originalX: number;
      originalY: number;
      influence: number;
      neighbors: Particle[];

      constructor(x: number, y: number, isOrdered: boolean) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.size = 2.5;
        this.isOrdered = isOrdered;
        this.velocity = {
          x: (Math.random() - 0.5) * 1.5,
          y: (Math.random() - 0.5) * 1.5,
        };
        this.influence = 0;
        this.neighbors = [];
      }

      update() {
        if (this.isOrdered) {
          // Ordered grid on the left
          const dx = this.originalX - this.x;
          const dy = this.originalY - this.y;
          const pushForce = { x: 0, y: 0 };

          this.neighbors.forEach((neighbor) => {
            if (!neighbor.isOrdered) {
              const distance = Math.hypot(this.x - neighbor.x, this.y - neighbor.y);
              const limit = 80;
              if (distance < limit) {
                const force = Math.max(0, 1 - distance / limit);
                // Grid wiggles in response to moving particles
                pushForce.x += neighbor.velocity.x * force * 1.2;
                pushForce.y += neighbor.velocity.y * force * 1.2;
                this.influence = Math.max(this.influence, force);
              }
            }
          });

          // Move back to anchor point, blended with push force
          this.x += 0.06 * dx * (1 - this.influence) + pushForce.x * this.influence;
          this.y += 0.06 * dy * (1 - this.influence) + pushForce.y * this.influence;
          this.influence *= 0.96;
        } else {
          // Fragmented random particles on the right
          this.velocity.x += (Math.random() - 0.5) * 0.5;
          this.velocity.y += (Math.random() - 0.5) * 0.5;
          
          // Friction / Speed limit matching original
          this.velocity.x *= 0.95;
          this.velocity.y *= 0.95;
          
          this.x += this.velocity.x;
          this.y += this.velocity.y;

          // Boundaries constraints matching original
          if (this.x < size / 2 || this.x > size) this.velocity.x *= -1;
          if (this.y < 0 || this.y > size) this.velocity.y *= -1;

          this.x = Math.max(size / 2, Math.min(size, this.x));
          this.y = Math.max(0, Math.min(size, this.y));
        }
      }

      draw(c: CanvasRenderingContext2D) {
        // Change transparency and colors dynamically based on state
        const opacity = this.isOrdered ? 0.75 - 0.35 * this.influence : 0.7;
        const color = this.isOrdered ? colorGrid : colorMoving;

        c.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
        c.beginPath();
        c.arc(this.x, this.y, this.isOrdered ? this.size : this.size * 0.8, 0, 2 * Math.PI);
        c.fill();
      }
    }

    const particles: Particle[] = [];
    const columns = 25;
    const rows = 25;
    const step = size / columns;

    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows; r++) {
        const x = step * c + step / 2;
        const y = step * r + step / 2;
        const isOrdered = x < size / 2;
        particles.push(new Particle(x, y, isOrdered));
      }
    }

    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, size, size);
      
      // Update neighbors periodically for connectivity lines (fixed nested loop bug)
      if (frame % 30 === 0) {
        particles.forEach((p) => {
          p.neighbors = particles.filter(
            (o) => o !== p && Math.hypot(p.x - o.x, p.y - o.y) < 100
          );
        });
      }

      particles.forEach((p) => {
        p.update();
        p.draw(ctx);

        p.neighbors.forEach((n) => {
          const d = Math.hypot(p.x - n.x, p.y - n.y);
          const maxDistance = 45;
          if (d < maxDistance) {
            const alpha = 0.12 * (1 - d / maxDistance);
            // Blend colors of connecting lines
            const lineCol = p.isOrdered ? colorGrid : colorMoving;
            ctx.strokeStyle = `rgba(${lineCol.r}, ${lineCol.g}, ${lineCol.b}, ${alpha})`;
            ctx.lineWidth = 0.55;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        });
      });

      // Central symmetry boundary line
      ctx.strokeStyle = "rgba(0, 47, 95, 0.08)";
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(size / 2, 0);
      ctx.lineTo(size / 2, size);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      frame++;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size]);

  return (
    <div className="relative aspect-square w-full max-w-[400px] flex items-center justify-center bg-accent/[0.01] rounded-3xl border border-border/40 p-4 shadow-card">
      {/* Decorative corners */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-accent/20 rounded-tl" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-accent/20 rounded-tr" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-accent/20 rounded-bl" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-accent/20 rounded-br" />
      
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export const DataOrchestration = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section
      id="orchestration"
      ref={containerRef}
      className="py-24 lg:py-32 bg-[#FAFAFA] border-t border-border overflow-hidden relative"
    >
      {/* Background radial accent glow */}
      <div className="absolute top-1/2 left-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="container max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Column 1: Visual Interactive Canvas */}
          <div
            className={`lg:col-span-5 flex justify-center order-2 lg:order-1 transition-all duration-1000 transform ${
              isVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-95"
            }`}
          >
            <SymmetryCanvas size={380} />
          </div>

          {/* Column 2: Content Details */}
          <div
            className={`lg:col-span-7 space-y-8 order-1 lg:order-2 transition-all duration-1000 delay-100 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
                Bringing symmetry to your <span className="text-accent">Customer Success data</span>
              </h2>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Your CRM, support logs, product events and billing history contain the indicators needed to scale NRR. We turn fragmented data signals into clean, structured playbook executions.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                    <GitMerge className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground">Fragmented Inputs</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ad-hoc customer actions, product usage telemetries, and support tickets wander unpredictably. Unmanaged, they create noise and delay response times.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                    <LayoutGrid className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground">Symmetrical Outcomes</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We build the mapping layers that capture these signals, structuring them into predictable customer health scores and proactive automation triggers.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <div className="p-4 rounded-xl border border-border bg-card/50 flex items-start gap-4">
                <ShieldCheck className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground text-sm">Operational Rigour</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    By feeding clean signals into tools like Dynamics, Gainsight or Salesforce, your CSM team shifts from reactive firefighting to high-value expansion motions
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
