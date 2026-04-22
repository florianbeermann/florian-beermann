import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ValueProps } from "@/components/ValueProps";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "Florian Beermann — Customer Success Consulting | Scale NRR";
    const desc = "Data-driven Customer Success consulting for B2B SaaS. Reduce churn, drive expansion revenue, and operationalise CS with measurable outcomes.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ValueProps />
        <About />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
