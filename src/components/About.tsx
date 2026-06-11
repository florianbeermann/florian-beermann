import { CheckCircle2 } from "lucide-react";

const highlights = [
  "Customer Success Account Manager at Microsoft, supporting Strategic 500 enterprise clients on cloud adoption, AI and modern work.",
  "Former Customer Success Manager at Personio, owning a portfolio of large corporate accounts focused on adoption, retention and expansion.",
  "Previously at Spendesk, partnering with high-value fintech clients on data-driven success plans and onboarding optimisation.",
  "Background spanning enterprise sales development at HubSpot and project portfolio management at Capgemini.",
];

const stack = [
  "Salesforce", "Gainsight", "HubSpot", "Dynamics",
  "PowerBI", "Looker", "Tableau", "Vitally",
];

export const About = () => {
  return (
    <section id="about" className="py-24 lg:py-32 bg-background">
      <div className="container max-w-4xl space-y-8">
          <div>
            <div className="inline-block text-xs font-semibold uppercase tracking-wider text-accent mb-4">
              About me
            </div>
            <h2 className="text-4xl md:text-5xl text-foreground text-balance mb-6">
              Customer Success strategist for B2B SaaS
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I help SaaS companies turn Customer Success into a measurable
              revenue engine. My career has been built inside category-defining
              organisations - from hyperscale cloud at Microsoft, to
              high-growth scale-ups like Personio, Spendesk and HubSpot - with
              a consistent focus on retention, expansion and operational rigour.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              I advise CS leaders on building data-driven frameworks that
              stand up under restructuring, rapid growth or shifting market
              conditions. My approach is pragmatic, metrics-led and grounded
              in years of carrying retention and expansion targets myself.
            </p>
          </div>

          <ul className="space-y-4">
            {highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>

          <div className="pt-8 border-t border-border">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
              Tooling fluency
            </div>
            <div className="flex flex-wrap gap-2">
              {stack.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium border border-border"
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
