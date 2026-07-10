import { Link, useLocation } from "react-router-dom";

export const Footer = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const getHref = (hash: string) => {
    return isHome ? hash : `/${hash}`;
  };

  return (
    <footer className="bg-slate-50 text-foreground py-12 border-t border-border">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="/logo.png"
              alt="florian beermann & partners"
              className="h-10 w-10 object-contain hover:opacity-80 transition-opacity duration-300 pointer-events-none"
            />
            <span
              className="font-light text-sm font-logo-screenshot tracking-tighter text-foreground lowercase whitespace-nowrap"
              style={{ fontFeatureSettings: "'ss01'" }}
            >
              florian beermann & partners
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}
          </div>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground flex-wrap justify-center">
          <a href={getHref("#about")} className="hover:text-accent transition-smooth">About</a>
          <a href={getHref("#services")} className="hover:text-accent transition-smooth">Services</a>
          <a href={getHref("#contact")} className="hover:text-accent transition-smooth">Contact</a>
          <Link to="/imprint" className="hover:text-accent transition-smooth">Imprint</Link>
          <Link to="/privacy" className="hover:text-accent transition-smooth">Privacy</Link>
        </div>
      </div>
    </footer>
  );
};
