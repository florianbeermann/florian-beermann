import { useState } from "react";
import type { ReactNode } from "react";
import { EnquiryContext, emptyEnquiry, type EnquirySubmission } from "@/lib/enquiry";

export function EnquiryProvider({ children }: { children: ReactNode }) {
  // Keep drafts across page navigation without storing personal data on disk.
  const [draft, setDraft] = useState(() => ({ ...emptyEnquiry }));
  const [submission, setSubmission] = useState<EnquirySubmission>({ status: "idle" });

  return (
    <EnquiryContext.Provider value={{ draft, setDraft, submission, setSubmission }}>
      {children}
    </EnquiryContext.Provider>
  );
}
