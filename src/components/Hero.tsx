import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { RevealText } from "@/components/ui/RevealText";

export const Hero = () => (
  <section className="relative min-h-screen overflow-hidden bg-gradient-hero pt-28 flex items-center">
    <div
      className="absolute inset-0 opacity-[0.35] pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(to right, hsl(210 95% 52% / 0.15) 1px, transparent 1px), linear-gradient(to bottom, hsl(210 95% 52% / 0.15) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        maskImage: "radial-gradient(circle at center, white, transparent 75%)",
        WebkitMaskImage: "radial-gradient(circle at center, white, transparent 75%)",
      }}
      aria-hidden="true"
    />
    <div className="absolute top-1/4 -right-32 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
    <div className="absolute bottom-0 -left-32 h-[500px] w-[500px] rounded-full bg-accent-glow/5 blur-[120px] pointer-events-none" />

    <div className="container max-w-6xl relative z-10 py-16 grid lg:grid-cols-12 gap-16 items-center">
      <div className="lg:col-span-7 min-w-0 space-y-8 text-left">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight leading-[1.05] tracking-tighter text-foreground">
          <RevealText text="Scaling with" className="font-extralight text-foreground inline-flex" delay={100} />
          {" "}
          <span className="mt-2 block text-accent font-garamond italic font-medium">precision</span>
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed font-light">
          I help B2B SaaS leaders build measurable retention and expansion
          motions through practical CS strategy, lifecycle playbooks and
          operations that teams can run with confidence.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <Button size="xl" className="rounded-full px-8 py-6 h-auto uppercase tracking-wider text-xs" asChild>
            <a href="#contact">Discuss your priorities</a>
          </Button>
          <Button
            variant="outline"
            size="xl"
            className="rounded-full border-border/80 hover:border-primary hover:bg-primary/5 font-medium uppercase tracking-wider text-xs px-8 py-6 h-auto text-foreground hover:text-foreground"
            asChild
          >
            <a href="#services">Explore services</a>
          </Button>
        </div>

        <div className="flex flex-wrap gap-x-10 gap-y-7 pt-8 border-t border-border/60">
          {[
            { label: "Years in B2B SaaS CS", value: "6+" },
            { label: "Experience", value: "Enterprise & scale-up" },
            { label: "Focus", value: "Retention & expansion" },
          ].map((item, index) => (
            <div key={item.label} className="space-y-1">
              <div
                className="text-2xl md:text-3xl font-extralight tracking-tight text-foreground"
                style={{ animation: `reveal-up 1s cubic-bezier(0.16, 1, 0.3, 1) ${300 + index * 100}ms both` }}
              >
                {item.value}
              </div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5 min-w-0 flex justify-center lg:justify-end">
        <div className="relative w-full max-w-[340px] aspect-[3/4] group">
          <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-border shadow-elegant transition-transform duration-500 ease-out group-hover:-translate-y-1">
            <img
              src="/florian-portrait.jpg"
              alt="Florian Beermann, Customer Success consultant"
              width="680"
              height="1021"
              className="absolute inset-0 h-full w-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="absolute -bottom-6 -left-6 bg-background/95 backdrop-blur-md rounded-2xl shadow-elegant p-5 border border-border/60 max-w-[240px] hidden md:block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Outcome focus</div>
                <div className="text-xs font-medium text-foreground leading-tight mt-0.5">
                  Stronger retention and expansion with efficient operations.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
