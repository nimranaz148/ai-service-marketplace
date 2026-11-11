import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

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

import { PricingExplainer } from "./pricing-explainer";
import { copy } from "@/lib/marketing/copy";
import { providers } from "@/lib/fixtures";
import { PROVIDER_CATEGORY_LABEL } from "@/lib/contracts";

describe("PricingExplainer", () => {
  it("renders the title and all three pricing points", () => {
    render(<PricingExplainer />);
    expect(
      screen.getByRole("heading", { name: copy.pricing.title }),
    ).toBeInTheDocument();
    for (const point of copy.pricing.points) {
      expect(screen.getByText(point)).toBeInTheDocument();
    }
  });

  it("renders a 'from PKR' rate line for at least four trades", () => {
    render(<PricingExplainer />);
    expect(screen.getAllByText(/from PKR/).length).toBeGreaterThanOrEqual(4);
  });

  it("keeps monthly-package rates out of the per-job rate list", () => {
    render(<PricingExplainer />);

    // The tutor fixtures are priced "from PKR N / mo" — a subscription-shaped
    // rate, which would contradict this section's "No subscription." headline.
    const monthly = providers.filter((p) => /\/\s*mo\b/i.test(p.priceLabel));
    expect(monthly.length).toBeGreaterThan(0);
    expect(monthly.every((p) => p.category === "tutor")).toBe(true);

    expect(screen.queryAllByText(/\/ mo/)).toHaveLength(0);
    expect(
      screen.queryByText(new RegExp(`^${PROVIDER_CATEGORY_LABEL.tutor} — `)),
    ).toBeNull();

    // ...and the note explaining where tutoring pricing lives is shown instead.
    expect(screen.getByText(copy.pricing.monthlyNote)).toBeInTheDocument();
  });

  it("still shows a per-job rate for every non-monthly trade", () => {
    render(<PricingExplainer />);
    const perJob = screen.getAllByText(/ — from PKR/);
    expect(perJob).toHaveLength(4);
    for (const line of perJob) {
      expect(line.textContent).not.toMatch(/\/ mo/);
    }
  });

  it("every rate line names a real PROVIDER_CATEGORY_LABEL value", () => {
    render(<PricingExplainer />);
    const known = Object.values(PROVIDER_CATEGORY_LABEL);
    const lines = screen.getAllByText(/ — from PKR/);
    expect(lines.length).toBeGreaterThanOrEqual(4);
    for (const line of lines) {
      const label = line.textContent!.split(" — ")[0].trim();
      expect(known).toContain(label);
    }
  });

  it("derives the cheapest rate per trade from the providers fixture", () => {
    render(<PricingExplainer />);

    // Recompute the expected cheapest AC rate straight from the fixture.
    const acPrices = providers.filter((p) => p.category === "ac");
    expect(acPrices.length).toBeGreaterThan(0);
    const cheapest = acPrices
      .slice()
      .sort(
        (a, b) =>
          parseInt(a.priceLabel.replace(/[^\d]/g, "").slice(0, 6) || "0", 10) -
          parseInt(b.priceLabel.replace(/[^\d]/g, "").slice(0, 6) || "0", 10),
      )[0].priceLabel;

    expect(cheapest).toBe("from PKR 2,500");
    expect(
      screen.getByText(`${PROVIDER_CATEGORY_LABEL.ac} — ${cheapest}`),
    ).toBeInTheDocument();
  });
});
