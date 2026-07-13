import { useEffect } from "react";
import { Database, Globe, Scale, Shield } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { setPageMetadata } from "@/lib/metadata";

export const Privacy = () => {
  useEffect(() => {
    setPageMetadata({
      title: "Privacy Policy | florian beermann & partners",
      description: "Information about how personal data is processed on florianbeermann.com.",
      path: "/privacy",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main id="main-content" className="flex-grow pt-36 pb-24">
        <div className="container max-w-4xl">
          <div className="space-y-8">
            <header className="space-y-4 border-b border-border pb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary font-medium">
                <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                Data protection
              </div>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">Privacy Policy</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">How personal data is processed when you visit this website or contact us.</p>
              <p className="text-xs text-muted-foreground">Last updated: 13 July 2026</p>
            </header>

            <div className="space-y-12 text-sm sm:text-base text-muted-foreground leading-relaxed">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2"><Scale className="h-5 w-5 text-primary" aria-hidden="true" />1. Controller</h2>
                <p>
                  Florian Beermann, trading as <strong className="text-foreground">florian beermann &amp; partners</strong><br />
                  Hegestr. 31, 20249 Hamburg, Germany<br />
                  Email: <a href="mailto:hello@florianbeermann.com" className="font-medium text-primary hover:underline">hello@florianbeermann.com</a>
                </p>
              </section>

              <section className="space-y-4 border-t border-border pt-8">
                <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2"><Globe className="h-5 w-5 text-primary" aria-hidden="true" />2. Website hosting and server logs</h2>
                <p>This website is hosted by Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Germany. Hetzner may process technical access data including IP address, time of request, requested resource, referrer, browser and operating-system information in server logs.</p>
                <p>Processing is based on Article 6(1)(f) GDPR. Our legitimate interest is the secure, reliable and efficient delivery of the website. Log retention is governed by the hosting configuration and applicable security and legal requirements.</p>
                <p><a href="https://www.hetzner.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">Hetzner privacy policy</a></p>
              </section>

              <section className="space-y-4 border-t border-border pt-8">
                <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2"><Database className="h-5 w-5 text-primary" aria-hidden="true" />3. Contact requests and Web3Forms</h2>
                <p>When you contact us, we process the information you provide—such as your name, work email, company, optional company context and message—to respond to your request and manage any resulting business relationship.</p>
                <p>Processing is based on Article 6(1)(b) GDPR where your request concerns pre-contractual measures and otherwise on Article 6(1)(f) GDPR, reflecting our legitimate interest in responding to business enquiries. We retain correspondence only as long as necessary for those purposes and any applicable statutory retention obligations.</p>
                <p>The website form uses Web3Forms, a service operated by Web3Creative. Form data is transmitted to Web3Forms and forwarded to our email inbox. According to Web3Forms, submissions are not stored as form records, while server logs containing personal data may be retained for up to two months. Web3Forms states that its servers are located in the United States and that its parent business is registered in India. This therefore involves processing outside the European Economic Area.</p>
                <p>For details, see the <a href="https://docs.web3forms.com/getting-started/faq" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">Web3Forms privacy and GDPR information</a>. You can avoid using Web3Forms by contacting us directly by email.</p>
              </section>

              <section className="space-y-4 border-t border-border pt-8">
                <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2"><Shield className="h-5 w-5 text-primary" aria-hidden="true" />4. Fonts, external links and cookies</h2>
                <p>The fonts used by this website are hosted locally and are not loaded from Google or another font provider. This website does not use analytics, advertising trackers or marketing cookies.</p>
                <p>The website contains an external link to LinkedIn. No data is sent to LinkedIn merely by displaying the link. If you follow it, LinkedIn processes data under its own responsibility and privacy terms.</p>
              </section>

              <section className="space-y-4 border-t border-border pt-8">
                <h2 className="text-2xl font-semibold text-foreground">5. Your rights</h2>
                <p>Subject to the conditions of the GDPR, you may have rights of access, rectification, erasure, restriction, data portability and objection. You may also lodge a complaint with a data protection supervisory authority.</p>
                <p>The competent local authority is the Hamburg Commissioner for Data Protection and Freedom of Information. More information is available at <a href="https://datenschutz-hamburg.de/" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">datenschutz-hamburg.de</a>.</p>
                <p>To exercise your rights or ask a privacy question, email <a href="mailto:hello@florianbeermann.com" className="font-medium text-primary hover:underline">hello@florianbeermann.com</a>.</p>
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
