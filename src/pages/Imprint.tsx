import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";
import { ShieldCheck, Mail, MapPin, Scale } from "lucide-react";

export const Imprint = () => {
  useEffect(() => {
    document.title = "Impressum / Imprint — Florian Beermann";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="space-y-8">
            {/* Header section */}
            <div className="space-y-4 border-b border-border pb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs text-accent font-medium">
                <Scale className="h-3.5 w-3.5" />
                <span>Rechtliche Angaben / Legal Disclosure</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                Impressum <span className="text-muted-foreground font-normal">/ Imprint</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Angaben gemäß § 5 DDG (ehemals TMG) / Legal disclosure required under German law.
              </p>
            </div>

            {/* Content grid */}
            <div className="grid md:grid-cols-3 gap-8 pt-4">
              {/* Left Column: Direct Info Cards */}
              <div className="md:col-span-1 space-y-4">
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
                  <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider text-accent">
                    Diensteanbieter
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex gap-3">
                      <ShieldCheck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground">Florian Beermann</div>
                        <div className="text-muted-foreground text-xs">Customer Success Consulting</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
                  <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider text-accent">
                    Kontakt / Contact
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex gap-3">
                      <Mail className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs text-muted-foreground">E-Mail</div>
                        <a href="mailto:florian@beermann.xyz" className="font-medium text-foreground hover:text-accent transition-smooth">
                          florian@beermann.xyz
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Detailed legal texts */}
              <div className="md:col-span-2 space-y-8 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-foreground">Anschrift / Address</h2>
                  <div className="bg-card border border-border rounded-xl p-5">
                    <div className="flex gap-3">
                      <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <div className="text-foreground font-medium">
                        Florian Beermann<br />
                        [Strasse und Hausnummer / Street Name and Number]<br />
                        [PLZ und Ort / ZIP and City]<br />
                        Hamburg, Germany
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg text-xs flex items-start gap-2">
                      <span className="font-bold">Hinweis:</span> Bitte ersetzen Sie diese Platzhalter im Repository (src/pages/Imprint.tsx) mit Ihrer vollständigen ladungsfähigen Anschrift, um den deutschen gesetzlichen Pflichten zu entsprechen.
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-foreground">Umsatzsteuer-ID / VAT ID</h2>
                  <p>
                    Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                    <span className="font-mono text-foreground">[Umsatzsteuer-ID / VAT ID - falls vorhanden / if applicable]</span>
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-foreground">Redaktionell verantwortlich / Responsible for Content</h2>
                  <p>
                    Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:<br />
                    <span className="text-foreground font-medium">Florian Beermann</span><br />
                    [Strasse und Hausnummer / Street Name and Number]<br />
                    [PLZ und Ort / ZIP and City]<br />
                    Hamburg, Germany
                  </p>
                </section>

                <section className="space-y-3 border-t border-border pt-6">
                  <h2 className="text-xl font-bold text-foreground">Streitbeilegung / Dispute Resolution</h2>
                  <p className="text-xs">
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
                    <a
                      href="https://ec.europa.eu/consumers/odr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-medium"
                    >
                      https://ec.europa.eu/consumers/odr
                    </a>
                    .<br />
                    Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit oder verpflichtet, an
                    Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                  <p className="text-xs mt-2">
                    The European Commission provides a platform for online dispute resolution (ODR):{" "}
                    <a
                      href="https://ec.europa.eu/consumers/odr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-medium"
                    >
                      https://ec.europa.eu/consumers/odr
                    </a>
                    .<br />
                    We are not willing or obligated to participate in dispute resolution proceedings before a consumer
                    arbitration board.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Imprint;
