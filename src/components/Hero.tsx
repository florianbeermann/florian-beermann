import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden flex items-center pt-24">
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="absolute top-1/4 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute bottom-0 -left-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="container relative z-10 py-20 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 text-white space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-1.5 text-sm">
            <Sparkles className="h-3.5 w-3.5 text-accent-glow" />
            <span className="text-white/90">Customer Success Consulting</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-balance">
            Scaling with precision.
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
            Data-driven Customer Success frameworks for B2B SaaS. I help
            scale-ups and enterprise teams reduce churn, expand accounts, and
            operationalise CS with measurable outcomes.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button variant="accent" size="xl" asChild>
              <a href="#contact">
                Get a CS Audit
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outlineLight" size="xl" asChild>
              <a href="#services">Explore Services</a>
            </Button>
          </div>

          <div className="flex flex-wrap gap-8 pt-8 border-t border-white/10">
            {[
              { label: "Years in B2B SaaS CS", value: "6+" },
              { label: "Clients advised", value: "100+" },
              { label: "Focus", value: "NRR & Expansion" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs uppercase tracking-wider text-white/50 mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
          <div className="relative w-48 md:w-56 aspect-[4/5] rounded-2xl overflow-hidden shadow-elegant border border-white/10">
            <img
              src={new URL("../assets/florian-portrait.png", import.meta.url).href}
              alt="Florian Beermann, Customer Success consultant"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
          </div>

          {/* Floating metric card */}
          <div className="absolute -bottom-6 left-0 lg:-left-6 bg-background rounded-xl shadow-elegant p-5 border border-border max-w-[240px] hidden md:block">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Outcome focus</div>
                <div className="text-sm font-semibold text-foreground">
                  Higher NRR, lower churn while keeping operations efficient
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
