import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";

export interface EnquiryDraft {
  name: string;
  email: string;
  company: string;
  message: string;
  size: string;
  tooling: string;
  otherTooling: string;
  detailsOpen: boolean;
}

export const emptyEnquiry: EnquiryDraft = {
  name: "",
  email: "",
  company: "",
  message: "",
  size: "",
  tooling: "",
  otherTooling: "",
  detailsOpen: false,
};

export type EnquirySubmission =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent" }
  | { status: "email"; href: string }
  | { status: "error"; message: string };

export const EnquiryContext = createContext<{
  draft: EnquiryDraft;
  setDraft: Dispatch<SetStateAction<EnquiryDraft>>;
  submission: EnquirySubmission;
  setSubmission: Dispatch<SetStateAction<EnquirySubmission>>;
} | null>(null);

export function useEnquiry() {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error("Enquiry fields must be rendered inside EnquiryProvider.");
  }
  return context;
}
