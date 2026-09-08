import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EnquiryProvider } from "@/components/EnquiryProvider";
import Home from "@/pages/Home";
import Privacy from "@/pages/Privacy";

const renderHome = () =>
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <EnquiryProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </EnquiryProvider>
    </MemoryRouter>,
  );

const fillRequiredFields = () => {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Jane Doe" } });
  fireEvent.change(screen.getByLabelText("Work email"), { target: { value: "jane@example.com" } });
  fireEvent.change(screen.getByLabelText("Company"), { target: { value: "Example company" } });
  fireEvent.change(screen.getByLabelText("What would you like to discuss?"), {
    target: { value: "Our customers have different onboarding needs." },
  });
};

const originalLocation = Object.getOwnPropertyDescriptor(window, "location")!;

beforeEach(() => {
  vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  Object.defineProperty(window, "location", originalLocation);
});

describe("homepage", () => {
  it("leads with changing customers rather than an exclusively upmarket offer", () => {
    renderHome();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Your customers have changed. Your approach should too.",
    );
    expect(screen.getByText(/I help software companies adapt Customer Success/)).toHaveTextContent(
      "different business customers",
    );
    for (const action of screen.getAllByRole("link", { name: "Get in touch" })) {
      expect(action).toHaveAttribute("href", "#contact");
    }
    expect(document.querySelector(".hero-loader")).not.toBeInTheDocument();
  });

  it("keeps the portrait in the responsibility section rather than employment evidence", () => {
    renderHome();
    const proof = screen.getByRole("region", { name: "Where I have worked" });
    const about = screen.getByRole("region", { name: "Responsible for renewals and growth." });
    const portrait = within(about).getByRole("img", { name: "Florian Beermann" });
    expect(portrait).toHaveAttribute("src", "/portrait.jpg");
    expect(portrait).toHaveAttribute("width", "723");
    expect(portrait).toHaveAttribute("height", "1086");
    expect(within(proof).queryByRole("img", { name: "Florian Beermann" })).not.toBeInTheDocument();
    expect(within(proof).getByText("Previous employers, not consultancy clients.")).toBeInTheDocument();
  });

  it("keeps the hero copy without duplicating the header links", () => {
    renderHome();
    const hero = document.getElementById("top")!;
    expect(within(hero).getByText(/Clear account ownership, repeatable onboarding/)).toBeInTheDocument();
    expect(within(hero).queryAllByRole("link")).toHaveLength(0);
    const contact = screen.getByRole("link", { name: "Get in touch" });
    expect(contact).toHaveAttribute("href", "#contact");
    expect(contact.closest("header")).toHaveClass("site-masthead");
  });

  it("keeps the three services in the original scroll-driven sequence", () => {
    renderHome();
    const articles = screen.getAllByRole("article");
    expect(articles.map((article) => article.querySelector("h3")?.textContent)).toEqual([
      "Customer Success strategy",
      "Customer lifecycle processes",
      "Customer Success team training",
    ]);
    expect(screen.queryByRole("navigation", { name: "Choose a service" })).not.toBeInTheDocument();
    for (const article of articles) {
      expect(within(article).getAllByRole("listitem")).toHaveLength(4);
      expect(article.parentElement).toHaveClass("home-engagement-reel");
    }
    expect(document.querySelectorAll(".home-engagement-steps > span")).toHaveLength(3);
    expect(document.querySelector(".home-engagement-progress")).toHaveAttribute("aria-hidden", "true");
  });

  it("addresses changing-customer-base decisions rather than teaching the basics", () => {
    renderHome();
    const section = screen.getByRole("region", {
      name: "Keep what works. Change what no longer fits.",
    });
    expect(section).toHaveClass("site-voltage", "site-panel");
    expect(section.previousElementSibling).toHaveClass("site-stop");
    expect(within(section).getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)).toEqual([
      "Customer fit",
      "Service choices",
      "The transition",
    ]);
    expect(within(section).getByRole("list").tagName).toBe("UL");
    expect(within(section).getAllByRole("listitem")).toHaveLength(3);
    expect(section).toHaveTextContent("Separate a shift in customer needs from a gap in execution.");
    expect(section).toHaveTextContent("Balance those choices against team capacity");
    expect(section).toHaveTextContent("existing customer commitments and renewal cycles");
    expect(section).not.toHaveTextContent("For example");
    expect(screen.queryByRole("heading", { name: "Turn customer data into clear next steps." })).not.toBeInTheDocument();
  });

  it("reveals optional company details without hiding required fields", () => {
    renderHome();
    expect(screen.queryByText("Company size")).not.toBeInTheDocument();
    const toggle = screen.getByRole("button", { name: "Add company details (optional)" });
    expect(document.getElementById(toggle.getAttribute("aria-controls")!)).toBeInTheDocument();
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Company size")).toBeInTheDocument();
    expect(screen.getByText("Customer Success software")).toBeInTheDocument();
  });

  it("keeps the complete enquiry when the visitor reads the privacy policy and returns", () => {
    renderHome();
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Add company details (optional)" }));
    fireEvent.click(screen.getByRole("link", { name: "Read the privacy policy" }));
    expect(screen.getByRole("heading", { level: 1, name: "Privacy policy" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Return to your enquiry" }));
    expect(screen.getByLabelText("Name")).toHaveValue("Jane Doe");
    expect(screen.getByLabelText("Work email")).toHaveValue("jane@example.com");
    expect(screen.getByLabelText("Company")).toHaveValue("Example company");
    expect(screen.getByLabelText("What would you like to discuss?")).toHaveValue(
      "Our customers have different onboarding needs.",
    );
    expect(screen.getByRole("button", { name: "Add company details (optional)" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("explains the email fallback before opening a draft and keeps the unsent message", () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "");
    const assign = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, assign },
    });
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    renderHome();
    expect(screen.getByText(/Nothing is sent until you send that email/)).toBeInTheDocument();
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Continue in email" }));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(assign).toHaveBeenCalledTimes(1);
    const href = assign.mock.calls[0][0] as string;
    expect(href.startsWith("mailto:hello@florianbeermann.com")).toBe(true);
    expect(decodeURIComponent(href)).toContain("Jane Doe");
    expect(decodeURIComponent(href)).toContain("Our customers have different onboarding needs.");
    expect(screen.getByRole("link", { name: "Open the email draft again" })).toHaveAttribute("href", href);
    expect(screen.getByText(/Your message has not been sent yet/)).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Jane Doe");
  });

  it("posts a message, clears the draft and leaves a persistent success notice", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    );
    renderHome();
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("https://api.web3forms.com/submit");
    expect(JSON.parse(String(init?.body))).toMatchObject({
      access_key: "test-key",
      name: "Jane Doe",
      email: "jane@example.com",
      company: "Example company",
    });
    await waitFor(() => expect(screen.getByLabelText("Name")).toHaveValue(""));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Message sent. I will reply within two business days.",
    );
    fireEvent.click(screen.getByRole("link", { name: "Read the privacy policy" }));
    fireEvent.click(screen.getByRole("button", { name: "Return to your enquiry" }));
    expect(screen.getByLabelText("What would you like to discuss?")).toHaveValue("");
  });

  it("preserves the draft and provides an email recovery link after a rejected submission", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: false }), { status: 400 }),
    );
    renderHome();
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Your message was not sent.");
    expect(within(alert).getByRole("link")).toHaveAttribute("href", "mailto:hello@florianbeermann.com");
    expect(screen.getByLabelText("Name")).toHaveValue("Jane Doe");
    expect(screen.getByRole("button", { name: "Send message" })).toBeEnabled();
  });

  it("keeps an in-flight submission locked across legal-page navigation", async () => {
    let finish: ((response: Response) => void) | undefined;
    vi.spyOn(globalThis, "fetch").mockImplementation(() => new Promise<Response>((resolve) => {
      finish = resolve;
    }));
    renderHome();
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    fireEvent.click(screen.getByRole("link", { name: "Read the privacy policy" }));
    fireEvent.click(screen.getByRole("button", { name: "Return to your enquiry" }));
    expect(screen.getByLabelText("Name")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Sending..." })).toBeDisabled();
    await act(async () => {
      finish?.(new Response(JSON.stringify({ success: true }), { status: 200 }));
    });
    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Name")).toBeEnabled();
    expect(screen.getByRole("status")).toHaveTextContent("Message sent.");
  });

  it("links to both legal pages from the footer", () => {
    renderHome();
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByRole("link", { name: "Legal notice" })).toHaveAttribute("href", "/imprint");
    expect(within(footer).getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
  });
});
