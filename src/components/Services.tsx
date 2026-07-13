import { useEffect, useRef, useState } from "react";
import { Compass, BookOpen, Users, ArrowUpRight } from "lucide-react";

const services = [
  {
    icon: Compass,
    title: "Customer Success Strategy",
    tagline: "From reactive support to revenue-aligned function.",
    tag: "STRATEGY",
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
    tag: "PLAYBOOKS",
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
    tag: "TRAINING",
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
    <section id="services" ref={sectionRef} className="py-24 lg:py-32 bg-slate-50/50 border-y border-border/60 relative overflow-hidden">
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />
      <div className="container max-w-6xl relative">
        <div className="max-w-2xl mb-16 text-left">
          <div className="text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-3">
            Engagements
          </div>
          <h2 className="text-4xl md:text-5xl text-balance text-foreground">
            Detailed engagements built around your retention curve
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div
              key={s.title}
              onMouseMove={handleMouseMove}
              className={`motion-reveal group relative bg-card border border-border/80 rounded-3xl p-8 shadow-card spotlight-card transition-all duration-700 transform ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <div className="absolute top-6 right-6 text-[10px] font-mono text-muted-foreground/30">
                0{i + 1}
              </div>
              
              <div className="h-12 w-12 rounded-2xl bg-accent flex items-center justify-center mb-8 shadow-accent relative z-10">
                <s.icon className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
              </div>
              
              <h3 className="text-2xl mb-2 text-foreground relative z-10 font-medium">{s.title}</h3>
              
              <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-4 relative z-10">
                {s.tagline}
              </p>
              
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-light relative z-10">
                {s.description}
              </p>
              
              <div className="pt-6 border-t border-border/60 relative z-10">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold mb-3">
                  Typical deliverables
                </div>
                <ul className="space-y-2.5">
                  {s.deliverables.map((d) => (
                    <li key={d} className="text-xs text-muted-foreground flex items-start gap-2 font-light">
                      <ArrowUpRight className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
