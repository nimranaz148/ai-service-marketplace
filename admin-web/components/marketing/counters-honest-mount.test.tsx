import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

/**
 * Regression guard for the SSR / hydration bug found in the Phase 0.5 review.
 *
 * Proof and HowItWorks used to seed their displayed-number state from
 * prefersReducedMotion(), which is always `false` on the server (no `window`).
 * The prerendered HTML therefore shipped zeros — dishonest on first paint, and a
 * React hydration text mismatch for anyone who really does prefer reduced
 * motion. Both components now seed state with the true final value on server
 * and client alike, so the MOUNT-TIME value must be honest whatever the motion
 * preference says. The sibling suites cover the reduced-motion (`true`) side;
 * this file pins the motion-ALLOWED (`false`) side.
 *
 * The dip-to-zero-then-count-up flourish itself is deliberately NOT asserted
 * here — it needs real ScrollTrigger timing in a real viewport.
 */
vi.mock("@/lib/motion/gsap", () => ({
  getGsap: () => ({
    from: vi.fn(() => ({ kill: vi.fn() })),
    to: vi.fn(() => ({ kill: vi.fn() })),
    context: (fn?: () => void) => {
      fn?.();
      return { revert: vi.fn() };
    },
  }),
  prefersReducedMotion: () => false,
}));

// No scroll scene runs, so nothing has entered the viewport yet: what we read is
// purely the mount-time state.
vi.mock("@/lib/motion/use-scroll-scene", () => ({
  useScrollScene: () => {},
}));

import { Proof } from "./proof";
import { HowItWorks } from "./how-it-works";
import { copy } from "@/lib/marketing/copy";
import { providers, cities } from "@/lib/fixtures";
import { TRADES } from "@/lib/marketing/trades";

const AVG = (
  providers.reduce((a, p) => a + p.rating, 0) / providers.length
).toFixed(1);

describe("counters are honest at mount even when motion is allowed", () => {
  it("Proof shows the real fixture-derived figures, not zeros", () => {
    render(<Proof />);

    const cell = (label: string) => screen.getByText(label).closest("div")!;

    expect(
      within(cell("verified providers")).getByText(String(providers.length)),
    ).toBeInTheDocument();
    expect(
      within(cell("cities")).getByText(String(cities.length)),
    ).toBeInTheDocument();
    expect(
      within(cell("trades")).getByText(String(TRADES.length)),
    ).toBeInTheDocument();
    expect(within(cell("avg rating")).getByText(AVG)).toBeInTheDocument();
  });

  it("Proof renders no placeholder zero in any stat tile", () => {
    const { container } = render(<Proof />);
    const values = Array.from(
      container.querySelectorAll("div.grid > div > p:first-child"),
    ).map((el) => el.textContent);
    expect(values).toHaveLength(4);
    expect(values).not.toContain("0");
    expect(values).not.toContain("0.0");
  });

  it("HowItWorks shows the real step numbers, not zeros", () => {
    const { container } = render(<HowItWorks />);
    const numbers = Array.from(
      container.querySelectorAll("ol > li > span"),
    ).map((el) => el.textContent);
    expect(numbers).toEqual(copy.howItWorks.steps.map((s) => String(s.n)));
    expect(numbers).not.toContain("0");
  });
});
