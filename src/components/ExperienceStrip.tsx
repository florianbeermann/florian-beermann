const experience = ["Microsoft", "Personio", "Spendesk", "HubSpot", "Capgemini"];

export const ExperienceStrip = () => (
  <section aria-labelledby="experience-heading" className="border-y border-border/70 bg-card py-10">
    <div className="container max-w-6xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p id="experience-heading" className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Selected experience
          </p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Experience developed in Customer Success, commercial and transformation roles at established enterprise and scale-up organisations.
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-7 gap-y-3" aria-label="Previous employers">
          {experience.map((company) => (
            <li key={company} className="text-base font-medium tracking-tight text-foreground">
              {company}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
