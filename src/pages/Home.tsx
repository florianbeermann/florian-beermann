import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArtworkGallery } from "@/components/ArtworkGallery";
import { BrandMark } from "@/components/BrandMark";
import { EnquiryForm } from "@/components/EnquiryForm";
import { LinkLabel } from "@/components/LinkLabel";
import { useHomeSections } from "@/hooks/useHomeSections";
import { pageMetadata, setPageMetadata } from "@/lib/metadata";
import "./Home.css";
import "./artwork-slideshow.css";
import "./home-sections.css";

const navigation = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "approach", label: "Approach" },
  { id: "expertise", label: "Expertise" },
  { id: "contact", label: "Contact" },
];

const employers = [
  { name: "Microsoft", logo: "microsoft.png" },
  { name: "Capgemini", logo: "capgemini.svg" },
  { name: "HubSpot", logo: "hubspot.svg" },
  { name: "Personio", logo: "personio.png" },
  { name: "Spendesk", logo: "spendesk.svg" },
];

const engagements = [
  {
    id: "customer-success-strategy",
    title: "Customer Success strategy",
    summary: "When responsibilities and priorities no longer fit your customers.",
    detail: "Define who owns each account, how much attention different customers need, and how your team plans for renewals and growth. I work with your Customer Success, sales and product teams to agree what needs to change first.",
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
    summary: "When the same customer situations are handled differently each time.",
    detail: "Give your team clear steps for onboarding, product adoption, renewal and customers at risk of leaving. Each process sets out when to act, who is responsible and what a good outcome looks like.",
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
    summary: "When your team needs more confidence in value, renewal and growth conversations.",
    detail: "Practical working sessions help your team connect product use to business value, understand customer decision-making and prepare account plans with better evidence.",
    deliverables: [
      "Guidance for renewal and growth conversations",
      "Workshops to identify decision-makers and their priorities",
      "Showing customers the business value they have achieved",
      "Account planning practice and feedback",
    ],
  },
];

function SectionScreen({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div className="section-screen" data-screen={id} hidden={id !== "top"} aria-hidden={id !== "top"}>
      {children}
    </div>
  );
}

function SectionLinks() {
  return navigation.map(item => (
    <Link key={item.id} to={`/#${item.id}`}><LinkLabel>{item.label}</LinkLabel></Link>
  ));
}

export default function Home() {
  const page = useRef<HTMLDivElement>(null);
  useHomeSections(page);
  useEffect(() => { setPageMetadata(pageMetadata.home); }, []);

  return (
    <div className="boutique-page" ref={page}>
      <header className="masthead">
        <div className="masthead-inner">
          <Link className="brand" to="/" aria-label="Beermann & Company, home">
            <BrandMark className="brand-mark" />
            <span>BEERMANN</span>
          </Link>
          <nav className="desktop-nav" aria-label="Primary navigation"><SectionLinks /></nav>
          <details className="mobile-menu">
            <summary>
              <LinkLabel>Menu</LinkLabel>
              <span className="menu-symbol" aria-hidden="true" />
            </summary>
            <nav aria-label="Mobile navigation"><SectionLinks /></nav>
          </details>
        </div>
      </header>

      <main id="section-viewport">
        <SectionScreen id="top">
          <section className="opening" id="top" aria-labelledby="opening-title">
            <h1 className="opening-brand" id="opening-title" aria-label="Beermann & Company">
              <BrandMark className="opening-brand-mark" />
              <span className="opening-brand-name">BEERMANN</span>
            </h1>
            <ArtworkGallery />
          </section>
        </SectionScreen>

        <SectionScreen id="about">
          <section className="practice page-width chapter" id="about" aria-labelledby="about-title">
            <h2 id="about-title">Independent advice.<br />Practical experience.</h2>
            <div className="practice-copy">
              <p className="large-copy">When the customer base changes, the way Customer Success works needs to change with it.</p>
              <p>I help software companies make that adjustment: from account ownership and levels of service to the processes and conversations that support renewals and growth.</p>
              <p>The work is advisory and hands-on. It stays close to your team, your customers and the tools you already use.</p>
            </div>
          </section>
        </SectionScreen>

        <SectionScreen id="services">
          <section className="services blue-section" id="services" aria-labelledby="services-title">
            <div className="page-width">
              <div className="chapter-heading">
                <h2 id="services-title">The work.</h2>
                <p>We start with the problem your team needs to solve, then agree the work and what you will receive.</p>
              </div>
              <div className="engagements">
                {engagements.map((engagement, index) => (
                  <details className="engagement" key={engagement.id} open={index === 0}>
                    <summary>
                      <h3 id={engagement.id}>{engagement.title}</h3>
                      <span className="service-summary">{engagement.summary}</span>
                      <span className="disclosure-symbol" aria-hidden="true" />
                    </summary>
                    <div className="engagement-body">
                      <p>{engagement.detail}</p>
                      <ul>{engagement.deliverables.map(item => <li key={item}>{item}</li>)}</ul>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </SectionScreen>

        <SectionScreen id="approach">
          <section className="approach page-width chapter" id="approach" aria-labelledby="approach-title">
            <div className="approach-heading">
              <h2 id="approach-title">Keep what works.<br />Change what<br className="desktop-break" /> no longer fits.</h2>
              <p>A change in customer needs does not mean starting again. It means knowing where to make a different choice.</p>
            </div>
            <div className="approach-decisions">
              <article>
                <h3>Understand the customer.</h3>
                <p>Separate a shift in customer needs from a gap in execution. Reassess the assumptions behind your customer groups, health measures and account priorities before adding more process.</p>
              </article>
              <article>
                <h3>Make deliberate choices.</h3>
                <p>Decide where a shared approach still works and where onboarding, ownership or specialist involvement must differ. Balance those choices against team capacity rather than letting exceptions become the model.</p>
              </article>
              <article>
                <h3>Manage the transition.</h3>
                <p>Sequence changes around existing customer commitments and renewal cycles. Introduce new responsibilities without leaving accounts caught between the old and new ways of working.</p>
              </article>
            </div>
          </section>
        </SectionScreen>

        <SectionScreen id="expertise">
          <section className="person-section" id="expertise" aria-labelledby="expertise-title">
            <div className="person page-width">
              <figure className="portrait">
                <picture>
                  <source type="image/webp" srcSet="/boutique/portrait-colour-512.webp 512w, /boutique/portrait-colour-1023.webp 1023w" sizes="(max-width: 560px) 310px, 390px" />
                  <img src="/boutique/portrait-colour.png" alt="Florian Beermann" width="1023" height="1537" loading="lazy" decoding="async" />
                </picture>
              </figure>
              <div className="person-copy">
                <h2 id="expertise-title">Advice from someone<br />who has done the work.</h2>
                <h3>Florian Beermann</h3>
                <p>I have run Customer Success in global technology companies and growing software businesses.</p>
                <p>Today, I help teams adapt as they begin serving different business customers. Different industries, expectations or levels of complexity can each call for a different approach.</p>
                <p>When a project needs deeper expertise in customer operations, data, software or team training, I bring in independent specialists I have worked with.</p>
                <a className="text-link" href="https://www.linkedin.com/in/florian-beermann" target="_blank" rel="noopener noreferrer">
                  <LinkLabel>Connect on LinkedIn</LinkLabel>
                </a>
                <div className="experience">
                  <h3 id="experience-title">Experience behind the advice.</h3>
                  <ul aria-label="Previous employers" aria-describedby="experience-context">
                    {employers.map(employer => (
                      <li key={employer.name}>
                        <span
                          className="employer-mark"
                          style={{ "--employer-logo": `url('/boutique/employers/${employer.logo}')` } as CSSProperties}
                          aria-hidden="true"
                        />
                        {employer.name}
                      </li>
                    ))}
                  </ul>
                  <p id="experience-context">Previous employers, not consultancy clients.</p>
                </div>
              </div>
            </div>
          </section>
        </SectionScreen>

        <SectionScreen id="contact">
          <section className="contact blue-section" id="contact" aria-labelledby="contact-title">
            <div className="contact-inner page-width">
              <h2 id="contact-title">A conversation is a<br />useful place to start.</h2>
              <div className="contact-copy">
                <p>Tell me what is changing in your customer base and where your team needs help. A few sentences are enough.</p>
                <p>I read every enquiry myself and reply within two business days.</p>
                <a className="contact-email" href="mailto:hello@florianbeermann.com">
                  <LinkLabel>hello@florianbeermann.com</LinkLabel>
                  <svg viewBox="0 0 34 16" aria-hidden="true"><path d="M0 8h31M24 1l7 7-7 7" /></svg>
                </a>
                <a className="contact-phone" href="tel:+494089705822"><LinkLabel>+49 (0)40 89705822</LinkLabel></a>
                <EnquiryForm />
              </div>
            </div>
          </section>
          <footer className="footer" role="contentinfo">
            <div className="footer-top page-width">
              <Link className="brand" to="/" aria-label="Beermann & Company, back to top">
                <span>Beermann <span className="brand-amp">&amp;</span> Company</span>
              </Link>
              <p>Independent Customer Success advice.<br />Hamburg, working across Europe.</p>
            </div>
            <div className="footer-bottom page-width">
              <p>&copy; {new Date().getFullYear()} Beermann &amp; Company</p>
              <nav aria-label="Legal and social">
                <Link to="/imprint"><LinkLabel>Legal notice</LinkLabel></Link>
                <Link to="/privacy"><LinkLabel>Privacy</LinkLabel></Link>
                <a href="https://www.linkedin.com/in/florian-beermann" target="_blank" rel="noopener noreferrer"><LinkLabel>LinkedIn</LinkLabel></a>
              </nav>
            </div>
          </footer>
        </SectionScreen>
      </main>
    </div>
  );
}
