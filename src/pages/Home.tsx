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
        "Customer Success consulting for B2B SaaS companies whose customer base has moved upmarket. Strategy, lifecycle playbooks and CSM enablement.",
      path: "/",
    });
  }, []);

  const buildSubject = (formData: FormData) =>
    `Customer Success enquiry — ${formData.get("company") || "website"}`;

  const openEmailFallback = (formData: FormData) => {
    const subject = encodeURIComponent(buildSubject(formData));
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
      toast.info(
        `Opening your email app with your message ready to send to ${contactEmail}.`,
      );
      openEmailFallback(formData);
      return;
    }

    setSubmitting(true);
    formData.set("size", size);
    formData.set("tooling", tooling);
    formData.set("access_key", accessKey);
    formData.set("from_name", "florian beermann & partners website");
    formData.set("subject", buildSubject(formData));

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

      toast.success("Message sent. I’ll reply within two business days.");
      form.reset();
      setSize("");
      setTooling("");
      setShowDetails(false);
    } catch (error) {
      console.error(error);
      toast.error(
        `Your message wasn’t sent. Your text is still in the form — try again, or email ${contactEmail}.`,
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
              Your customers changed.{" "}
              <span>Your Customer Success motion didn’t.</span>
            </h1>
            <p className="home-intro">
              I rebuild Customer Success for B2B SaaS companies whose customer
              base has moved — usually upmarket — while the coverage model,
              health scores and playbooks still assume the customers they used
              to have.
            </p>
            <div className="home-actions">
              <a className="home-primary-action" href="#contact">
                Start a conversation
              </a>
            </div>
            <p className="home-hero-proof">
              I have operated Customer Success from SMB accounts through to
              DAX40 enterprises.
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
            <h2 id="proof-title">Where the experience comes from</h2>
            <p>
              Companies I have worked in, not a client list. Each ran Customer
              Success for a different kind of customer, which is how I learned
              what transfers between segments and what quietly breaks.
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
              <dd>operating Customer Success in B2B SaaS</dd>
            </div>
            <div>
              <dt>Retention &amp; expansion</dt>
              <dd>targets owned directly, not advised on from outside</dd>
            </div>
            <div>
              <dt>Your team, your tools</dt>
              <dd>engagements run on the stack you already have</dd>
            </div>
          </dl>
        </section>

        <section
          id="engagements"
          className="home-engagements home-section"
        >
          <header className="home-section-heading">
            <h2>Three ways I work</h2>
            <span>
              Each engagement is scoped around the operating problem in front
              of you, not sold as a transformation package.
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
            <h2>I have been the person who owns the number.</h2>
          </header>

          <div className="home-about-grid">
            <div className="home-about-copy">
              <p className="home-about-lead">
                I have run Customer Success inside global technology companies
                and inside fast-moving SaaS scale-ups.
              </p>
              <p>
                The two demand completely different things, and most of my work
                now sits with companies discovering that mid-move — where the
                coverage model that worked at one customer size quietly stops
                working at the next.
              </p>
              <p>
                So I know the difference between a framework that presents well
                and one a busy team will still be using in six months. I build
                for the second.
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
                placeholder="Where retention or expansion is falling short, and what you have tried so far…"
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
              Add company size and tooling (optional)
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
              {submitting ? "Sending…" : "Send message"}
            </Button>

            <p className="home-form-privacy">
              This form is processed by Web3Forms in the US. You can email{" "}
              {contactEmail} instead — the{" "}
              <Link
                to="/privacy"
                className="home-privacy-link"
              >
                privacy policy
              </Link>{" "}
              explains both.
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
