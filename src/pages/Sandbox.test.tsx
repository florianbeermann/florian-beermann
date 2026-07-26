import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Sandbox from "@/pages/Sandbox";

describe("design sandbox", () => {
  it("presents the editorial alternative without replacing the original site", () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Sandbox />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Customer Success systems that protect revenue.",
    );
    expect(
      screen.queryByRole("link", { name: "Original site ↗" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "Customer Success consultancy · Hamburg and across Europe",
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByAltText(
        "Hamburg skyline with the Rathaus, St. Nikolai memorial and Elbphilharmonie in warm evening light",
      ),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(3);
    const portrait = screen.getByAltText(
      "Florian Beermann, Customer Success consultant",
    );
    expect(portrait).toHaveAttribute("src", "/florian-portrait-sharp.png");
    expect(
      portrait.closest("figure")?.querySelector("figcaption"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Customer Success strategist"),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("HubSpot")).toHaveLength(2);
    expect(screen.getAllByText("Capgemini")).toHaveLength(2);
    expect(screen.queryByText("Customer Success Manager")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Customer Success Account Manager"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Open in your email app" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send request" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Imprint" })).toHaveAttribute(
      "href",
      "/imprint",
    );
    expect(screen.getAllByRole("link", { name: "Privacy" }).at(-1)).toHaveAttribute(
      "href",
      "/privacy",
    );
    expect(
      screen.queryByRole("link", { name: "Return to original site" }),
    ).not.toBeInTheDocument();

    const experienceItems = screen
      .getByText("Supported enterprise customers across cloud adoption, AI and modern work.")
      .closest("ol")
      ?.querySelectorAll("li");
    expect(
      Array.from(experienceItems ?? []).map(
        (item) => item.querySelector("span")?.textContent,
      ),
    ).toEqual(["Microsoft", "Capgemini", "HubSpot", "Personio", "Spendesk"]);
  });
});
