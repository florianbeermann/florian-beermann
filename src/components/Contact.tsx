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
import { Mail, Linkedin, MapPin, ArrowRight } from "lucide-react";

export const Contact = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Thanks — I'll be in touch within 2 business days.");
      (e.target as HTMLFormElement).reset();
    }, 700);
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-gradient-subtle">
      <div className="container grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="inline-block text-xs font-semibold uppercase tracking-wider text-accent mb-4">
              Get in touch
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance mb-6">
              Book a complimentary{" "}
              <span className="text-accent">CS audit</span>.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A focused 45-minute conversation to map your current Customer
              Success motion against benchmarks for retention, expansion and
              operational maturity.
            </p>
          </div>

          <div className="space-y-4">
            <a
              href="mailto:florian.beermann@gmail.com"
              className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent transition-smooth group"
            >
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent transition-smooth">
                <Mail className="h-5 w-5 text-accent group-hover:text-accent-foreground" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="font-medium text-foreground">
                  florian.beermann@gmail.com
                </div>
              </div>
            </a>
            <a
              href="https://linkedin.com/in/florian-beermann"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent transition-smooth group"
            >
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent transition-smooth">
                <Linkedin className="h-5 w-5 text-accent group-hover:text-accent-foreground" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">LinkedIn</div>
                <div className="font-medium text-foreground">
                  /in/florian-beermann
                </div>
              </div>
            </a>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Location</div>
                <div className="font-medium text-foreground">
                  Hamburg, Germany · Remote across EU
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="bg-card rounded-2xl shadow-elegant border border-border p-8 lg:p-10 space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" required placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" required placeholder="jane@company.com" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" required placeholder="Acme Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Your role</Label>
                <Input id="role" placeholder="VP Customer Success" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size">Company size</Label>
                <Select>
                  <SelectTrigger id="size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-50">1–50 employees</SelectItem>
                    <SelectItem value="51-200">51–200 employees</SelectItem>
                    <SelectItem value="201-1000">201–1,000 employees</SelectItem>
                    <SelectItem value="1001-5000">1,001–5,000 employees</SelectItem>
                    <SelectItem value="5000+">5,000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tooling">Current CS tooling</Label>
                <Select>
                  <SelectTrigger id="tooling">
                    <SelectValue placeholder="Select tooling" />
                  </SelectTrigger>
                  <SelectContent>
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
              <Label htmlFor="message">What would you like to solve?</Label>
              <Textarea
                id="message"
                rows={4}
                placeholder="Briefly describe your current CS challenge or goal…"
              />
            </div>

            <Button type="submit" variant="accent" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Sending…" : "Request CS audit"}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Your information is kept confidential and never shared with third parties.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
