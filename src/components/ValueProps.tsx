import { TrendingDown, TrendingUp, Cog } from "lucide-react";

const values = [
  {
    icon: TrendingDown,
    title: "Churn Reduction",
    description:
      "Identify at-risk accounts before they signal intent. Build metric-based health scores, early warning systems and structured save-motions that protect recurring revenue.",
    points: ["Health scoring", "Risk segmentation", "Save-motion design"],
  },
  {
    icon: TrendingUp,
    title: "Expansion Revenue Strategy",
    description:
      "Turn adoption signals into upsell and cross-sell pipeline. Design playbooks that align CS, sales and product around quantifiable expansion triggers.",
    points: ["Whitespace mapping", "QBR frameworks", "Expansion triggers"],
  },
  {
    icon: Cog,
    title: "CS Ops & Automation",
    description:
      "Operationalise Customer Success with the right tooling so your team scales without adding headcount.",
    points: ["Tooling architecture", "Workflow automation", "Reporting layer"],
  },
];

export const ValueProps = () => {
  return (
    <section id="value" className="py-24 lg:py-32 bg-gradient-subtle">
      <div className="container">
        <div className="max-w-2xl mb-16">
          <div className="inline-block text-xs font-semibold uppercase tracking-wider text-accent mb-4">
            What I deliver
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
            Three core levers
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="group relative bg-card rounded-2xl p-8 border border-border shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-1"
            >
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:scale-110 transition-smooth">
                <v.icon className="h-6 w-6 text-accent group-hover:text-accent-foreground transition-smooth" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {v.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {v.description}
              </p>
              <ul className="space-y-2 pt-6 border-t border-border">
                {v.points.map((p) => (
                  <li
                    key={p}
                    className="text-sm text-foreground flex items-center gap-2"
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
