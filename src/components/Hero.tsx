import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { RevealText } from "@/components/ui/RevealText";
import { Magnetic } from "@/components/ui/Magnetic";

export const Hero = () => {
  const portraitRef = useRef<HTMLDivElement>(null);
  
  const targetRot = useRef({ x: 0, y: 0, scale: 1 });
  const currentRot = useRef({ x: 0, y: 0, scale: 1 });

  useEffect(() => {
    const card = portraitRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      
      targetRot.current.x = -(y / (height / 2)) * 10;
      targetRot.current.y = (x / (width / 2)) * 10;
      targetRot.current.scale = 1.04;
    };

    const handleMouseLeave = () => {
      targetRot.current.x = 0;
      targetRot.current.y = 0;
      targetRot.current.scale = 1;
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    // Frame interpolation loop (Spring / Lerp)
    let animId: number;
    const tick = () => {
      const ease = 0.08; // Small value = smoother lag/spring effect
      currentRot.current.x += (targetRot.current.x - currentRot.current.x) * ease;
      currentRot.current.y += (targetRot.current.y - currentRot.current.y) * ease;
      currentRot.current.scale += (targetRot.current.scale - currentRot.current.scale) * ease;

      if (card) {
        card.style.transform = `perspective(1000px) rotateX(${currentRot.current.x}deg) rotateY(${currentRot.current.y}deg) scale3d(${currentRot.current.scale}, ${currentRot.current.scale}, 1)`;
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden flex items-center pt-28">
      {/* Decorative background grid */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(210 95% 52% / 0.15) 1px, transparent 1px), linear-gradient(to bottom, hsl(210 95% 52% / 0.15) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(circle at center, white, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle at center, white, transparent 75%)",
        }}
      />
      <div className="absolute top-1/4 -right-32 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -left-32 h-[500px] w-[500px] rounded-full bg-accent-glow/5 blur-[120px] pointer-events-none" />

      <div className="container max-w-6xl relative z-10 py-16 grid lg:grid-cols-12 gap-16 items-center">
        {/* Left Column: Copy */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="space-y-4">
            <div className="text-5xl md:text-6xl lg:text-7xl font-extralight leading-[1.05] tracking-tighter text-foreground">
              <RevealText text="Scaling with" className="font-extralight text-foreground inline-block" delay={100} />
              <div className="mt-2 text-accent">
                <span className="font-garamond italic font-medium">precision</span>
              </div>
            </div>
          </div>

          <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed font-light">
            Data-driven Customer Success frameworks for B2B SaaS. I help
            scale-ups and enterprise teams reduce churn, expand accounts, and
            operationalise CS with measurable outcomes.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Magnetic>
              <Button
                variant="outline"
                size="xl"
                className="rounded-full border-border/80 hover:border-accent hover:bg-accent/5 font-medium uppercase tracking-wider text-xs px-8 py-6 h-auto text-foreground hover:text-foreground"
                asChild
              >
                <a href="#services">Explore Services</a>
              </Button>
            </Magnetic>
          </div>

          {/* Staggered stats grid */}
          <div className="flex flex-wrap gap-12 pt-8 border-t border-border/60">
            {[
              { label: "Years in B2B SaaS CS", value: "6+" },
              { label: "Clients advised", value: "100+" },
              { label: "Focus", value: "NRR & Expansion" },
            ].map((s, idx) => (
              <div key={s.label} className="space-y-1">
                <div 
                  className="text-3xl font-extralight tracking-tight text-foreground transition-all duration-1000"
                  style={{
                    animation: `reveal-up 1s cubic-bezier(0.16, 1, 0.3, 1) ${300 + idx * 100}ms both`
                  }}
                >
                  {s.value}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Profile Picture */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[340px] aspect-[3/4] group">
            {/* Interactive Portrait frame */}
            <div
              ref={portraitRef}
              className="relative w-full h-full rounded-[2rem] overflow-hidden border border-border shadow-elegant"
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              <img
                src={new URL("../assets/florian-portrait.png", import.meta.url).href}
                alt="Florian Beermann, Customer Success consultant"
                className="absolute inset-0 h-full w-full object-cover scale-105 group-hover:scale-100 transition-all duration-700 ease-out pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Glowing card border shadows behind */}
            <div className="absolute -inset-2 bg-gradient-to-r from-accent to-accent-glow rounded-[2.2rem] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 pointer-events-none z-[-1]" />

            {/* Floating outcome badge */}
            <div 
              className="absolute -bottom-6 -left-6 bg-background/95 backdrop-blur-md rounded-2xl shadow-elegant p-5 border border-border/60 max-w-[240px] hidden md:block transition-all duration-300 group-hover:translate-x-2 group-hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Outcome focus</div>
                  <div className="text-xs font-medium text-foreground leading-tight mt-0.5">
                    Higher NRR, lower churn while keeping operations efficient.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
