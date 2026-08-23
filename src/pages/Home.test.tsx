import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import Home from "@/pages/Home";

const renderHome = () =>
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Home />
    </MemoryRouter>,
  );

const fillRequiredFields = () => {
  fireEvent.change(screen.getByLabelText("Full name"), {
    target: { value: "Jane Doe" },
  });
  fireEvent.change(screen.getByLabelText("Work email"), {
    target: { value: "jane@company.com" },
  });
  fireEvent.change(screen.getByLabelText("Company"), {
    target: { value: "Acme Inc." },
  });
  fireEvent.change(screen.getByLabelText("What would you like to discuss?"), {
    target: { value: "Renewal forecasting is guesswork." },
  });
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("homepage", () => {
  it("leads with the positioning headline and a contact call to action", () => {
    renderHome();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Your customers changed. Your Customer Success motion didn’t.",
    );
    // Both copies of the action are asserted, because both are real: the one
    // in the masthead row and the one at the foot of the mobile sheet. Only
    // ever one is exposed at a time — below the breakpoint the glass rail is
    // display:none, and above it the closed sheet is inert — but jsdom
    // implements neither, so the query matches both here.
    const actions = screen.getAllByRole("link", {
      name: "Start a conversation",
    });
    expect(actions).toHaveLength(2);
    for (const action of actions) {
      expect(action).toHaveAttribute("href", "#contact");
    }
  });

  it("names the portrait for assistive technology", () => {
    renderHome();

    const portrait = screen.getByRole("img", { name: "Florian Beermann" });

    expect(portrait.tagName).toBe("IMG");
    expect(portrait).toHaveAttribute("src", "/portrait.jpg");
    // Intrinsic dimensions are what stop the hero reflowing once the plate
    // decodes, which is the whole reason this is the site's LCP element.
    expect(portrait).toHaveAttribute("width");
    expect(portrait).toHaveAttribute("height");
  });

  it("lists the three engagements with their deliverables", () => {
    renderHome();

    const engagements = screen.getAllByRole("article");
    expect(engagements).toHaveLength(3);
    expect(
      engagements.map((article) => article.querySelector("h3")?.textContent),
    ).toEqual([
      "Customer Success strategy",
      "Lifecycle playbooks",
      "CSM enablement",
    ]);
    expect(
      screen.getByText("Segmentation and coverage model"),
    ).toBeInTheDocument();
  });

  it("shows the portrait beside the about copy", () => {
    renderHome();

    const portrait = screen.getByAltText("Florian Beermann");
    expect(portrait).toBeInTheDocument();
    // Scoped to the about section: the employer names also appear in the proof
    // section above, which this change does not touch. Asserting against the
    // whole document would pass or fail for the wrong reason.
    const about = document.querySelector("#about");
    expect(about).toContainElement(portrait);
    expect(within(about as HTMLElement).queryByText("Capgemini")).not.toBeInTheDocument();
  });

  it("reveals the optional qualification fields on request", () => {
    renderHome();

    expect(screen.queryByText("Company size")).not.toBeInTheDocument();

    const toggle = screen.getByRole("button", {
      name: "Add company size and tooling (optional)",
    });
    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Company size")).toBeInTheDocument();
    expect(screen.getByText("Current CS tooling")).toBeInTheDocument();
  });

  it("falls back to a pre-addressed email when no form key is configured", () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "");
    const assign = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, assign },
    });
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    renderHome();
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(assign).toHaveBeenCalledTimes(1);

    const mailto = assign.mock.calls[0][0] as string;
    expect(mailto.startsWith("mailto:hello@florianbeermann.com")).toBe(true);
    expect(decodeURIComponent(mailto)).toContain("Jane Doe");
    expect(decodeURIComponent(mailto)).toContain("jane@company.com");
    expect(decodeURIComponent(mailto)).toContain(
      "Renewal forecasting is guesswork.",
    );
  });

  it("posts to Web3Forms and resets the form when a key is configured", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );

    renderHome();
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));

    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("https://api.web3forms.com/submit");
    const payload = JSON.parse(String((init as RequestInit).body));
    expect(payload.access_key).toBe("test-key");
    expect(payload.name).toBe("Jane Doe");

    await waitFor(() =>
      expect(screen.getByLabelText("Full name")).toHaveValue(""),
    );
  });

  it("links to the legal pages from the footer", () => {
    renderHome();

    expect(screen.getByRole("link", { name: "Imprint" })).toHaveAttribute(
      "href",
      "/imprint",
    );
    expect(
      screen.getAllByRole("link", { name: "Privacy" }).at(-1),
    ).toHaveAttribute("href", "/privacy");
  });
});
