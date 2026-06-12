import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, Linkedin, MapPin } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";

export const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [size, setSize] = useState("");
  const [tooling, setTooling] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    
    // Explicitly set values for Web3Forms submission
    fd.set("size", size);
    fd.set("tooling", tooling);
    fd.set("access_key", import.meta.env.VITE_WEB3FORMS_KEY || "YOUR_ACCESS_KEY");
    fd.set("subject", `New CS Audit Request from ${fd.get("name") || "Client"}`);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Form submission failed");
      }

      toast.success("Thanks - I'll be in touch within 2 business days.");
      form.reset();
      setSize("");
      setTooling("");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please email hello@florianbeermann.com directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-gradient-subtle relative">
      <div className="container max-w-6xl grid lg:grid-cols-12 gap-16 items-start">
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-8 text-left">
          <div className="space-y-4">
            <div className="text-[10px] uppercase tracking-widest text-accent font-semibold">
              Get in touch
            </div>
            <h2 className="text-4xl md:text-5xl text-foreground text-balance">
              Book a complimentary audit
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed font-light">
              A focused 45-minute conversation to map your current Customer
              Success motion against benchmarks for retention, expansion and
              operational maturity.
            </p>
          </div>

          <div className="space-y-4">
            <Magnetic>
              <a
                href="mailto:hello@florianbeermann.com"
                className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/80 hover:border-accent/60 shadow-card transition-smooth group"
              >
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent transition-smooth shrink-0">
                  <Mail className="h-5 w-5 text-accent group-hover:text-accent-foreground" />
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Email</div>
                  <div className="text-sm font-medium text-foreground mt-0.5">
                    hello@florianbeermann.com
                  </div>
                </div>
              </a>
            </Magnetic>

            <Magnetic>
              <a
                href="https://linkedin.com/in/florian-beermann"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/80 hover:border-accent/60 shadow-card transition-smooth group"
              >
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent transition-smooth shrink-0">
                  <Linkedin className="h-5 w-5 text-accent group-hover:text-accent-foreground" />
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">LinkedIn</div>
                  <div className="text-sm font-medium text-foreground mt-0.5">
                    /in/florian-beermann
                  </div>
                </div>
              </a>
            </Magnetic>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/85 shadow-card">
              <div className="h-10 w-10 rounded-xl bg-accent/5 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Location</div>
                <div className="text-sm font-medium text-foreground mt-0.5">
                  Europe
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            name="contact"
            data-netlify="true"
            className="bg-card rounded-3xl shadow-elegant border border-border/80 p-8 lg:p-10 space-y-6 text-left"
          >
            <input type="hidden" name="form-name" value="contact" />
            <input type="hidden" name="size" value={size} />
            <input type="hidden" name="tooling" value={tooling} />
            
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold text-foreground uppercase tracking-widest">Full name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  placeholder="Jane Doe" 
                  className="rounded-xl border-border/80 focus-visible:ring-accent py-5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold text-foreground uppercase tracking-widest">Work email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="jane@company.com" 
                  className="rounded-xl border-border/80 focus-visible:ring-accent py-5"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-xs font-semibold text-foreground uppercase tracking-widest">Company</Label>
                <Input 
                  id="company" 
                  name="company" 
                  required 
                  placeholder="Acme Inc." 
                  className="rounded-xl border-border/80 focus-visible:ring-accent py-5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-xs font-semibold text-foreground uppercase tracking-widest">Your role</Label>
                <Input 
                  id="role" 
                  name="role" 
                  placeholder="VP Customer Success" 
                  className="rounded-xl border-border/80 focus-visible:ring-accent py-5"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="size" className="text-xs font-semibold text-foreground uppercase tracking-widest">Company size</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger 
                    id="size" 
                    className="rounded-xl border-border/80 focus:ring-accent py-5"
                  >
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/80 shadow-elegant">
                    <SelectItem value="1-50">1–50 employees</SelectItem>
                    <SelectItem value="51-200">51–200 employees</SelectItem>
                    <SelectItem value="201-1000">201–1,000 employees</SelectItem>
                    <SelectItem value="1001-5000">1,001–5,000 employees</SelectItem>
                    <SelectItem value="5000+">5,000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tooling" className="text-xs font-semibold text-foreground uppercase tracking-widest">Current CS tooling</Label>
                <Select value={tooling} onValueChange={setTooling}>
                  <SelectTrigger 
                    id="tooling" 
                    className="rounded-xl border-border/80 focus:ring-accent py-5"
                  >
                    <SelectValue placeholder="Select tooling" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/80 shadow-elegant">
                    <SelectItem value="gainsight">Gainsight</SelectItem>
                    <SelectItem value="churnzero">ChurnZero</SelectItem>
                    <SelectItem value="salesforce">Salesforce</SelectItem>
                    <SelectItem value="vitally">Vitally</SelectItem>
                    <SelectItem value="hubspot">HubSpot</SelectItem>
                    <SelectItem value="planhat">Planhat</SelectItem>
                    <SelectItem value="custom">Custom / In-house</SelectItem>
                    <SelectItem value="none">None yet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-xs font-semibold text-foreground uppercase tracking-widest">What would you like to solve?</Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Briefly describe your current CS challenge or goal…"
                className="rounded-xl border-border/80 focus-visible:ring-accent"
              />
            </div>

            <Magnetic>
              <Button 
                type="submit" 
                variant="default" 
                size="lg" 
                className="w-full rounded-full uppercase tracking-wider text-xs font-semibold py-6 h-auto text-white" 
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Send"}
              </Button>
            </Magnetic>

            <p className="text-[10px] text-muted-foreground text-center">
              Your information is kept confidential and never shared with third parties.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
