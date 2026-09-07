import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Wordmark } from "@/components/Wordmark";
import { setPageMetadata } from "@/lib/metadata";
import "./NotFound.css";

const NotFound = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    setPageMetadata({
      title: "Page not found | Florian Beermann & Co.",
      description:
        "The page you requested does not exist on florianbeermann.com.",
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
          <Link to="/#engagements">Work</Link>
          <Link to="/#about">About</Link>
          <Link to="/#contact">Contact</Link>
        </nav>
      </header>

      <main id="notfound-main" className="notfound-main">
        <div className="notfound-inner">
          <p className="notfound-code">Error 404</p>
          <div className="notfound-body">
            <h1>This page does not exist.</h1>
            <p>
              The address you followed may be out of date, or the page may have
              moved. Everything below will get you back on track.
            </p>
            <nav className="notfound-links" aria-label="Suggested pages">
              <Link to="/">Homepage</Link>
              <Link to="/#engagements">Engagements</Link>
              <Link to="/#contact">Contact</Link>
              <a href="mailto:hello@florianbeermann.com">Email directly</a>
            </nav>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <span>
          Florian Beermann &amp; Co. · © {new Date().getFullYear()}
        </span>
        <nav aria-label="Footer navigation">
          <Link to="/imprint">Imprint</Link>
          <Link to="/privacy">Privacy</Link>
        </nav>
      </footer>
    </div>
  );
};

export default NotFound;
