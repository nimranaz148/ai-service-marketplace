import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

vi.mock("@/lib/motion/gsap", () => ({
  getGsap: () => ({
    from: vi.fn(() => ({ kill: vi.fn() })),
    to: vi.fn(() => ({ kill: vi.fn() })),
    context: (fn?: () => void) => {
      fn?.();
      return { revert: vi.fn() };
    },
  }),
  prefersReducedMotion: () => true,
}));

vi.mock("@/lib/motion/use-scroll-scene", () => ({
  useScrollScene: () => {},
}));

import { Proof } from "./proof";
import { copy } from "@/lib/marketing/copy";
import { providers, cities } from "@/lib/fixtures";
import { TRADES } from "@/lib/marketing/trades";

describe("Proof", () => {
  it("renders the section title", () => {
    render(<Proof />);
    expect(
      screen.getByRole("heading", { name: copy.proof.title }),
    ).toBeInTheDocument();
  });

  it("renders all four stat labels", () => {
    render(<Proof />);
    expect(screen.getByText("verified providers")).toBeInTheDocument();
    expect(screen.getByText("cities")).toBeInTheDocument();
    expect(screen.getByText("trades")).toBeInTheDocument();
    expect(screen.getByText("avg rating")).toBeInTheDocument();
  });

  it("shows the fixture-derived counts (reduced-motion -> final values)", () => {
    render(<Proof />);

    const providerCell = screen.getByText("verified providers").closest("div")!;
    expect(within(providerCell).getByText(String(providers.length))).toBeInTheDocument();

    const cityCell = screen.getByText("cities").closest("div")!;
    expect(within(cityCell).getByText(String(cities.length))).toBeInTheDocument();

    const tradeCell = screen.getByText("trades").closest("div")!;
    expect(within(tradeCell).getByText(String(TRADES.length))).toBeInTheDocument();
  });

  it("renders the quotes footnote", () => {
    render(<Proof />);
    expect(screen.getByText(copy.proof.quotesNote)).toBeInTheDocument();
  });

  it("renders exactly two blockquotes, each with its text and attribution", () => {
    const { container } = render(<Proof />);
    const quotes = container.querySelectorAll("blockquote");
    expect(quotes.length).toBe(2);

    copy.proof.quotes.forEach((q, i) => {
      const el = quotes[i];
      expect(el.textContent).toContain(q.text);
      expect(el.textContent).toContain(q.who);
    });
  });
});
