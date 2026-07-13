import { useEffect, useRef, useState } from "react";
import { TrendingDown, TrendingUp, Cpu } from "lucide-react";

const values = [
  {
    icon: TrendingDown,
    title: "Churn Reduction",
    tag: "CHURN",
    description:
      "Identify at-risk accounts before they signal intent. Build metric-based health scores, early warning systems and structured save-motions that protect recurring revenue.",
    points: ["Health scoring", "Risk segmentation", "Save-motion design"],
  },
  {
    icon: TrendingUp,
    title: "Expansion Revenue Strategy",
    tag: "EXPANSION",
    description:
      "Turn adoption signals into upsell and cross-sell pipeline. Design playbooks that align CS, sales and product around quantifiable expansion triggers.",
    points: ["Whitespace mapping", "QBR frameworks", "Expansion triggers"],
  },
  {
    icon: Cpu,
    title: "Infrastructure & Operations",
    tag: "INFRA",
    description:
      "Operationalise Customer Success with the right tooling so your team scales without adding headcount.",
    points: ["Tooling architecture", "Workflow automation", "Reporting layer"],
  },
];

export const ValueProps = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section id="value" ref={sectionRef} className="py-24 lg:py-32 bg-gradient-subtle relative">
      <div className="container max-w-6xl">
        <div className="max-w-2xl mb-16 text-left">
          <div className="text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-3">
            What I deliver
          </div>
          <h2 className="text-4xl md:text-5xl text-foreground text-balance">
            Three core levers
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v, idx) => (
            <div
              key={v.title}
              onMouseMove={handleMouseMove}
              className={`motion-reveal group relative bg-card rounded-3xl p-8 border border-border/80 shadow-card spotlight-card transition-all duration-700 transform ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{
                transitionDelay: `${idx * 150}ms`,
              }}
            >
              <div className="h-12 w-12 rounded-2xl bg-accent/5 flex items-center justify-center mb-8 group-hover:bg-accent/10 group-hover:scale-105 transition-smooth relative z-10">
                <v.icon className="h-5 w-5 text-primary transition-smooth" aria-hidden="true" />
              </div>
              
              <h3 className="text-xl font-medium text-foreground mb-4 relative z-10">
                {v.title}
              </h3>
              
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-light relative z-10">
                {v.description}
              </p>
              
              <ul className="space-y-3 pt-6 border-t border-border/60 relative z-10">
                {v.points.map((p) => (
                  <li
                    key={p}
                    className="text-xs text-foreground flex items-center gap-2.5 font-light"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
