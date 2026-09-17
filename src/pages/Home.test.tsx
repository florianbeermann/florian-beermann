import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EnquiryProvider } from "@/components/EnquiryProvider";
import Home from "@/pages/Home";
import Privacy from "@/pages/Privacy";

vi.mock("@/lib/artwork-slideshow", () => ({
  initArtworkSlideshow: () => ({ destroy() {} }),
}));

function CurrentAddress() {
  const { pathname, search, hash } = useLocation();
  return <span data-testid="current-address" hidden>{pathname}{search}{hash}</span>;
}

const renderHome = (entry = "/") => render(
  <MemoryRouter initialEntries={[entry]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <CurrentAddress />
    <EnquiryProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </EnquiryProvider>
  </MemoryRouter>,
);

const navigate = (name: string) =>
  fireEvent.click(within(screen.getByRole("navigation", { name: "Primary navigation" })).getByRole("link", { name }));

const openEnquiry = () => {
  const enquiry = document.querySelector<HTMLDetailsElement>(".enquiry")!;
  fireEvent.click(enquiry.querySelector("summary")!);
  fireEvent(enquiry, new Event("toggle"));
};

const fillRequiredFields = () => {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Jane Doe" } });
  fireEvent.change(screen.getByLabelText("Work email"), { target: { value: "jane@example.com" } });
  fireEvent.change(screen.getByLabelText("Company"), { target: { value: "Example company" } });
  fireEvent.change(screen.getByLabelText("What would you like to discuss?"), {
    target: { value: "Our customers have different onboarding needs." },
  });
};

beforeEach(() => { vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key"); });
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("boutique homepage", () => {
  it("opens with only the stacked logo and the four approved images", () => {
    renderHome();
    expect(screen.getByRole("heading", { level: 1, name: "Beermann & Company" })).toHaveTextContent("BEERMANN");
    expect(document.querySelector(".opening-brand-mark")).toHaveAttribute("viewBox", "115.9 379 1021.1 524");
    expect(document.querySelector(".masthead .brand")).toHaveAttribute("aria-hidden", "true");
    expect(document.querySelector(".opening")).not.toHaveTextContent("Your customers have changed");
    const gallery = document.querySelector(".artwork-gallery")!;
    expect(gallery).toHaveAttribute("data-interval", "4000");
    expect(gallery).toHaveAttribute("data-fade-duration", "1200");
    expect([...gallery.querySelectorAll("img")].map(image => image.getAttribute("src"))).toEqual([
      "/boutique/artwork-marbling-02.png",
      "/boutique/artwork-study-03.jpg",
      "/boutique/artwork-gallery-04.png",
      "/boutique/artwork-hamburg-night-05.png",
    ]);
    expect([...gallery.querySelectorAll(".artwork-slide")].map(slide => slide.hasAttribute("data-shade")))
      .toEqual([true, false, true, false]);
    expect(within(gallery as HTMLElement).queryByRole("button")).not.toBeInTheDocument();
    expect(document.querySelector("video, gradient-background, .study")).not.toBeInTheDocument();
  });

  it("selects one accessible screen at a time through the approved navigation", () => {
    renderHome();
    expect(document.querySelectorAll(".section-screen")).toHaveLength(6);
    for (const [label, id] of [
      ["About", "about"], ["Services", "services"], ["Approach", "approach"],
      ["Expertise", "expertise"], ["Contact", "contact"],
    ]) {
      navigate(label);
      expect(document.documentElement).toHaveAttribute("data-active-screen", id);
      expect(screen.getByTestId("current-address")).toHaveTextContent(`/#${id}`);
      const links = document.querySelectorAll<HTMLAnchorElement>(`.masthead nav a[href="/#${id}"]`);
      expect(links).toHaveLength(2);
      links.forEach(link => expect(link).toHaveAttribute("aria-current", "location"));
      expect(document.querySelectorAll(".section-screen:not([hidden])")).toHaveLength(1);
      const heading = document.querySelector<HTMLElement>(`#${id} h2`)!;
      expect(heading).toHaveFocus();
      expect(heading).toHaveAttribute("tabindex", "-1");
      for (const element of document.querySelectorAll<HTMLElement>(".section-screen")) {
        expect(element.inert).toBe(element.dataset.screen !== id);
        expect(element).toHaveAttribute("aria-hidden", String(element.dataset.screen !== id));
      }
      expect(document.querySelector(".masthead .brand")).toHaveAttribute("aria-hidden", "false");
    }
    fireEvent.click(screen.getByRole("link", { name: "Beermann & Company, home" }));
    expect(document.documentElement).toHaveAttribute("data-active-screen", "top");
    expect(screen.getByTestId("current-address").textContent).toBe("/");
    expect(screen.getByRole("heading", { level: 1, name: "Beermann & Company" })).toHaveFocus();
  });

  it("integrates the employer evidence beneath the Expertise text in the same column", () => {
    renderHome("/#expertise");
    const portrait = screen.getByRole("img", { name: "Florian Beermann" });
    expect(portrait).toHaveAttribute("src", "/boutique/portrait-colour.png");
    expect(portrait).toHaveAttribute("width", "1023");
    expect(portrait).toHaveAttribute("height", "1537");
    const copy = document.querySelector(".person-copy")!;
    expect(copy.lastElementChild).toHaveClass("experience");
    expect(copy.lastElementChild).not.toHaveClass("page-width");
    expect(document.querySelector(".person")?.children).toHaveLength(2);
    expect(copy.querySelector(".experience h3")).not.toBeInTheDocument();
    expect(document.getElementById("experience-title")).not.toBeInTheDocument();
    expect(document.getElementById("experience-context")?.textContent).toBe("Previous employers");
    const employers = screen.getByRole("list", { name: "Previous employers" });
    expect(employers).toHaveAttribute("aria-labelledby", "experience-context");
    expect(within(employers).getAllByRole("listitem")).toHaveLength(5);
    expect(document.querySelectorAll(".employer-mark")[1]).toHaveAttribute(
      "style", "--employer-logo: url('/boutique/employers/capgemini.svg');",
    );
  });

  it("keeps three expandable services and four tangible deliverables in each", () => {
    renderHome("/#services");
    const engagements = [...document.querySelectorAll<HTMLDetailsElement>(".engagement")];
    expect(engagements.map(item => item.querySelector("h3")?.textContent)).toEqual([
      "Customer Success strategy", "Customer lifecycle processes", "Customer Success team training",
    ]);
    expect(engagements.map(item => item.open)).toEqual([true, false, false]);
    expect(engagements.every(item => item.querySelectorAll("li").length === 4)).toBe(true);
    fireEvent.click(engagements[1].querySelector("summary")!);
    navigate("About");
    navigate("Services");
    expect(engagements[1].open).toBe(true);
    expect(screen.queryByText("Discuss an engagement")).not.toBeInTheDocument();
  });

  it.each([
    ["practice", "about"],
    ["florian", "expertise"],
    ["engagements", "services"],
    ["transition", "approach"],
    ["intro", "top"],
    ["home", "top"],
    ["top", "top"],
  ])("normalises the old #%s bookmark to its current address", async (oldId, id) => {
    renderHome(`/?source=bookmark#${oldId}`);
    await waitFor(() => expect(screen.getByTestId("current-address").textContent).toBe(
      `/?source=bookmark${id === "top" ? "" : `#${id}`}`,
    ));
    expect(document.documentElement).toHaveAttribute("data-active-screen", id);
  });

  it.each(["about", "expertise"])("gives the current #%s name priority over its historical meaning", id => {
    renderHome(`/#${id}`);
    expect(document.documentElement).toHaveAttribute("data-active-screen", id);
    expect(screen.getByTestId("current-address").textContent).toBe(`/#${id}`);
  });

  it("reports invalid addresses and returns to the clean homepage URL", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderHome("/#missing-section");
    expect(document.documentElement).toHaveAttribute("data-active-screen", "top");
    await waitFor(() => expect(screen.getByTestId("current-address").textContent).toBe("/"));
    expect(warn).toHaveBeenCalledWith("The requested section does not exist. Showing Home instead.", "missing-section");
  });

  it("restores ordinary document scrolling when leaving the homepage", () => {
    renderHome("/#contact");
    expect(document.documentElement).toHaveClass("fixed-sections");
    fireEvent.click(screen.getByRole("link", { name: "Privacy" }));
    expect(document.documentElement).not.toHaveClass("fixed-sections");
    expect(document.documentElement).not.toHaveAttribute("data-active-screen");
    expect(document.documentElement.style.getPropertyValue("--mobile-menu-bottom")).toBe("");
  });

  it("keeps an enquiry when reading the privacy policy and returning", () => {
    renderHome("/#contact");
    openEnquiry();
    fillRequiredFields();
    fireEvent.click(screen.getByRole("link", { name: "Read the privacy policy" }));
    expect(screen.getByRole("heading", { level: 1, name: "Privacy policy" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Return to your enquiry" }));
    expect(screen.getByLabelText("Name")).toHaveValue("Jane Doe");
    expect(screen.getByLabelText("Work email")).toHaveValue("jane@example.com");
    expect(screen.getByLabelText("Company")).toHaveValue("Example company");
    expect(screen.getByLabelText("What would you like to discuss?")).toHaveValue(
      "Our customers have different onboarding needs.",
    );
    expect(document.querySelector(".enquiry")).toHaveAttribute("open");
  });

  it("prepares an explicitly unsent email draft when there is no form key", () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "");
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    renderHome("/#contact");
    openEnquiry();
    expect(screen.getByText(/Nothing is sent by this website/)).toBeInTheDocument();
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Prepare email draft" }));
    expect(fetchSpy).not.toHaveBeenCalled();
    const href = screen.getByRole("link", { name: "Open your email draft" }).getAttribute("href")!;
    expect(href.startsWith("mailto:hello@florianbeermann.com")).toBe(true);
    expect(decodeURIComponent(href)).toContain("Jane Doe");
    expect(decodeURIComponent(href)).toContain("Our customers have different onboarding needs.");
    expect(screen.getByRole("status")).toHaveTextContent("Nothing has been sent.");
    expect(screen.getByLabelText("Name")).toHaveValue("Jane Doe");
  });

  it("delivers real enquiries and keeps the successful confirmation visible", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    );
    renderHome("/#contact");
    openEnquiry();
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("https://api.web3forms.com/submit");
    expect(JSON.parse(String(init?.body))).toMatchObject({
      access_key: "test-key", from_name: "Beermann & Company website",
      name: "Jane Doe", email: "jane@example.com", company: "Example company",
    });
    await waitFor(() => expect(screen.getByLabelText("Name")).toHaveValue(""));
    expect(document.querySelector(".enquiry")).toHaveAttribute("open");
    expect(screen.getByRole("status")).toHaveTextContent("Message sent. I will reply within two business days.");
  });

  it("preserves the draft and offers email recovery after rejection", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: false }), { status: 400 }),
    );
    renderHome("/#contact");
    openEnquiry();
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Your message was not sent.");
    expect(within(alert).getByRole("link")).toHaveAttribute("href", "mailto:hello@florianbeermann.com");
    expect(screen.getByLabelText("Name")).toHaveValue("Jane Doe");
    expect(screen.getByRole("button", { name: "Send message" })).toBeEnabled();
  });

  it("keeps an in-flight submission locked across legal-page navigation", async () => {
    let finish: (response: Response) => void;
    vi.spyOn(globalThis, "fetch").mockImplementation(() => new Promise<Response>(resolve => { finish = resolve; }));
    renderHome("/#contact");
    openEnquiry();
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    fireEvent.click(screen.getByRole("link", { name: "Read the privacy policy" }));
    fireEvent.click(screen.getByRole("button", { name: "Return to your enquiry" }));
    expect(screen.getByLabelText("Name")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Sending..." })).toBeDisabled();
    await act(async () => { finish(new Response(JSON.stringify({ success: true }), { status: 200 })); });
    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Name")).toBeEnabled();
    expect(screen.getByRole("status")).toHaveTextContent("Message sent.");
  });

  it("keeps the text-only footer and working legal links inside Contact", () => {
    renderHome("/#contact");
    const footer = screen.getByRole("contentinfo");
    expect(footer.closest(".section-screen")).toHaveAttribute("data-screen", "contact");
    expect(footer.querySelector("svg")).not.toBeInTheDocument();
    expect(within(footer).getByRole("link", { name: "Legal notice" })).toHaveAttribute("href", "/imprint");
    expect(within(footer).getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(footer).toHaveTextContent(`${new Date().getFullYear()} Beermann & Company`);
  });
});
