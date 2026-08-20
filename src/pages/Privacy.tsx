import { useEffect } from "react";
import { LegalPageLayout } from "@/components/LegalPageLayout";
import { setPageMetadata } from "@/lib/metadata";

export const Privacy = () => {
  useEffect(() => {
    setPageMetadata({
      title: "Privacy policy | Florian Beermann & Partners",
      description:
        "Information about how personal data is processed on florianbeermann.com.",
      path: "/privacy",
    });
  }, []);

  return (
    <LegalPageLayout
      title="Privacy policy"
      description="How personal data is processed when you visit this website or contact me."
      updated="Last updated: 13 July 2026"
      contentClassName="legal-privacy"
    >
      <div className="legal-sections">
        <section className="legal-section">
          <span className="legal-section-number">01</span>
          <div className="legal-section-copy">
            <h2>Controller</h2>
            <div className="legal-section-body">
              <p>
                Florian Beermann, trading as{" "}
                <strong>Florian Beermann &amp; Partners</strong>
                <br />
                Hegestr. 31, 20249 Hamburg, Germany
                <br />
                Email:{" "}
                <a href="mailto:hello@florianbeermann.com">
                  hello@florianbeermann.com
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="legal-section">
          <span className="legal-section-number">02</span>
          <div className="legal-section-copy">
            <h2>Website hosting and server logs</h2>
            <div className="legal-section-body">
              <p>
                This website is hosted by Hetzner Online GmbH, Industriestr.
                25, 91710 Gunzenhausen, Germany. Hetzner may process technical
                access data including IP address, time of request, requested
                resource, referrer, browser and operating-system information in
                server logs.
              </p>
              <p>
                Processing is based on Article 6(1)(f) GDPR. My legitimate
                interest is the secure, reliable and efficient delivery of the
                website. Log retention is governed by the hosting configuration
                and applicable security and legal requirements.
              </p>
              <p>
                <a
                  href="https://www.hetzner.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hetzner privacy policy
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="legal-section">
          <span className="legal-section-number">03</span>
          <div className="legal-section-copy">
            <h2>Contact requests and Web3Forms</h2>
            <div className="legal-section-body">
              <p>
                When you contact me, I process the information you provide,
                such as your name, work email, company, optional company size
                and tooling, and message, to respond to your request and manage
                any resulting business relationship.
              </p>
              <p>
                Processing is based on Article 6(1)(b) GDPR where your request
                concerns pre-contractual measures and otherwise on Article
                6(1)(f) GDPR, reflecting my legitimate interest in responding
                to business enquiries. I retain correspondence only as long as
                necessary for those purposes and any applicable statutory
                retention obligations.
              </p>
              <p>
                The website form uses Web3Forms, a service operated by
                Web3Creative. Form data is transmitted to Web3Forms and
                forwarded to my email inbox. According to Web3Forms,
                submissions are not stored as form records, while server logs
                containing personal data may be retained for up to two months.
                Web3Forms states that its servers are located in the United
                States and that its parent business is registered in India.
                This therefore involves processing outside the European
                Economic Area.
              </p>
              <p>
                For details, see the{" "}
                <a
                  href="https://docs.web3forms.com/getting-started/faq"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Web3Forms privacy and GDPR information
                </a>
                . You can avoid using Web3Forms by contacting me directly by
                email.
              </p>
            </div>
          </div>
        </section>

        <section className="legal-section">
          <span className="legal-section-number">04</span>
          <div className="legal-section-copy">
            <h2>Fonts, external links and cookies</h2>
            <div className="legal-section-body">
              <p>
                The fonts used by this website are hosted locally and are not
                loaded from Google or another font provider. This website does
                not use analytics, advertising trackers or marketing cookies.
              </p>
              <p>
                The website contains an external link to LinkedIn. No data is
                sent to LinkedIn merely by displaying the link. If you follow
                it, LinkedIn processes data under its own responsibility and
                privacy terms.
              </p>
            </div>
          </div>
        </section>

        <section className="legal-section">
          <span className="legal-section-number">05</span>
          <div className="legal-section-copy">
            <h2>Your rights</h2>
            <div className="legal-section-body">
              <p>
                Subject to the conditions of the GDPR, you may have rights of
                access, rectification, erasure, restriction, data portability
                and objection. You may also lodge a complaint with a data
                protection supervisory authority.
              </p>
              <p>
                The competent local authority is the Hamburg Commissioner for
                Data Protection and Freedom of Information. More information is
                available at{" "}
                <a
                  href="https://datenschutz-hamburg.de/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  datenschutz-hamburg.de
                </a>
                .
              </p>
              <p>
                To exercise your rights or ask a privacy question, email{" "}
                <a href="mailto:hello@florianbeermann.com">
                  hello@florianbeermann.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </LegalPageLayout>
  );
};

export default Privacy;
