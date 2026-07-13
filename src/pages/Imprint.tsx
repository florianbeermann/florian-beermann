import { useEffect } from "react";
import { Mail, Phone, Scale } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { setPageMetadata } from "@/lib/metadata";

export const Imprint = () => {
  useEffect(() => {
    setPageMetadata({
      title: "Imprint | florian beermann & partners",
      description: "Legal information and contact details for florian beermann & partners.",
      path: "/imprint",
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
                <Scale className="h-3.5 w-3.5" aria-hidden="true" />
                Legal information
              </div>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">Imprint</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">Information pursuant to Section 5 of the German Digital Services Act (DDG).</p>
            </header>

            <div className="grid md:grid-cols-3 gap-10 pt-4">
              <aside className="md:col-span-1 space-y-4">
                <div className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-5">
                  <h2 className="font-semibold text-foreground text-sm uppercase tracking-wider">Contact</h2>
                  <div className="flex gap-3">
                    <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">Email</div>
                      <a href="mailto:hello@florianbeermann.com" className="break-all font-medium text-foreground hover:text-primary">hello@florianbeermann.com</a>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="text-xs text-muted-foreground">Phone</div>
                      <a href="tel:+491629186291" className="font-medium text-foreground hover:text-primary">+49 162 918 6291</a>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="md:col-span-2 space-y-8 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <section className="space-y-3">
                  <h2 className="text-xl font-semibold text-foreground">Service provider</h2>
                  <p>
                    <strong className="text-foreground">Florian Beermann</strong><br />
                    trading as florian beermann &amp; partners<br />
                    Hegestr. 31<br />
                    20249 Hamburg<br />
                    Germany
                  </p>
                </section>

                <section className="space-y-3 border-t border-border pt-6">
                  <h2 className="text-xl font-semibold text-foreground">Responsible for editorial content</h2>
                  <p>Florian Beermann, at the address stated above, is responsible for editorial content pursuant to Section 18(2) of the German State Media Treaty (MStV).</p>
                </section>

                <section className="space-y-3 border-t border-border pt-6">
                  <h2 className="text-xl font-semibold text-foreground">Consumer dispute resolution</h2>
                  <p>We are neither willing nor obliged to participate in dispute resolution proceedings before a consumer arbitration board.</p>
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
