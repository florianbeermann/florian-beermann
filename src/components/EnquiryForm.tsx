import { useEffect, useRef, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { LinkLabel } from "@/components/LinkLabel";
import { emptyEnquiry, useEnquiry, type EnquiryDraft } from "@/lib/enquiry";

const contactEmail = "hello@florianbeermann.com";

export function EnquiryForm() {
  const { draft, setDraft, submission, setSubmission } = useEnquiry();
  const accessKey = import.meta.env.VITE_WEB3FORMS_KEY?.trim();
  const usesEmail = !accessKey;
  const submitting = submission.status === "sending";
  const notice = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (submission.status === "sent" || submission.status === "email" || submission.status === "error") {
      notice.current?.focus();
    }
  }, [submission.status]);

  const updateField = <Key extends keyof EnquiryDraft>(field: Key, value: EnquiryDraft[Key]) => {
    setDraft(current => ({ ...current, [field]: value }));
    setSubmission({ status: "idle" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const formData = new FormData(event.currentTarget);
    const subject = `Customer Success enquiry: ${draft.company.trim()}`;
    if (!accessKey) {
      const body = [
        `Name: ${draft.name}`,
        `Work email: ${draft.email}`,
        `Company: ${draft.company}`,
        "",
        draft.message,
      ].join("\n");
      const href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setSubmission({ status: "email", href });
      return;
    }

    setSubmission({ status: "sending" });
    formData.set("access_key", accessKey);
    formData.set("from_name", "Beermann & Company website");
    formData.set("subject", subject);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result: unknown = await response.json();
      if (
        !response.ok || typeof result !== "object" || result === null ||
        !("success" in result) || result.success !== true
      ) {
        throw new Error("The form service did not accept the message.");
      }
      setDraft({ ...emptyEnquiry, detailsOpen: true });
      setSubmission({ status: "sent" });
      toast.success("Message sent. I will reply within two business days.");
    } catch (error) {
      console.error("Enquiry submission failed:", error);
      const message = "Your message was not sent. Your text is still in the form. Try again or email me directly.";
      setSubmission({ status: "error", message });
      toast.error(message);
    }
  };

  return (
    <details
      className="enquiry"
      open={draft.detailsOpen}
      onToggle={event => {
        const open = event.currentTarget.open;
        setDraft(current => current.detailsOpen === open ? current : { ...current, detailsOpen: open });
      }}
    >
      <summary>
        {usesEmail ? "Or prepare an enquiry" : "Or send an enquiry"}
        <span className="disclosure-symbol" aria-hidden="true" />
      </summary>
      <form id="enquiry-form" onSubmit={handleSubmit} aria-describedby="enquiry-help form-privacy">
        <p id="enquiry-help">
          {usesEmail
            ? "Complete these details to prepare a draft in your email app. Nothing is sent by this website."
            : "Name, work email, company and message are required. I will reply within two business days."}
        </p>
        <input type="checkbox" name="botcheck" hidden tabIndex={-1} autoComplete="off" />
        <fieldset disabled={submitting}>
          <div className="form-row">
            <label htmlFor="enquiry-name">Name
              <input id="enquiry-name" name="name" autoComplete="name" required value={draft.name} onChange={event => updateField("name", event.target.value)} />
            </label>
            <label htmlFor="enquiry-email">Work email
              <input id="enquiry-email" name="email" type="email" autoComplete="email" required value={draft.email} onChange={event => updateField("email", event.target.value)} />
            </label>
          </div>
          <label htmlFor="enquiry-company">Company
            <input id="enquiry-company" name="company" autoComplete="organization" required value={draft.company} onChange={event => updateField("company", event.target.value)} />
          </label>
          <label htmlFor="enquiry-message">What would you like to discuss?
            <textarea id="enquiry-message" name="message" rows={4} required value={draft.message} onChange={event => updateField("message", event.target.value)} />
          </label>
        </fieldset>
        <p className="form-privacy" id="form-privacy">
          {usesEmail
            ? "Nothing is sent until you send the draft in your email app. "
            : "This form uses Web3Forms to deliver your message to my inbox. "}
          <Link to="/privacy" state={{ from: "enquiry" }}><LinkLabel>Read the privacy policy</LinkLabel></Link>.
        </p>
        <button className="text-link" type="submit" disabled={submitting}>
          <LinkLabel>{submitting ? "Sending..." : usesEmail ? "Prepare email draft" : "Send message"}</LinkLabel>
          <svg viewBox="0 0 34 16" aria-hidden="true"><path d="M0 8h31M24 1l7 7-7 7" /></svg>
        </button>
        {(submission.status === "sent" || submission.status === "email" || submission.status === "error") && (
          <p id="draft-status" ref={notice} tabIndex={-1} role={submission.status === "error" ? "alert" : "status"}>
            {submission.status === "sent" && "Message sent. I will reply within two business days."}
            {submission.status === "email" && (
              <>Your draft is ready. <a href={submission.href}><LinkLabel>Open your email draft</LinkLabel></a>. Nothing has been sent. If no email app opens, copy your message and email {contactEmail}.</>
            )}
            {submission.status === "error" && (
              <>{submission.message} <a href={`mailto:${contactEmail}`}><LinkLabel>{contactEmail}</LinkLabel></a>.</>
            )}
          </p>
        )}
      </form>
    </details>
  );
}
