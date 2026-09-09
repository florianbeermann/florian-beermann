import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Wordmark } from "@/components/Wordmark";
import { pageMetadata, setPageMetadata } from "@/lib/metadata";
import "./NotFound.css";

const NotFound = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    setPageMetadata({
      ...pageMetadata.notFound,
      path: pathname,
    });
  }, [pathname]);

  return (
    <div className="site-page notfound-page">
      <header className="site-header">
        <Link className="site-brand" to="/" aria-label="Florian Beermann &amp; Co., home">
          {/* The whole lockup, as on the legal pages — see LegalPageLayout. */}
          <Wordmark className="site-brand-lockup" />
        </Link>
        <nav aria-label="Primary navigation">
          <Link to="/#engagements">Services</Link>
          <Link to="/#about">About</Link>
          <Link to="/#contact">Contact</Link>
        </nav>
      </header>

      <main id="notfound-main" className="notfound-main">
        <div className="notfound-inner">
          <p className="notfound-code">Error 404</p>
          <div className="notfound-body">
            <h1>Page not found</h1>
            <p>
              This page may have moved, or the address may be incorrect.
            </p>
            <Link className="notfound-primary" to="/">Back to homepage</Link>
            <nav className="notfound-links" aria-label="Suggested pages">
              <Link to="/#engagements">View services</Link>
              <a href="mailto:hello@florianbeermann.com">Email me directly</a>
            </nav>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <span>
          Florian Beermann &amp; Co. · © {new Date().getFullYear()}
        </span>
        <nav aria-label="Footer navigation">
          <Link to="/imprint">Legal notice</Link>
          <Link to="/privacy">Privacy</Link>
        </nav>
      </footer>
    </div>
  );
};

export default NotFound;
