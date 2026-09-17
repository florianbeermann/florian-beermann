import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Wordmark } from "@/components/Wordmark";
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
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const state: unknown = location.state;
  const fromEnquiry = typeof state === "object" && state !== null && "from" in state && state.from === "enquiry";

  return (
    <div className="site-page legal-page">
      <header className="site-header">
        <Link className="site-brand" to="/" aria-label="Beermann &amp; Company, home">
          <Wordmark className="site-brand-lockup" />
        </Link>
        <nav aria-label="Primary navigation">
          <Link to="/#services">Services</Link>
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
            {fromEnquiry && (
              <button type="button" className="legal-return" onClick={() => navigate(-1)}>
                Return to your enquiry
              </button>
            )}
          </div>
        </header>

        <div className={`legal-content ${contentClassName}`.trim()}>
          {children}
        </div>
      </main>

      <footer className="site-footer">
        <span>
          Beermann &amp; Company · © {new Date().getFullYear()}
        </span>
        <nav aria-label="Footer navigation">
          <Link to="/imprint" aria-current={pathname === "/imprint" ? "page" : undefined}>
            Legal notice
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
