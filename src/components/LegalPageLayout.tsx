import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import "@/pages/Sandbox.css";
import "./LegalPageLayout.css";

interface LegalPageLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  updated?: string;
  children: ReactNode;
  contentClassName?: string;
}

export const LegalPageLayout = ({
  eyebrow,
  title,
  description,
  updated,
  children,
  contentClassName = "",
}: LegalPageLayoutProps) => {
  const { pathname } = useLocation();

  return (
    <div className="sandbox-page legal-page">
      <a className="sandbox-skip" href="#legal-main">
        Skip to main content
      </a>

      <header className="sandbox-header">
        <Link className="sandbox-brand" to="/#sandbox-top" aria-label="Home">
          <img src="/logo.png" alt="" />
          <span>
            <strong>florian beermann</strong>
            <small>&amp; partners</small>
          </span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link to="/#sandbox-engagements">Engagements</Link>
          <Link to="/#sandbox-about">About</Link>
          <Link to="/#sandbox-contact">Contact</Link>
        </nav>
      </header>

      <main id="legal-main" className="legal-main">
        <header className="legal-hero">
          <p className="legal-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <div className="legal-hero-meta">
            <p>{description}</p>
            {updated ? <small>{updated}</small> : null}
          </div>
        </header>

        <div className={`legal-content ${contentClassName}`.trim()}>
          {children}
        </div>
      </main>

      <footer className="sandbox-footer">
        <span>
          florian beermann &amp; partners · © {new Date().getFullYear()}
        </span>
        <nav aria-label="Footer navigation">
          <Link to="/imprint" aria-current={pathname === "/imprint" ? "page" : undefined}>
            Imprint
          </Link>
          <Link to="/privacy" aria-current={pathname === "/privacy" ? "page" : undefined}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default LegalPageLayout;
