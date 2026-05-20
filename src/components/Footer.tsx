import { LineChart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Footer = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const getHref = (hash: string) => {
    return isHome ? hash : `/${hash}`;
  };

  return (
    <footer className="bg-primary text-primary-foreground py-12 border-t border-white/10">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 font-bold">
            <div className="h-8 w-8 rounded-lg bg-gradient-accent flex items-center justify-center">
              <LineChart className="h-4 w-4 text-accent-foreground" />
            </div>
          </div>
          <div className="text-sm text-white/50">
            © {new Date().getFullYear()} Florian Beermann
          </div>
        </div>
        <div className="flex gap-6 text-sm text-white/70 flex-wrap justify-center">
          <a href={getHref("#about")} className="hover:text-accent-glow transition-smooth">About</a>
          <a href={getHref("#services")} className="hover:text-accent-glow transition-smooth">Services</a>
          <a href={getHref("#contact")} className="hover:text-accent-glow transition-smooth">Contact</a>
          <Link to="/imprint" className="hover:text-accent-glow transition-smooth">Imprint</Link>
        </div>
      </div>
    </footer>
  );
};

