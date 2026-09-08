import { useCallback, useEffect, useRef } from "react";
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
import { HeroVideo } from "@/components/HeroVideo";
import { Wordmark } from "@/components/Wordmark";
import { Masthead } from "@/components/Masthead";
import { emptyEnquiry, useEnquiry, type EnquiryDraft } from "@/lib/enquiry";
import { pageMetadata, setPageMetadata } from "@/lib/metadata";
import "./Home.css";
import "./hero.css";
import "./scroll-panels.css";

const employers = [
  { name: "Microsoft", logo: "/company-logos/microsoft.png" },
  { name: "Capgemini", logo: "/company-logos/capgemini.png" },
  { name: "HubSpot", logo: "/company-logos/hubspot.svg" },
  { name: "Personio", logo: "/company-logos/personio.png" },
  { name: "Spendesk", logo: "/company-logos/spendesk.svg" },
];

const engagements = [
  {
    id: "customer-success-strategy",
    title: "Customer Success strategy",
    summary: "For teams whose responsibilities and priorities no longer fit their customers.",
    detail:
      "Define who owns each account, how much attention different customers need, and how your team plans for renewals and growth. I work with your Customer Success, sales and product teams to agree what needs to change first.",
    deliverables: [
      "Customer groups, account ownership and levels of service",
      "A clear way to assess customer health",
      "Forecasts for renewals and account growth",
      "A prioritised plan for the next twelve months",
    ],
  },
  {
    id: "customer-lifecycle-processes",
    title: "Customer lifecycle processes",
    summary: "For teams handling the same customer situations differently each time.",
    detail:
      "Give your team clear steps for onboarding, product adoption, renewal and customers at risk of leaving. Each process sets out when to act, who is responsible and what a good outcome looks like.",
    deliverables: [
      "Onboarding that helps customers see value sooner",
      "Clear steps for customers at risk of leaving",
      "Guides for quarterly and executive business reviews",
      "Criteria for identifying account growth opportunities",
    ],
  },
  {
    id: "customer-success-training",
    title: "Customer Success team training",
    summary: "For teams that need more confidence in renewal, value and growth conversations.",
    detail:
      "Practical working sessions help your team connect product use to business value, understand customer decision-making and prepare account plans with better evidence.",
    deliverables: [
      "Guidance for renewal and growth conversations",
      "Workshops to identify decision-makers and their priorities",
      "Showing customers the business value they have achieved",
      "Account planning practice and feedback",
    ],
  },
];

const softwareOptions = [
  { value: "gainsight", label: "Gainsight" },
  { value: "churnzero", label: "ChurnZero" },
  { value: "salesforce", label: "Salesforce" },
  { value: "vitally", label: "Vitally" },
  { value: "hubspot", label: "HubSpot" },
  { value: "planhat", label: "Planhat" },
  { value: "custom", label: "Built in-house" },
  { value: "other", label: "Other software" },
  { value: "none", label: "None yet" },
];

const contactEmail = "hello@florianbeermann.com";

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  const updateCloudPhase = useCallback((phase: number) => {
    pageRef.current?.style.setProperty("--wow", String(phase));
  }, []);
  const { draft, setDraft, submission, setSubmission } = useEnquiry();
  const submitting = submission.status === "sending";
  const submitError = submission.status === "error" ? submission.message : "";
  const submitStatus = submission.status === "sent" || submission.status === "email"
    ? submission.status
    : null;
  const errorRef = useRef<HTMLParagraphElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const accessKey = import.meta.env.VITE_WEB3FORMS_KEY?.trim();
  const usesEmail = !accessKey;
  const toolingLabel =
    draft.tooling === "other"
      ? draft.otherTooling.trim() || "Other software"
      : softwareOptions.find((option) => option.value === draft.tooling)?.label || "";

  useEffect(() => {
    setPageMetadata(pageMetadata.home);
  }, []);

  useEffect(() => {
    if (submitError) errorRef.current?.focus();
  }, [submitError]);

  useEffect(() => {
    if (submitStatus) statusRef.current?.focus();
  }, [submitStatus]);

  const updateField = <Key extends keyof EnquiryDraft>(field: Key, value: EnquiryDraft[Key]) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setSubmission({ status: "idle" });
  };

  const buildEmailDraft = (subject: string) => {
    const body = [
      `Name: ${draft.name}`,
      `Work email: ${draft.email}`,
      `Company: ${draft.company}`,
      draft.size ? `Company size: ${draft.size}` : "",
      toolingLabel ? `Customer Success software: ${toolingLabel}` : "",
      "",
      draft.message,
    ]
      .filter((line, index) => line || index === 5)
      .join("\n");
    return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const subject = `Customer Success enquiry: ${draft.company}`;
    if (!accessKey) {
      const href = buildEmailDraft(subject);
      setSubmission({ status: "email", href });
      window.location.assign(href);
      return;
    }

    setSubmission({ status: "sending" });
    formData.set("access_key", accessKey);
    formData.set("from_name", "Florian Beermann & Co. website");
    formData.set("subject", subject);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result: unknown = await response.json();
      if (
        !response.ok ||
        typeof result !== "object" ||
        result === null ||
        !("success" in result) ||
        result.success !== true
      ) {
        throw new Error("The form service did not accept the message.");
      }

      setDraft({ ...emptyEnquiry });
      setSubmission({ status: "sent" });
      toast.success("Message sent. I will reply within two business days.");
    } catch (error) {
      console.error("Enquiry submission failed:", error);
      const message = "Your message was not sent. Your text is still in the form. Try again or email me directly.";
      setSubmission({ status: "error", message });
      toast.error(message);
    }
  };

  return (
    <div className="site-page home-page" ref={pageRef}>
      <Masthead />
      <main id="site-main">
        <span className="site-stop" aria-hidden="true" />
        <section id="top" className="hero on-dark">
          <HeroVideo
            className="hero-video"
            src="/hero-loop.mp4?v=51ff34c5"
            srcSmall="/hero-loop-sm.mp4?v=2ea7920f"
            poster="/hero-poster.jpg"
            onCloudPhase={updateCloudPhase}
          />
          <div className="hero-statement">
            <h1 className="display hero-title">
              Your customers have changed.{" "}
              <br />
              Your approach should too.
            </h1>
            <p className="hero-lede">
              I help software companies adapt Customer Success as they begin
              serving different business customers.
            </p>
            <p className="hero-support">
              Clear account ownership, repeatable onboarding and better renewal
              planning. All in the tools your team already uses.
            </p>
          </div>
        </section>

        <span className="site-stop" aria-hidden="true" />
        <section className="home-proof home-section site-inverted site-panel" aria-labelledby="proof-title">
          <div className="home-proof-heading">
            <h2 id="proof-title">Where I have worked</h2>
            <div className="home-proof-copy">
              <p>
                Working across global technology companies and growing software
                businesses taught me how Customer Success needs to adapt to
                different business customers.
              </p>
              <p className="home-proof-note">Previous employers, not consultancy clients.</p>
            </div>
          </div>
          <ul className="home-employers" aria-label="Previous employers">
            {employers.map((employer) => (
              <li key={employer.name}>
                <span
                  className="home-employer-mark"
                  aria-hidden="true"
                  style={{ "--employer-logo": `url("${employer.logo}")` } as React.CSSProperties}
                />
                {employer.name}
              </li>
            ))}
          </ul>
          <dl className="home-facts">
            <div>
              <dt>More than six years</dt>
              <dd>In Customer Success at business software companies.</dd>
            </div>
            <div>
              <dt>Direct responsibility</dt>
              <dd>I have been responsible for customer renewals and account growth.</dd>
            </div>
            <div>
              <dt>Your existing software</dt>
              <dd>Your team keeps working in the tools it already uses.</dd>
            </div>
          </dl>
        </section>

        <section id="engagements" className="home-engagements-track" aria-labelledby="engagements-title">
          <div className="home-engagement-steps" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="home-engagements-stage">
            <header className="home-section-heading">
              <h2 id="engagements-title">How I can help</h2>
              <p>
                We start with the problem your team needs to solve, then agree the
                work and what you will receive.
              </p>
            </header>
            <div className="home-engagement-viewport">
              <div className="home-engagement-reel">
                {engagements.map((engagement) => (
                  <article className="home-engagement" key={engagement.id}>
                    <div className="home-engagement-title">
                      <h3>{engagement.title}</h3>
                      <p>{engagement.summary}</p>
                    </div>
                    <div className="home-engagement-detail">
                      <p>{engagement.detail}</p>
                      <ul>
                        {engagement.deliverables.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="home-engagement-progress" aria-hidden="true">
              <span className="home-engagement-progress-rail">
                <span className="home-engagement-progress-bar" />
              </span>
              <ol>
                {engagements.map((engagement, index) => (
                  <li key={engagement.id}>{String(index + 1).padStart(2, "0")}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <span className="site-stop" aria-hidden="true" />
        <section className="home-transition home-section site-voltage site-panel" aria-labelledby="transition-title">
          <h2 id="transition-title">Keep what works. Change what no longer fits.</h2>
          <ul className="home-transition-decisions" role="list">
            <li>
              <h3>Customer fit</h3>
              <p>
                Separate a shift in customer needs from a gap in execution.
                Reassess the assumptions behind your customer groups, health
                measures and account priorities before adding more process.
              </p>
            </li>
            <li>
              <h3>Service choices</h3>
              <p>
                Decide where a shared approach still works and where onboarding,
                ownership or specialist involvement must differ. Balance those
                choices against team capacity rather than letting exceptions
                become the model.
              </p>
            </li>
            <li>
              <h3>The transition</h3>
              <p>
                Sequence changes around existing customer commitments and renewal
                cycles. Introduce new responsibilities without leaving accounts
                caught between the old and new ways of working.
              </p>
            </li>
          </ul>
        </section>

        <span className="site-stop" aria-hidden="true" />
        <section id="about" className="home-about home-section site-panel" aria-labelledby="about-title">
          <header className="home-section-heading">
            <h2 id="about-title">Responsible for renewals and growth.</h2>
          </header>
          <div className="home-about-grid">
            <div className="home-about-copy">
              <p className="home-about-lead">
                I have run Customer Success in global technology companies and
                growing software businesses.
              </p>
              <p>
                Today, I help teams adapt as they begin serving different business
                customers. Different industries, expectations or levels of
                complexity can each call for a different approach.
              </p>
              <p>
                When a project needs deeper expertise in customer operations, data,
                software or team training, I bring in independent specialists I
                have worked with.
              </p>
            </div>
            <figure className="home-about-portrait">
              <img
                src="/portrait.jpg"
                alt="Florian Beermann"
                width="723"
                height="1086"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
        </section>

        <span className="site-stop" aria-hidden="true" />
        <section id="contact" className="home-contact home-section site-inverted site-panel" aria-labelledby="contact-title">
          <div className="home-contact-copy">
            <h2 id="contact-title">What needs to change?</h2>
            <p>
              Tell me what is changing in your customer base and where your team
              needs help. A few sentences are enough.
            </p>
            <p>I read every enquiry myself and reply within two business days.</p>
            <a className="home-direct-email" href={`mailto:${contactEmail}`}>
              Email me directly
              <span>{contactEmail}</span>
            </a>
          </div>

          <form onSubmit={handleSubmit} className="home-contact-form" aria-describedby="form-requirements form-privacy-note">
            <p className="home-form-help" id="form-requirements">
              Name, work email, company and message are required. Company size and software are optional.
            </p>
            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
            <input type="hidden" name="size" value={draft.size} />
            <input type="hidden" name="tooling" value={toolingLabel} />
            <fieldset disabled={submitting} className="home-form-fields">
              <div className="home-form-row">
                <div className="home-form-field">
                  <Label htmlFor="name-field">Name</Label>
                  <Input id="name-field" name="name" autoComplete="name" required value={draft.name} onChange={(event) => updateField("name", event.target.value)} className="home-form-control" />
                </div>
                <div className="home-form-field">
                  <Label htmlFor="email-field">Work email</Label>
                  <Input id="email-field" name="email" type="email" autoComplete="email" required value={draft.email} onChange={(event) => updateField("email", event.target.value)} className="home-form-control" />
                </div>
              </div>
              <div className="home-form-field">
                <Label htmlFor="company-field">Company</Label>
                <Input id="company-field" name="company" autoComplete="organization" required value={draft.company} onChange={(event) => updateField("company", event.target.value)} className="home-form-control" />
              </div>
              <div className="home-form-field">
                <Label htmlFor="message-field">What would you like to discuss?</Label>
                <Textarea
                  id="message-field"
                  name="message"
                  rows={5}
                  required
                  value={draft.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  placeholder="What has changed, what is difficult, and what would a better outcome look like?"
                  className="home-form-control"
                />
              </div>
              <button
                type="button"
                onClick={() => updateField("detailsOpen", !draft.detailsOpen)}
                className="home-details-toggle"
                aria-expanded={draft.detailsOpen}
                aria-controls="optional-details"
              >
                Add company details (optional)
                <ChevronDown className={`home-details-icon ${draft.detailsOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              <div id="optional-details" hidden={!draft.detailsOpen}>
                {draft.detailsOpen && (
                  <div className="home-optional-details">
                    <div className="home-form-field">
                      <Label htmlFor="size-field">Company size</Label>
                      <Select value={draft.size} onValueChange={(value) => updateField("size", value)} disabled={submitting}>
                        <SelectTrigger id="size-field" className="home-select-trigger">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent className="home-select-content">
                          <SelectItem value="1-50">1 to 50 employees</SelectItem>
                          <SelectItem value="51-200">51 to 200 employees</SelectItem>
                          <SelectItem value="201-1000">201 to 1,000 employees</SelectItem>
                          <SelectItem value="1001-5000">1,001 to 5,000 employees</SelectItem>
                          <SelectItem value="5000+">More than 5,000 employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="home-form-field">
                      <Label htmlFor="tooling-field">Customer Success software</Label>
                      <Select value={draft.tooling} onValueChange={(value) => updateField("tooling", value)} disabled={submitting}>
                        <SelectTrigger id="tooling-field" className="home-select-trigger">
                          <SelectValue placeholder="Select software" />
                        </SelectTrigger>
                        <SelectContent className="home-select-content">
                          {softwareOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    {draft.tooling === "other" && (
                      <div className="home-form-field home-other-software">
                        <Label htmlFor="other-tooling-field">Software name (optional)</Label>
                        <Input id="other-tooling-field" value={draft.otherTooling} onChange={(event) => updateField("otherTooling", event.target.value)} className="home-form-control" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </fieldset>

            {submitError && (
              <p className="home-form-notice" ref={errorRef} tabIndex={-1} role="alert">
                {submitError}{" "}
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </p>
            )}
            {(submission.status === "sent" || submission.status === "email") && (
              <p className="home-form-notice" ref={statusRef} tabIndex={-1} role="status">
                {submission.status === "sent" ? (
                  "Message sent. I will reply within two business days."
                ) : (
                  <>Your message has not been sent yet. Finish sending it in your email app.{" "}
                    <a href={submission.href}>Open the email draft again</a>.</>
                )}
              </p>
            )}
            <p className="home-form-reassure" id="form-privacy-note">
              {usesEmail
                ? "This form opens a draft in your email app. Nothing is sent until you send that email."
                : "This form uses Web3Forms to deliver your message to my inbox."}{" "}
              <Link to="/privacy" state={{ from: "enquiry" }} className="home-privacy-link">Read the privacy policy</Link>.
            </p>
            <Button type="submit" size="lg" className="home-submit" disabled={submitting}>
              {submitting ? "Sending..." : usesEmail ? "Continue in email" : "Send message"}
            </Button>
          </form>
        </section>
      </main>

      <span className="site-stop" aria-hidden="true" />
      <footer className="site-closing">
        <div className="site-closing-top">
          <p className="site-closing-line">
            Customer Success consulting for software companies serving different business customers.
          </p>
          <div className="site-closing-cols">
            <nav aria-label="Sections">
              <a href="#engagements">Services</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </nav>
            <nav aria-label="Elsewhere">
              <a href="https://linkedin.com/in/florian-beermann" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={`mailto:${contactEmail}`}>Email</a>
              <Link to="/imprint">Legal notice</Link>
              <Link to="/privacy">Privacy</Link>
            </nav>
          </div>
        </div>
        <div className="site-closing-lockup" aria-hidden="true">
          <Wordmark className="site-closing-wordmark" />
          <span className="site-closing-year">&copy; {new Date().getFullYear()}</span>
        </div>
        <p className="site-closing-notice">Florian Beermann &amp; Co., &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
