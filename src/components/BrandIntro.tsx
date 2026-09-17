import { createElement } from "react";
import { ChevronDown } from "lucide-react";
import "@/lib/gradient-background";
import { Wordmark } from "./Wordmark";
import "./BrandIntro.css";

export function BrandIntro() {
  return (
    <>
      <span className="site-stop" aria-hidden="true" />
      <section id="intro" className="brand-intro" aria-labelledby="intro-brand" data-masthead-ground="intro">
        {createElement("gradient-background", { id: "intro-background", "aria-hidden": true })}
        <div className="brand-intro-lockup">
          <p id="intro-brand"><Wordmark className="brand-intro-wordmark" layout="stacked" /></p>
        </div>
        <a className="brand-intro-scroll" href="#top" aria-label="Scroll to content">
          <ChevronDown size={24} strokeWidth={1.5} aria-hidden="true" />
        </a>
      </section>
    </>
  );
}
