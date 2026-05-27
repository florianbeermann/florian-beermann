import { Compass, BookOpen, Users, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Compass,
    title: "Customer Success Strategy",
    tagline: "From reactive support to revenue-aligned function.",
    description:
      "A diagnostic of your current Customer Success motion across segmentation, coverage model, health scoring and renewal forecasting - followed by a phased roadmap aligned to NRR and gross retention targets.",
    deliverables: [
      "Segmentation & coverage model",
      "Health-score architecture",
      "Renewal & expansion forecasting",
      "12-month execution roadmap",
    ],
  },
  {
    icon: BookOpen,
    title: "Playbook Development",
    tagline: "Repeatable motions for every lifecycle stage.",
    description:
      "Build the operational backbone of your CS team: onboarding, adoption, escalation, renewal and expansion playbooks - codified, instrumented in your tooling and tied to measurable outcomes.",
    deliverables: [
      "Onboarding & time-to-value plays",
      "Risk & save-motion playbooks",
      "QBR and EBR frameworks",
      "Expansion qualification model",
    ],
  },
  {
    icon: Users,
    title: "CSM Training",
    tagline: "Equip CSMs to act like strategic partners.",
    description:
      "Hands-on enablement for individual contributors and team leads - covering commercial conversations, value-realisation storytelling, stakeholder mapping and data-led account planning.",
    deliverables: [
      "Commercial conversation framework",
      "Stakeholder mapping workshops",
      "Value realisation storytelling",
      "Account-plan certification",
    ],
  },
];

export const Services = () => {
  return (
    <section id="services" className="py-24 lg:py-32 bg-slate-50 border-y border-border relative overflow-hidden">
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      <div className="container relative">
        <div className="max-w-2xl mb-16">
          <div className="inline-block text-xs font-semibold uppercase tracking-wider text-accent mb-4">
            Engagements
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-balance text-foreground">
            Detailed engagements built around{" "}
            <span className="text-accent">your retention curve</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="group relative bg-card border border-border rounded-2xl p-8 shadow-card hover:border-accent/40 hover:shadow-elegant transition-smooth"
            >
              <div className="absolute top-6 right-6 text-xs font-mono text-muted-foreground/30">
                0{i + 1}
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-accent flex items-center justify-center mb-6 shadow-accent">
                <s.icon className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-foreground">{s.title}</h3>
              <p className="text-accent text-sm font-medium mb-4">
                {s.tagline}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {s.description}
              </p>
              <div className="pt-6 border-t border-border">
                <div className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-3">
                  Typical deliverables
                </div>
                <ul className="space-y-2">
                  {s.deliverables.map((d) => (
                    <li key={d} className="text-sm text-muted-foreground flex items-start gap-2">
                      <ArrowUpRight className="h-3.5 w-3.5 text-accent mt-1 flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button variant="accent" size="xl" asChild>
            <a href="#contact">Discuss your engagement</a>
          </Button>
        </div>
      </div>
    </section>
  );
};
