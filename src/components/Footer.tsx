import { LineChart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12 border-t border-white/10">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 font-bold">
            <div className="h-8 w-8 rounded-lg bg-gradient-accent flex items-center justify-center">
              <LineChart className="h-4 w-4 text-accent-foreground" />
            </div>
            <span>Beermann<span className="text-accent-glow">.XYZ</span></span>
          </div>
          <div className="text-sm text-white/50">
            © {new Date().getFullYear()} Florian Beermann · Customer Success Consulting
          </div>
        </div>
        <div className="flex gap-6 text-sm text-white/70">
          <a href="#about" className="hover:text-accent-glow transition-smooth">About</a>
          <a href="#services" className="hover:text-accent-glow transition-smooth">Services</a>
          <a href="#contact" className="hover:text-accent-glow transition-smooth">Contact</a>
        </div>
      </div>
    </footer>
  );
};
