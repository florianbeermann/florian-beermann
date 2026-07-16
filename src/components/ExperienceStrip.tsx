const experience = [
  { name: "Microsoft", logo: "/company-logos/microsoft.png" },
  { name: "Capgemini", logo: "/company-logos/capgemini.png" },
  { name: "HubSpot", logo: "/company-logos/hubspot.svg" },
  { name: "Personio", logo: "/company-logos/personio.png" },
  { name: "Spendesk", logo: "/company-logos/spendesk.svg" },
];

export const ExperienceStrip = () => (
  <section aria-labelledby="experience-heading" className="border-y border-border/70 bg-card py-10">
    <div className="container max-w-6xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="lg:max-w-[420px]">
          <p id="experience-heading" className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Selected experience
          </p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Experience developed in Customer Success, commercial and transformation roles at established enterprise and scale-up organisations.
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-7 gap-y-3 lg:flex-nowrap lg:justify-end lg:gap-x-5" aria-label="Previous employers">
          {experience.map((company) => (
            <li key={company.name} className="flex items-center gap-2.5 text-base font-medium tracking-tight text-foreground">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/70 bg-white shadow-sm" aria-hidden="true">
                <img src={company.logo} alt="" width="64" height="64" loading="lazy" decoding="async" className="h-4 w-4 object-contain" />
              </span>
              {company.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
