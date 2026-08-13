import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import "./LegalPageLayout.css";

interface LegalPageLayoutProps {
  title: string;
  description: string;
  updated?: string;
  children: ReactNode;
  contentClassName?: string;
}

export const LegalPageLayout = ({
  title,
  description,
  updated,
  children,
  contentClassName = "",
}: LegalPageLayoutProps) => {
  const { pathname } = useLocation();

  return (
    <div className="site-page legal-page">
      <header className="site-header">
        <Link className="site-brand" to="/#top" aria-label="Florian Beermann &amp; Partners, home">
          <picture>
            <source media="(max-width: 680px)" srcSet="/logo-mark-on-ink.svg" />
            <img src="/logo-lockup-on-ink.svg" alt="" width="1255" height="378" />
          </picture>
        </Link>
        <nav aria-label="Primary navigation">
          <Link to="/#engagements">Engagements</Link>
          <Link to="/#about">About</Link>
          <Link to="/#contact">Contact</Link>
        </nav>
      </header>

      <main id="legal-main" className="legal-main">
        <header className="legal-hero">
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

      <footer className="site-footer">
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
