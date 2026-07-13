import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ValueProps } from "@/components/ValueProps";
import { DataOrchestration } from "@/components/DataOrchestration";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ExperienceStrip } from "@/components/ExperienceStrip";

import { useEffect } from "react";
import { setPageMetadata } from "@/lib/metadata";

const Index = () => {
  useEffect(() => {
    setPageMetadata({
      title: "florian beermann & partners | Customer Success Strategy",
      description: "Practical Customer Success strategy, playbooks and operations for B2B SaaS teams focused on retention and expansion.",
      path: "/",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-x-clip">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed left-4 top-4 z-[100] rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-elegant"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <ExperienceStrip />
        <ValueProps />
        <DataOrchestration />
        <About />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
