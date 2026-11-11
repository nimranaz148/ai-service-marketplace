import { describe, it, expect, beforeAll, vi } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import HomePage from "@/app/page";

// jsdom lacks matchMedia; several sections call it behind a client guard.
beforeAll(() => {
  window.matchMedia ??= ((q: string) => ({
    matches: false,
    media: q,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});

// RequestBox reads next/navigation's useRouter; no App Router context in jsdom.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Keep gsap / Lenis / the scene hook out of jsdom — motion has its own suites.
// This mirrors every sibling marketing component test.
vi.mock("@/lib/motion/gsap", () => ({
  getGsap: () => ({
    from: vi.fn(() => ({ kill: vi.fn() })),
    to: vi.fn(() => ({ kill: vi.fn() })),
    timeline: vi.fn(() => ({ from: vi.fn().mockReturnThis(), to: vi.fn().mockReturnThis() })),
    context: (fn?: () => void) => {
      fn?.();
      return { revert: vi.fn() };
    },
    ticker: { lagSmoothing: vi.fn() },
  }),
  prefersReducedMotion: () => true,
}));

vi.mock("@/lib/motion/use-scroll-scene", () => ({ useScrollScene: () => {} }));
vi.mock("@/lib/motion/lenis", () => ({ startLenis: () => {}, stopLenis: () => {} }));

describe("marketing home", () => {
  it("renders every section landmark", () => {
    render(<HomePage />);
    for (const id of [
      "content",
      "agent-beat",
      "how-it-works",
      "trades",
      "proof",
      "pricing",
      "get-started",
    ]) {
      expect(document.getElementById(id), id).toBeTruthy();
    }
  });

  it("has exactly one h1", () => {
    const { container } = render(<HomePage />);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });

  it("renders no banned claim strings", () => {
    const { container } = render(<HomePage />);
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/\b(biometric|escrow|GPS|Raast|NADRA|guaranteed)\b/i);
    expect(text).not.toMatch(/\b\d{1,3}\s?%/);
  });

  it("has no serious/critical a11y violations", async () => {
    const { container } = render(<HomePage />);
    const results = await axe(container);
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious).toEqual([]);
  });
});
