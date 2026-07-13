import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { RevealText } from "@/components/ui/RevealText";

const highlights = [
  "Customer Success Account Manager at Microsoft, supporting large enterprise accounts across cloud adoption, AI and modern work.",
  "Former Customer Success Manager at Personio, owning a portfolio of large corporate accounts focused on adoption, retention and expansion.",
  "Previously at Spendesk, partnering with high-value fintech clients on data-driven success plans and onboarding optimisation.",
  "Background spanning enterprise sales development at HubSpot and project portfolio management at Capgemini.",
];

const stack = [
  "Salesforce", "Gainsight", "HubSpot", "Dynamics",
  "PowerBI", "Looker", "Tableau", "Vitally",
];

export const About = () => {
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

  return (
    <section id="about" ref={sectionRef} className="py-24 lg:py-32 bg-background relative">
      <div className="container max-w-4xl space-y-12 text-left">
        <div className="space-y-6">
          <div className="text-xs uppercase tracking-[0.18em] text-primary font-semibold">
            About me
          </div>
          <h2 className="text-4xl md:text-5xl text-foreground text-balance">
            <RevealText text="Customer Success strategist for B2B SaaS" delay={100} />
          </h2>
          <p 
            className={`motion-reveal text-base text-muted-foreground leading-relaxed font-light transition-all duration-700 delay-200 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            I help SaaS companies turn Customer Success into a measurable
            revenue engine. My career has been built inside category-defining
            organisations - from hyperscale cloud at Microsoft, to
            high-growth scale-ups like Personio, Spendesk and HubSpot - with
            a consistent focus on retention, expansion and operational rigour.
          </p>
          <p 
            className={`motion-reveal text-base text-muted-foreground leading-relaxed font-light transition-all duration-700 delay-300 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            I advise CS leaders on building data-driven frameworks that
            stand up under restructuring, rapid growth or shifting market
            conditions. My approach is pragmatic, metrics-led and grounded
            in years of carrying retention and expansion targets myself.
          </p>
        </div>

        <ul className="space-y-5">
          {highlights.map((h, i) => (
            <li 
              key={h} 
              className={`motion-reveal flex gap-4 items-start transition-all duration-700 transform ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: `${500 + i * 100}ms`
              }}
            >
              <div className="mt-1 h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              </div>
              <span className="text-foreground text-sm leading-relaxed font-light">{h}</span>
            </li>
          ))}
        </ul>

        <div 
          className={`motion-reveal pt-10 border-t border-border/60 transition-all duration-700 delay-700 transform ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="mb-8 rounded-2xl border border-primary/15 bg-primary/[0.035] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Partner model</div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              A curated network of independent specialists across CS Operations, data, tooling and enablement joins engagements when needed.
            </p>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-5">
            Tooling fluency
          </div>
          <div className="flex flex-wrap gap-2.5">
            {stack.map((s) => (
              <span
                key={s}
                className="px-4 py-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-secondary-foreground text-xs font-semibold border border-border/60 transition-smooth"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
