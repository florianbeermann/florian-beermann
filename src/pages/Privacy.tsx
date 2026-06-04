import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";
import { Mail, Shield, Scale, Globe, Database } from "lucide-react";

export const Privacy = () => {
  useEffect(() => {
    document.title = "Datenschutzerklärung / Privacy Policy - Florian Beermann";
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
                <Shield className="h-3.5 w-3.5" />
                <span>Datenschutz / Data Protection (GDPR / DSGVO)</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                Datenschutzerklärung <span className="text-muted-foreground font-normal">/ Privacy Policy</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Informationen über die Erhebung und Verarbeitung personenbezogener Daten. / Information on the collection and processing of personal data.
              </p>
            </div>

            {/* Content sections */}
            <div className="space-y-12 text-sm sm:text-base text-muted-foreground leading-relaxed">
              
              {/* Section 1: General Info */}
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Scale className="h-5 w-5 text-accent" />
                  1. Allgemeine Hinweise & Pflichtinformationen / General Info
                </h2>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Verantwortliche Stelle / Data Controller</h3>
                  <p>
                    Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br />
                    <span className="text-foreground font-medium">florian beermann & partners</span><br />
                    Hegestr. 31<br />
                    20249 Hamburg<br />
                    Germany<br />
                    E-Mail: <a href="mailto:hello@florianbeermann.com" className="text-accent hover:underline">hello@florianbeermann.com</a>
                  </p>
                  <p className="text-xs">
                    Die verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.<br />
                    The data controller is the natural or legal person who alone or jointly with others determines the purposes and means of processing personal data.
                  </p>
                </div>
              </section>

              {/* Section 2: Hosting */}
              <section className="space-y-4 border-t border-border pt-8">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Globe className="h-5 w-5 text-accent" />
                  2. Hosting & Bereitstellung / Hosting
                </h2>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Hetzner Online</h3>
                  <p>
                    Wir hosten unsere Website bei der <strong>Hetzner Online GmbH</strong> (Industriestr. 25, 91710 Gunzenhausen, Deutschland). Details entnehmen Sie der Datenschutzerklärung von Hetzner:{" "}
                    <a href="https://www.hetzner.com/de/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      Hetzner Privacy Policy
                    </a>.
                  </p>
                  <p>
                    Die Verwendung von Hetzner erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer möglichst zuverlässigen und sicheren Darstellung unserer Website.
                  </p>
                  <p className="text-xs">
                    Our website is hosted by Hetzner Online GmbH. Processing is based on Art. 6 (1) (f) GDPR to ensure the security, integrity, and reliable delivery of our static web contents.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="font-semibold text-foreground">Server-Log-Dateien / Server Log Files</h3>
                  <p>
                    Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt:<br />
                    • Browsertyp und Browserversion<br />
                    • Verwendetes Betriebssystem<br />
                    • Referrer URL<br />
                    • Hostname des zugreifenden Rechners<br />
                    • Uhrzeit der Serveranfrage<br />
                    • IP-Adresse
                  </p>
                  <p className="text-xs">
                    These log files are technically necessary and are not merged with other data sources. They are processed on the basis of Art. 6 (1) (f) GDPR to maintain stable server operations.
                  </p>
                </div>
              </section>

              {/* Section 3: Contact Form & Third Party Forms */}
              <section className="space-y-4 border-t border-border pt-8">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Database className="h-5 w-5 text-accent" />
                  3. Datenerfassung auf dieser Website / Data Collection
                </h2>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Kontaktformular / Contact Form</h3>
                  <p>
                    Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                  </p>
                  <p>
                    Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="font-semibold text-foreground">Web3Forms</h3>
                  <p>
                    Für das Absenden unseres Kontaktformulars nutzen wir den Dienst <strong>Web3Forms</strong> (betrieben von Web3Forms). Wenn Sie das Formular absenden, werden die Formulardaten zur Übertragung an unsere E-Mail-Adresse verschlüsselt an die Server von Web3Forms übertragen. 
                  </p>
                  <p>
                    Die Nutzung dieses Dienstes erfolgt zur sicheren und effizienten Verarbeitung Ihrer Kontaktanfrage auf Grundlage unseres berechtigten Interesses nach Art. 6 Abs. 1 lit. f DSGVO. Die Daten werden nach Bearbeitung Ihrer Anfrage gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
                  </p>
                  <p className="text-xs">
                    We use Web3Forms to securely deliver form submissions to our email. Submitting the form securely transmits your entries to Web3Forms servers. This processing is based on Art. 6 (1) (f) GDPR.
                  </p>
                </div>
              </section>

              {/* Section 4: Data Rights */}
              <section className="space-y-4 border-t border-border pt-8">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Shield className="h-5 w-5 text-accent" />
                  4. Ihre Rechte / Your Rights under GDPR
                </h2>
                
                <p>
                  Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung oder Löschung dieser Daten.
                </p>
                <p>
                  Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
                </p>
                <p className="text-xs">
                  Under the GDPR, you have the right to request access to, rectification of, or erasure of your personal data. You also have the right to restrict processing, object to processing, and data portability. To exercise these rights, please contact us at hello@florianbeermann.com.
                </p>
              </section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
