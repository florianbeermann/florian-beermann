import { useEffect } from "react";
import { LegalPageLayout } from "@/components/LegalPageLayout";
import { setPageMetadata } from "@/lib/metadata";

export const Imprint = () => {
  useEffect(() => {
    setPageMetadata({
      title: "Imprint | Florian Beermann & Partners",
      description:
        "Legal information and contact details for Florian Beermann & Partners.",
      path: "/imprint",
    });
  }, []);

  return (
    <LegalPageLayout
      title="Imprint"
      description="Information pursuant to Section 5 of the German Digital Services Act (DDG)."
      contentClassName="legal-imprint-grid"
    >
      <aside className="legal-contact" aria-labelledby="legal-contact-title">
        <h2 id="legal-contact-title">Direct contact</h2>
        <dl>
          <div>
            <dt>Email</dt>
            <dd>
              <a href="mailto:hello@florianbeermann.com">
                hello@florianbeermann.com
              </a>
            </dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>
              <a href="tel:+494089705822">+49 (0)40 89705822</a>
            </dd>
          </div>
        </dl>
      </aside>

      <div className="legal-sections">
        <section className="legal-section">
          <span className="legal-section-number">01</span>
          <div className="legal-section-copy">
            <h2>Service provider</h2>
            <div className="legal-section-body">
              <p>
                <strong>Florian Beermann</strong>
                <br />
                trading as Florian Beermann &amp; Partners
                <br />
                Hegestr. 31
                <br />
                20249 Hamburg
                <br />
                Germany
              </p>
            </div>
          </div>
        </section>

        <section className="legal-section">
          <span className="legal-section-number">02</span>
          <div className="legal-section-copy">
            <h2>Responsible for editorial content</h2>
            <div className="legal-section-body">
              <p>
                Florian Beermann, at the address stated above, is responsible
                for editorial content pursuant to Section 18(2) of the German
                State Media Treaty (MStV).
              </p>
            </div>
          </div>
        </section>

        <section className="legal-section">
          <span className="legal-section-number">03</span>
          <div className="legal-section-copy">
            <h2>Consumer dispute resolution</h2>
            <div className="legal-section-body">
              <p>
                I am neither willing nor obliged to participate in dispute
                resolution proceedings before a consumer arbitration board.
              </p>
            </div>
          </div>
        </section>
      </div>
    </LegalPageLayout>
  );
};

export default Imprint;
