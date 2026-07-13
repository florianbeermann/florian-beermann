import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ChevronDown, Linkedin, Mail, MapPin } from "lucide-react";

const contactEmail = "hello@florianbeermann.com";

export const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [size, setSize] = useState("");
  const [tooling, setTooling] = useState("");

  const openEmailFallback = (formData: FormData) => {
    const subject = encodeURIComponent(`Customer Success priorities — ${formData.get("company") || "website enquiry"}`);
    const body = encodeURIComponent([
      `Name: ${formData.get("name") || ""}`,
      `Work email: ${formData.get("email") || ""}`,
      `Company: ${formData.get("company") || ""}`,
      size ? `Company size: ${size}` : "",
      tooling ? `Current tooling: ${tooling}` : "",
      "",
      String(formData.get("message") || ""),
    ].filter(Boolean).join("\n"));
    window.location.assign(`mailto:${contactEmail}?subject=${subject}&body=${body}`);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY?.trim();

    if (!accessKey) {
      toast.info("Opening your email app so you can send this request directly.");
      openEmailFallback(formData);
      return;
    }

    setSubmitting(true);
    formData.set("size", size);
    formData.set("tooling", tooling);
    formData.set("access_key", accessKey);
    formData.set("from_name", "florian beermann & partners website");
    formData.set("subject", `New website enquiry from ${formData.get("name") || "a visitor"}`);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Form submission failed");

      toast.success("Thank you — I’ll respond within two business days.");
      form.reset();
      setSize("");
      setTooling("");
      setShowDetails(false);
    } catch (error) {
      console.error(error);
      toast.error(`Something went wrong. Please email ${contactEmail} directly.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-gradient-subtle relative">
      <div className="container max-w-6xl grid lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-5 min-w-0 space-y-8 text-left">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold">Get in touch</p>
            <h2 className="text-4xl md:text-5xl text-foreground text-balance">Discuss your Customer Success priorities</h2>
            <p className="text-base text-muted-foreground leading-relaxed font-light">
              Share the retention, expansion or operational challenge you are working through. I’ll respond with a practical view on whether and how I can help.
            </p>
          </div>

          <div className="space-y-4">
            <a href={`mailto:${contactEmail}`} className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/60 shadow-card transition-colors group">
              <span className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-primary transition-colors shrink-0">
                <Mail className="h-5 w-5 text-primary group-hover:text-primary-foreground" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Email</span>
                <span className="block text-sm font-medium text-foreground mt-0.5">{contactEmail}</span>
              </span>
            </a>

            <a href="https://linkedin.com/in/florian-beermann" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/60 shadow-card transition-colors group">
              <span className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-primary transition-colors shrink-0">
                <Linkedin className="h-5 w-5 text-primary group-hover:text-primary-foreground" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">LinkedIn</span>
                <span className="block text-sm font-medium text-foreground mt-0.5">/in/florian-beermann</span>
              </span>
            </a>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/85 shadow-card">
              <span className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Location</span>
                <span className="block text-sm font-medium text-foreground mt-0.5">Hamburg, working across Europe</span>
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 min-w-0">
          <form onSubmit={handleSubmit} className="bg-card rounded-3xl shadow-elegant border border-border/80 p-6 sm:p-8 lg:p-10 space-y-6 text-left">
            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
            <input type="hidden" name="size" value={size} />
            <input type="hidden" name="tooling" value={tooling} />

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" autoComplete="name" required placeholder="Jane Doe" className="rounded-xl border-border/80 focus-visible:ring-primary py-5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" name="email" type="email" autoComplete="email" required placeholder="jane@company.com" className="rounded-xl border-border/80 focus-visible:ring-primary py-5" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" name="company" autoComplete="organization" required placeholder="Acme Inc." className="rounded-xl border-border/80 focus-visible:ring-primary py-5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">What would you like to discuss?</Label>
              <Textarea id="message" name="message" rows={5} required placeholder="Briefly describe your current Customer Success priority…" className="rounded-xl border-border/80 focus-visible:ring-primary" />
            </div>

            <button
              type="button"
              onClick={() => setShowDetails((current) => !current)}
              className="flex w-full items-center justify-between rounded-xl border border-border/80 px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-expanded={showDetails}
              aria-controls="optional-details"
            >
              Add optional company context
              <ChevronDown className={`h-4 w-4 text-primary transition-transform ${showDetails ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>

            {showDetails && (
              <div id="optional-details" className="grid sm:grid-cols-2 gap-5 rounded-2xl bg-secondary/50 p-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Company size</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger id="size" className="rounded-xl border-border/80 focus:ring-primary"><SelectValue placeholder="Select size" /></SelectTrigger>
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
                  <Select value={tooling} onValueChange={setTooling}>
                    <SelectTrigger id="tooling" className="rounded-xl border-border/80 focus:ring-primary"><SelectValue placeholder="Select tooling" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gainsight">Gainsight</SelectItem>
                      <SelectItem value="churnzero">ChurnZero</SelectItem>
                      <SelectItem value="salesforce">Salesforce</SelectItem>
                      <SelectItem value="vitally">Vitally</SelectItem>
                      <SelectItem value="hubspot">HubSpot</SelectItem>
                      <SelectItem value="planhat">Planhat</SelectItem>
                      <SelectItem value="custom">Custom / in-house</SelectItem>
                      <SelectItem value="none">None yet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full rounded-full uppercase tracking-wider text-xs font-semibold py-6 h-auto" disabled={submitting}>
              {submitting ? "Sending…" : "Send request"}
            </Button>

            <p className="text-xs leading-relaxed text-muted-foreground text-center">
              Your request is processed through Web3Forms. Read the <Link to="/privacy" className="font-medium text-primary underline-offset-4 hover:underline">privacy policy</Link> for details.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
