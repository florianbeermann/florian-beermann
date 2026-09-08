import { useEffect } from "react";
import { LegalPageLayout } from "@/components/LegalPageLayout";
import { pageMetadata, setPageMetadata } from "@/lib/metadata";

export const Privacy = () => {
  useEffect(() => {
    setPageMetadata(pageMetadata.privacy);
  }, []);

  return (
    <LegalPageLayout
      title="Privacy policy"
      description="How personal data is processed when you visit this website or contact me."
      updated="Last updated: 7 September 2026"
      contentClassName="legal-privacy"
    >
      <div className="legal-sections">
        <section className="legal-section">
          <span className="legal-section-number">01</span>
          <div className="legal-section-copy">
            <h2>Who is responsible for your data</h2>
            <div className="legal-section-body">
              <p>
                Florian Beermann, trading as{" "}
                <strong>Florian Beermann &amp; Co.</strong>
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
                This website is hosted by Hetzner, Industriestr. 25, 91710
                Gunzenhausen, Germany. Its server logs may record your Internet
                Protocol address, the time of your visit, the pages or files you
                request, the referring page, and information about your browser
                and operating system.
              </p>
              <p>
                This processing is based on Article 6(1)(f) of the General Data
                Protection Regulation. It supports my legitimate interest in
                running a secure and reliable website. How long access logs are
                kept depends on the hosting settings and applicable security
                and legal requirements.
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
            <h2>What happens when you contact me</h2>
            <div className="legal-section-body">
              <p>
                When you contact me, I process the information you provide,
                including your name, work email, company and message, together
                with any optional details about company size and software. I use
                this information to answer your enquiry and manage any resulting
                business relationship.
              </p>
              <p>
                Where your enquiry concerns steps you ask me to take before
                entering into a contract, processing is based on Article 6(1)(b)
                of the General Data Protection Regulation. Other business
                enquiries are handled under Article 6(1)(f), based on my
                legitimate interest in responding to them. I keep correspondence
                for as long as needed for these purposes and any legal
                record-keeping obligations.
              </p>
              <p>
                Your unfinished message remains available while you visit other
                pages in this website. It is held in memory in your current
                browser tab, not saved to browser storage, and is cleared when
                you reload or close the page or successfully submit the form.
              </p>
              <p>
                When the form sends a message directly, it uses Web3Forms, a
                service operated by Web3Creative. Your form information is sent
                to Web3Forms and forwarded to my email inbox. According to Web3Forms,
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
                  Web3Forms privacy information
                </a>
                . You can avoid sending information to Web3Forms by emailing me
                directly. If the form instead offers to continue in your email
                app, it creates an email draft and does not send your information
                to Web3Forms.
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
                Under the conditions set out in the General Data Protection
                Regulation, you can request access to your personal data, ask
                for it to be corrected or deleted, request restrictions on its
                use, receive certain data in a reusable format, or object to
                processing. You can also complain to a data protection
                supervisory authority.
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
