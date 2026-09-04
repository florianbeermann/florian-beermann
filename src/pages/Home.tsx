import { useCallback, useEffect, useRef, useState } from "react";
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
import { HeroLoader } from "@/components/HeroLoader";
import { BrandMark } from "@/components/BrandMark";
import { Masthead } from "@/components/Masthead";
import { setPageMetadata } from "@/lib/metadata";
import "./Home.css";
import "./hero.css";

/* The portrait is a character grid, generated from the photograph by
   `npm run portrait` and inlined at build time. The site ships no photography:
   the face is set in the same ink as everything else, which is the only way an
   image belongs on a page whose entire depth model is figure and ground. It
   also costs 4.7KB in place of 189KB of responsive image files, and no decode.
   Regenerate rather than edit — see scripts/generate-portrait-ascii.mjs.

   The plate is measured against the artwork's own dimensions rather than
   numbers typed twice, so regenerating at any size stays correct. Both axes are
   published: the columns size the grid to the panel's width, and the rows let
   it also be sized against the height it has been given, which the hero needs
   because it is the one panel with a fixed height budget. */

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
      "I examine segmentation, coverage, health scoring, renewal forecasting and the hand-offs between CS, sales and product. The result is a sequenced roadmap tied to retention and expansion targets.",
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
      "I turn onboarding, adoption, risk, renewal and expansion into explicit plays, with owners, triggers, actions and measures of success.",
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
      "Working sessions help CSMs connect product usage to business value, map stakeholders and lead account planning with better evidence.",
    deliverables: [
      "Commercial conversation framework",
      "Stakeholder mapping workshops",
      "Value-realisation storytelling",
      "Account-plan certification",
    ],
  },
];


const contactEmail = "hello@florianbeermann.com";

export default function Home() {
  const [submitting, setSubmitting] = useState(false);
  /* The hero plate's download, watched so the loading screen can show real
     progress rather than an indeterminate spinner. `ready` is one-way: once the
     plate can play through, nothing later un-readies it. */
  const [plateProgress, setPlateProgress] = useState(0);
  const [plateReady, setPlateReady] = useState(false);
  const [plateRevealed, setPlateRevealed] = useState(false);
  const handlePlateReady = useCallback(() => setPlateReady(true), []);
  const handleReveal = useCallback(() => setPlateRevealed(true), []);
  const [showDetails, setShowDetails] = useState(false);
  const [size, setSize] = useState("");
  const [tooling, setTooling] = useState("");
  /* Submission failure needs somewhere to live that is not a toast. A toast
     announces once and then removes itself, which means a visitor who was
     looking elsewhere — or who is being read to — can lose the only notice that
     their message did not send, with no way to get it back. This holds the
     message in the form until the next attempt. */
  const [submitError, setSubmitError] = useState("");
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    setPageMetadata({
      title: "Florian Beermann & Partners",
      description:
        "Customer Success consulting for B2B SaaS companies whose customer base has outgrown the way they serve it. Strategy, lifecycle playbooks and CSM enablement.",
      path: "/",
    });
  }, []);

  /* Focus follows the failure. Announcing into a live region tells a screen
     reader something happened; moving focus is what puts the visitor at the
     thing that needs their attention, and it also scrolls the message into
     view for a sighted visitor whose submit button was below the fold.
     `tabIndex={-1}` on the target makes it focusable without adding a tab
     stop that would otherwise sit in the form forever. */
  useEffect(() => {
    if (submitError) errorRef.current?.focus();
  }, [submitError]);

  /* No scroll driver here, and there is not meant to be one. Sections were once
     pinned from JavaScript and the reel was paced from it three separate times;
     all of it is gone. The page is paced entirely by CSS scroll snapping, one
     panel per screen — see the `.site-stop` block in Home.css for why that has
     to be mandatory and page-wide. */

  const buildSubject = (formData: FormData) =>
    `Customer Success enquiry: ${formData.get("company") || "website"}`;

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
    setSubmitError("");
    formData.set("size", size);
    formData.set("tooling", tooling);
    formData.set("access_key", accessKey);
    formData.set("from_name", "Florian Beermann & Partners website");
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

      setSubmitError("");
      toast.success("Message sent. I’ll reply within two business days.");
      form.reset();
      setSize("");
      setTooling("");
      setShowDetails(false);
    } catch (error) {
      console.error(error);
      const message = `Your message wasn’t sent. Your text is still in the form. Try again, or email ${contactEmail}.`;
      /* Both channels, deliberately. The toast is the glance-level notice for
         someone watching the button; the inline region is the durable record,
         and it is the one that survives being missed. */
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="site-page">
      <HeroLoader
        progress={plateProgress}
        ready={plateReady}
        onLeave={handleReveal}
      />
      <Masthead />
      <main id="site-main">
        {/* Snap stop. See `.site-stop` in Home.css. */}
        <span className="site-stop" aria-hidden="true" />
        <section id="top" className="hero on-dark">
          {/* The whole background. Decorative and unreadable by definition.
              Nothing is laid over it: the type carries itself, and crosses to
              the signal blue as the picture turns to cloud. */}
          <HeroVideo
            className="hero-video"
            src="/hero-loop.mp4"
            srcSmall="/hero-loop-sm.mp4"
            poster="/hero-poster.jpg"
            onProgress={setPlateProgress}
            onReady={handlePlateReady}
            hold={!plateRevealed}
          />

          {/* The brand lockup: the wordmark alone, under the pill. The mark
              used to sit to its left; the masthead directly above already
              carries the anvil, so showing it twice within one screen height
              was saying the same thing twice.
              Presentational — the accessible name for the site already lives on
              the masthead's home link, and repeating it here would announce the
              company twice to a screen reader. */}
          <div className="hero-lockup" aria-hidden="true">
            <span className="hero-lockup-word">Florian Beermann &amp; Partners</span>
          </div>

          <div className="hero-statement">
            <h1 className="display hero-title">
              Your customers changed.{" "}
              <br />
              <span className="hero-title-accent">
                Your Customer Success motion did not.
              </span>
            </h1>
            <p className="hero-lede">
              I build operations and processes
              <br />
              that work in the real world.
            </p>
          </div>
        </section>

        {/* Snap stop. See `.site-stop` in Home.css. */}
        <span className="site-stop" aria-hidden="true" />
        <section className="home-proof site-inverted site-panel" aria-labelledby="proof-title">
          <div className="home-proof-heading site-reveal">
            <h2 id="proof-title">Where the experience comes from</h2>
            <p>
              <span className="home-proof-lede">
                Every one of these is a company I worked inside.
              </span>
              <span className="home-proof-rest site-sweep">
                Each ran Customer Success for a different kind of customer. That
                is where I learned what transfers between segments, and what
                quietly breaks.
              </span>
            </p>
          </div>

          <ul className="home-employers" aria-label="Previous employers">
            {employers.map((employer) => (
              <li key={employer.name}>
                <span
                  className="home-employer-mark"
                  aria-hidden="true"
                  style={
                    {
                      "--employer-logo": `url("${employer.logo}")`,
                    } as React.CSSProperties
                  }
                />
                {employer.name}
              </li>
            ))}
          </ul>

          <dl className="home-facts">
            <div className="home-fact-metric">
              <dt>6+ years</dt>
              <dd>operating Customer Success in B2B SaaS</dd>
            </div>
            <div>
              <dt>Targets</dt>
              <dd>
                I have owned retention and expansion directly, not only advised
                on them from outside.
              </dd>
            </div>
            <div>
              <dt>Tooling</dt>
              <dd>Engagements run on the stack your team already has.</dd>
            </div>
          </dl>
        </section>

        {/* The three engagements share one frame. "Three ways I work" and its
            lede are the constant; only the engagement under them changes as the
            track is scrolled, so the section reads as one idea examined three
            times rather than three sections in a row.

            The track is three screens tall and the stage inside it is sticky, so
            the frame holds while the reel behind it advances. The engagement
            travels with the scroll, and nothing in JavaScript paces it: the
            reel, the rail and the readout are one scroll-driven animation on
            the track's own view timeline, so they are locked to the scroll by
            the compositor. It is deliberately not a `.site-panel`: panels hold
            still and are covered, this one is scrubbed. */}
        <section
          id="engagements"
          className="home-engagements-track"
          aria-labelledby="engagements-title"
        >
          {/* Three places for the scroller to catch, one per engagement, so a
              flick cannot cross all three and a gesture cannot end between two.
              Nothing is drawn and nothing is read. CSS-only, see `Home.css`. */}
          <div className="home-engagement-steps" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="home-engagements-stage">
            <header className="home-section-heading">
              <h2 id="engagements-title">Three ways I work</h2>
              <span>
                Each engagement is scoped around the operating problem in front
                of you, not sold as a transformation package.
              </span>
            </header>

            <div className="home-engagement-viewport">
              <div className="home-engagement-reel">
                {engagements.map((engagement) => (
                  <article className="home-engagement" key={engagement.number}>
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
            </div>

            {/* Position within the sub-scroll. Hidden from assistive tech: it
                says nothing the three engagements below it do not already say,
                and it only exists where the scrub does. */}
            <div className="home-engagement-progress" aria-hidden="true">
              <span className="home-engagement-progress-rail">
                <span className="home-engagement-progress-bar" />
              </span>
              <ol>
                {engagements.map((engagement) => (
                  <li key={engagement.number}>{engagement.number}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Snap stop. See `.site-stop` in Home.css. */}
        <span className="site-stop" aria-hidden="true" />
        <section className="home-method site-voltage site-panel">
          <div className="home-method-inner site-reveal">
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

        {/* The about band carries the argument beside the face.

            It reads as one spread rather than two blocks: a single rule under
            the heading runs the full measure, and the prose and the plate hang
            from it. That rule is the band's only one — the copy column, the
            plate and the closing line each carried their own before, three
            rules in two different weights, which is what made this the section
            that looked unlike the rest of the page.

            The plate keeps the photograph's own proportion. It used to be told
            to fill whatever depth the copy beside it happened to set, so as the
            copy got shorter the frame flattened into a letterbox and `cover`
            threw the rest of the picture away — measured at 555x422 against a
            source of 723x1086, which is a landscape crop of a portrait. It is
            sized from the height it has now, and the column it sits in is
            narrower than the prose so that height has somewhere to go. */}
        {/* Snap stop. See `.site-stop` in Home.css. */}
        <span className="site-stop" aria-hidden="true" />
        <section id="about" className="home-about home-section site-panel">
          <header className="home-section-heading site-reveal">
            <h2>I have been the person who owns the number.</h2>
          </header>

          <div className="home-about-grid">
            <div className="home-about-copy site-sweep">
              <p className="home-about-lead">
                I have run Customer Success inside global technology companies
                and inside fast-moving SaaS scale-ups.
              </p>
              <p>
                Most of my work now sits with companies discovering mid-move
                that the coverage model which worked at one customer size
                quietly stops working at the next.
              </p>

              <p className="home-about-note">
                Deeper CS Operations, data, tooling or enablement work comes
                from a small network of independent specialists.
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

        {/* Snap stop. See `.site-stop` in Home.css. */}
        <span className="site-stop" aria-hidden="true" />
        <section id="contact" className="home-contact site-inverted site-panel">
          <div className="home-contact-copy site-reveal">
            <h2>What is getting in the way of better retention?</h2>
            <span>
              Share the challenge you are working through. I will respond with
              a practical view on whether and how I can help.
            </span>
          </div>

          <form
            onSubmit={handleSubmit}
            className="home-contact-form"
            /* Where the data goes is something to know *before* submitting, not
               a footnote discovered afterwards, so the note below is wired as
               the form's description rather than left as loose prose. */
            aria-describedby="form-privacy-note"
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
                placeholder="Acme"
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
                className="home-optional-details"
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
                    <SelectContent className="home-select-content">
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
                    <SelectContent className="home-select-content">
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

            {submitError && (
              <p
                className="home-form-error"
                ref={errorRef}
                tabIndex={-1}
                role="alert"
              >
                {submitError}
              </p>
            )}

            {/* Carries `form-privacy-note`, which the form's `aria-describedby`
                points at. The id moved here with the link when the Web3Forms
                paragraph came out: left on a deleted element it would have been
                a dangling reference, and the form would have lost its
                description entirely rather than obviously breaking. */}
            <p className="home-form-reassure" id="form-privacy-note">
              I read every enquiry myself and reply within two business days.
              See the{" "}
              <Link to="/privacy" className="home-privacy-link">
                privacy policy
              </Link>
              .
            </p>

            <Button
              type="submit"
              size="lg"
              className="home-submit"
              disabled={submitting}
            >
              {submitting ? "Sending…" : "Send message"}
            </Button>
          </form>

          {/* The imprint and privacy links, and the copyright, used to live in
              a footer below this panel. Contact is the last panel and fills the
              window, so reaching them meant one more scroll past the end of the
              page for two links that have to be reachable. They sit in the
              contact panel instead, and the page ends where its last section
              does.

              A direct child of the panel's grid rather than of the copy column:
              placed at the foot of the first column while there are two, and
              genuinely last once the panel stacks — inside the copy column it
              would have come between the address and the form. */}
        </section>
      </main>

      {/* The closing panel. It is a section in its own right rather than a strip
          at the foot of the contact form, and it is full height on purpose:
          the masthead reads whichever section crosses its centre line, and at
          maximum scroll a short footer never reaches that line — the row went
          on reporting the section two above it. A panel that fills the last
          screen is the only thing that puts the footer under the row when the
          page is scrolled to the end.

          Outside <main> so the contentinfo landmark is not nested inside it. */}
      {/* The closing panel. Full height for a structural reason as well as a
          compositional one: the masthead colours itself from whichever section
          crosses its centre line, and at maximum scroll a panel shorter than
          the viewport never reaches that line. */}
      {/* Snap stop for the closing panel. Mandatory snapping means the scroll
          can never rest anywhere that is not a snap position, so every panel
          needs one or it cannot be stopped on. This panel arrived after the
          rest of them did. */}
      <span className="site-stop" aria-hidden="true" />
      <footer className="site-closing" role="contentinfo">
        <div className="site-closing-top">
          <p className="site-closing-line">
            Operations and processes that work in the real world.
          </p>

          <div className="site-closing-cols">
            <nav aria-label="Sections">
              <a href="#engagements">Work</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </nav>
            <nav aria-label="Elsewhere">
              <a
                href="https://linkedin.com/in/florian-beermann"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn ↗
              </a>
              <a href={`mailto:${contactEmail}`}>Email</a>
              <Link to="/imprint">Imprint</Link>
              <Link to="/privacy">Privacy</Link>
            </nav>
          </div>
        </div>

        {/* The wordmark, set to the width of the page and cropped by the
            panel's bottom edge. Presentational: the accessible name is already
            on the masthead's home link, and the copyright it now carries is
            given to assistive tech by the line below. */}
        <div className="site-closing-lockup" aria-hidden="true">
          <BrandMark className="site-closing-mark" />
          <span className="site-closing-word">Florian Beermann &amp; Partners</span>
          <span className="site-closing-year">© {new Date().getFullYear()}</span>
        </div>
        <p className="site-closing-notice">
          Florian Beermann &amp; Partners, © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
