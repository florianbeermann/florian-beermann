import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { setPageMetadata } from "@/lib/metadata";
import "./Home.css";

const portraitSrcSet = [
  "/florian-portrait-440.webp 440w",
  "/florian-portrait-660.webp 660w",
  "/florian-portrait-880.webp 880w",
].join(", ");
const portraitFallback = "/florian-portrait-880.jpg";

const employers = [
  { name: "Microsoft", logo: "/company-logos/microsoft.png" },
  { name: "Capgemini", logo: "/company-logos/capgemini.png" },
  { name: "HubSpot", logo: "/company-logos/hubspot.svg" },
  { name: "Personio", logo: "/company-logos/personio.png" },
  { name: "Spendesk", logo: "/company-logos/spendesk.svg" },
];

const engagements = [
  {
    number: "01",
    title: "Customer Success strategy",
    summary:
      "A clear operating model for teams that have outgrown reactive account management.",
    detail:
      "We examine segmentation, coverage, health scoring, renewal forecasting and the hand-offs between CS, sales and product. The result is a practical roadmap tied to retention and expansion targets.",
    deliverables: [
      "Segmentation and coverage model",
      "Health-score architecture",
      "Renewal and expansion forecasting",
      "12-month execution roadmap",
    ],
  },
  {
    number: "02",
    title: "Lifecycle playbooks",
    summary:
      "Repeatable customer motions your team can actually run in its existing tools.",
    detail:
      "We turn onboarding, adoption, risk, renewal and expansion into explicit plays, with owners, triggers, actions and measures of success.",
    deliverables: [
      "Onboarding and time-to-value",
      "Risk and save motions",
      "QBR and EBR frameworks",
      "Expansion qualification",
    ],
  },
  {
    number: "03",
    title: "CSM enablement",
    summary:
      "Hands-on training for more commercial, credible customer conversations.",
    detail:
      "Practical workshops help CSMs connect product usage to business value, map stakeholders and lead account planning with better evidence.",
    deliverables: [
      "Commercial conversation framework",
      "Stakeholder mapping workshops",
      "Value-realisation storytelling",
      "Account-plan certification",
    ],
  },
];

const experience = [
  {
    company: "Microsoft",
    context:
      "Supported enterprise customers across cloud adoption, AI and modern work.",
  },
  {
    company: "Capgemini",
    context:
      "Coordinated project portfolios and transformation work across complex organisations.",
  },
  {
    company: "HubSpot",
    context:
      "Developed commercial experience in B2B SaaS sales and customer conversations.",
  },
  {
    company: "Personio",
    context:
      "Worked with large corporate accounts on adoption, retention and expansion.",
  },
  {
    company: "Spendesk",
    context:
      "Improved fintech onboarding and built data-led customer success plans.",
  },
];

const tools = [
  "Salesforce",
  "Gainsight",
  "HubSpot",
  "Dynamics",
  "Power BI",
  "Looker",
  "Tableau",
  "Vitally",
];

const contactEmail = "hello@florianbeermann.com";

export default function Home() {
  const [submitting, setSubmitting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [size, setSize] = useState("");
  const [tooling, setTooling] = useState("");

  useEffect(() => {
    setPageMetadata({
      title: "florian beermann & partners",
      description:
        "Customer Success strategy, lifecycle playbooks and CSM enablement for B2B SaaS teams focused on retention and expansion.",
      path: "/",
    });
  }, []);

  const openEmailFallback = (formData: FormData) => {
    const subject = encodeURIComponent(
      `Customer Success priorities — ${formData.get("company") || "website enquiry"}`,
    );
    const body = encodeURIComponent(
      [
        `Name: ${formData.get("name") || ""}`,
        `Work email: ${formData.get("email") || ""}`,
        `Company: ${formData.get("company") || ""}`,
        size ? `Company size: ${size}` : "",
        tooling ? `Current tooling: ${tooling}` : "",
        "",
        String(formData.get("message") || ""),
      ]
        .filter(Boolean)
        .join("\n"),
    );
    window.location.assign(
      `mailto:${contactEmail}?subject=${subject}&body=${body}`,
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY?.trim();

    if (!accessKey) {
      toast.info("Opening your email app so you can send this request directly.");
      openEmailFallback(formData);
      return;
    }

    setSubmitting(true);
    formData.set("size", size);
    formData.set("tooling", tooling);
    formData.set("access_key", accessKey);
    formData.set("from_name", "florian beermann & partners website");
    formData.set(
      "subject",
      `New website enquiry from ${formData.get("name") || "a visitor"}`,
    );

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Form submission failed");
      }

      toast.success("Thank you. I’ll respond within two business days.");
      form.reset();
      setSize("");
      setTooling("");
      setShowDetails(false);
    } catch (error) {
      console.error(error);
      toast.error(
        `Something went wrong. Please email ${contactEmail} directly.`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="site-page">
      <a className="site-skip" href="#site-main">
        Skip to main content
      </a>

      <header className="site-header">
        <a className="site-brand" href="#top" aria-label="Home">
          <img src="/logo.png" alt="" width="34" height="34" />
          <span>
            <strong>florian beermann</strong>
            <small>&amp; partners</small>
          </span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#engagements">Engagements</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="site-main">
        <section id="top" className="home-hero" aria-label="Introduction">
          <div className="home-hero-copy">
            <h1>
              Customer Success systems <span>that protect revenue.</span>
            </h1>
            <p className="home-intro">
              I help B2B SaaS leaders turn retention and expansion goals into
              practical operating models, lifecycle playbooks and measurable
              day-to-day work.
            </p>
            <div className="home-actions">
              <a className="home-primary-action" href="#contact">
                Discuss your priorities
              </a>
            </div>
            <p className="home-hero-proof">
              6+ years across enterprise and scale-up B2B SaaS.
            </p>
          </div>

          <figure className="home-portrait">
            <div className="home-portrait-frame">
              <img
                src={portraitFallback}
                srcSet={portraitSrcSet}
                sizes="(max-width: 768px) 90vw, (max-width: 900px) 290px, 440px"
                alt="Florian Beermann, Customer Success consultant"
                width="880"
                height="1322"
                decoding="async"
                {...{ fetchpriority: "high" }}
              />
            </div>
          </figure>
        </section>

        <section className="home-proof" aria-labelledby="proof-title">
          <div className="home-proof-heading">
            <h2 id="proof-title">Experience on both sides of scale</h2>
            <p>
              Enterprise discipline, scale-up pace and first-hand ownership of
              retention and expansion targets.
            </p>
          </div>

          <ul className="home-employers" aria-label="Previous employers">
            {employers.map((employer) => (
              <li key={employer.name}>
                <img src={employer.logo} alt="" />
                {employer.name}
              </li>
            ))}
          </ul>

          <dl className="home-facts">
            <div>
              <dt>6+ years</dt>
              <dd>in B2B SaaS Customer Success</dd>
            </div>
            <div>
              <dt>Enterprise &amp; scale-up</dt>
              <dd>operating experience</dd>
            </div>
            <div>
              <dt>Retention &amp; expansion</dt>
              <dd>commercial focus</dd>
            </div>
          </dl>
        </section>

        <section
          id="engagements"
          className="home-engagements home-section"
        >
          <header className="home-section-heading">
            <p>How I help</p>
            <h2>Three focused engagements</h2>
            <span>
              Each engagement is shaped around the operating problem, not a
              generic transformation package.
            </span>
          </header>

          <div className="home-engagement-list">
            {engagements.map((engagement) => (
              <article className="home-engagement" key={engagement.number}>
                <span className="home-engagement-number">
                  {engagement.number}
                </span>
                <div className="home-engagement-title">
                  <h3>{engagement.title}</h3>
                  <p>{engagement.summary}</p>
                </div>
                <div className="home-engagement-detail">
                  <p>{engagement.detail}</p>
                  <ul>
                    {engagement.deliverables.map((deliverable) => (
                      <li key={deliverable}>{deliverable}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-method">
          <div className="home-method-inner">
            <header>
              <p>From data to action</p>
              <h2>Customer signals only matter when they change the work.</h2>
            </header>
            <div className="home-signal-flow" role="list">
              <div role="listitem">
                <span>01</span>
                <h3>Signals</h3>
                <p>Usage, support, billing and relationship data</p>
              </div>
              <div role="listitem">
                <span>02</span>
                <h3>Decisions</h3>
                <p>Health, risk, opportunity and next-best action</p>
              </div>
              <div role="listitem">
                <span>03</span>
                <h3>Plays</h3>
                <p>Owned workflows with triggers and clear outcomes</p>
              </div>
              <div role="listitem">
                <span>04</span>
                <h3>Measures</h3>
                <p>Adoption, retention, expansion and team capacity</p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="home-about home-section">
          <header className="home-section-heading">
            <p>About</p>
            <h2>Pragmatic advice, grounded in operating experience.</h2>
          </header>

          <div className="home-about-grid">
            <div className="home-about-copy">
              <p className="home-about-lead">
                I have built my career inside organisations ranging from
                hyperscale technology businesses to fast-moving SaaS
                scale-ups.
              </p>
              <p>
                That means I understand the tension between a framework that
                looks convincing in a presentation and one a busy team can
                actually use. My work is metrics-led, commercially aware and
                designed to survive shifting priorities.
              </p>
            </div>

            <aside className="home-about-note">
              When an engagement needs deeper CS Operations, data, tooling or
              enablement expertise, I bring in a small network of independent
              specialists.
            </aside>

            <ol className="home-experience-list">
              {experience.map((item) => (
                <li key={item.company}>
                  <span>{item.company}</span>
                  <p>{item.context}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="home-tools">
            <strong>Tooling fluency</strong>
            <p>{tools.join(" · ")}</p>
          </div>
        </section>

        <section id="contact" className="home-contact">
          <div className="home-contact-copy">
            <p>Start a conversation</p>
            <h2>What is getting in the way of better retention?</h2>
            <span>
              Share the challenge you are working through. I will respond with
              a practical view on whether and how I can help.
            </span>
            <address>
              <a href="mailto:hello@florianbeermann.com">
                hello@florianbeermann.com
              </a>
              <a
                href="https://linkedin.com/in/florian-beermann"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn ↗
              </a>
            </address>
          </div>

          <form
            onSubmit={handleSubmit}
            className="home-contact-form"
          >
            <input
              type="checkbox"
              name="botcheck"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />
            <input type="hidden" name="size" value={size} />
            <input type="hidden" name="tooling" value={tooling} />

            <div className="home-form-row">
              <div className="home-form-field">
                <Label htmlFor="name-field">Full name</Label>
                <Input
                  id="name-field"
                  name="name"
                  autoComplete="name"
                  required
                  placeholder="Jane Doe"
                  className="home-form-control"
                />
              </div>
              <div className="home-form-field">
                <Label htmlFor="email-field">Work email</Label>
                <Input
                  id="email-field"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="jane@company.com"
                  className="home-form-control"
                />
              </div>
            </div>

            <div className="home-form-field">
              <Label htmlFor="company-field">Company</Label>
              <Input
                id="company-field"
                name="company"
                autoComplete="organization"
                required
                placeholder="Acme Inc."
                className="home-form-control"
              />
            </div>

            <div className="home-form-field">
              <Label htmlFor="message-field">
                What would you like to discuss?
              </Label>
              <Textarea
                id="message-field"
                name="message"
                rows={5}
                required
                placeholder="Briefly describe your current Customer Success priority…"
                className="home-form-control"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowDetails((current) => !current)}
              className="home-details-toggle"
              aria-expanded={showDetails}
              aria-controls="optional-details"
            >
              Add optional company context
              <ChevronDown
                className={`home-details-icon ${showDetails ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            {showDetails && (
              <div
                id="optional-details"
                className="optional-details"
              >
                <div className="home-form-field">
                  <Label htmlFor="size-field">Company size</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger
                      id="size-field"
                      className="home-select-trigger"
                    >
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-50">1–50 employees</SelectItem>
                      <SelectItem value="51-200">51–200 employees</SelectItem>
                      <SelectItem value="201-1000">
                        201–1,000 employees
                      </SelectItem>
                      <SelectItem value="1001-5000">
                        1,001–5,000 employees
                      </SelectItem>
                      <SelectItem value="5000+">5,000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="home-form-field">
                  <Label htmlFor="tooling-field">Current CS tooling</Label>
                  <Select value={tooling} onValueChange={setTooling}>
                    <SelectTrigger
                      id="tooling-field"
                      className="home-select-trigger"
                    >
                      <SelectValue placeholder="Select tooling" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gainsight">Gainsight</SelectItem>
                      <SelectItem value="churnzero">ChurnZero</SelectItem>
                      <SelectItem value="salesforce">Salesforce</SelectItem>
                      <SelectItem value="vitally">Vitally</SelectItem>
                      <SelectItem value="hubspot">HubSpot</SelectItem>
                      <SelectItem value="planhat">Planhat</SelectItem>
                      <SelectItem value="custom">Custom / in-house</SelectItem>
                      <SelectItem value="none">None yet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="home-submit"
              disabled={submitting}
            >
              {submitting ? "Sending…" : "Send request"}
            </Button>

            <p className="home-form-privacy">
              Your request is processed through Web3Forms. Read the{" "}
              <Link
                to="/privacy"
                className="home-privacy-link"
              >
                privacy policy
              </Link>{" "}
              for details.
            </p>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <span>florian beermann &amp; partners · © {new Date().getFullYear()}</span>
        <nav aria-label="Footer navigation">
          <Link to="/imprint">Imprint</Link>
          <Link to="/privacy">Privacy</Link>
        </nav>
      </footer>
    </div>
  );
}
