import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";

// jsdom lacks matchMedia; the component's <768px guard calls it.
beforeAll(() => {
  if (typeof window.matchMedia !== "function") {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
  }
});

// Keep gsap out of jsdom; reduced-motion => static grid render, no pin.
vi.mock("@/lib/motion/gsap", () => ({
  getGsap: () => ({
    from: vi.fn(() => ({ kill: vi.fn() })),
    to: vi.fn(() => ({ kill: vi.fn() })),
    timeline: vi.fn(() => ({ from: vi.fn().mockReturnThis(), to: vi.fn().mockReturnThis() })),
    context: (fn?: () => void) => {
      fn?.();
      return { revert: vi.fn() };
    },
  }),
  prefersReducedMotion: () => true,
}));

// The scene hook has its own suite; here it must be a no-op.
vi.mock("@/lib/motion/use-scroll-scene", () => ({
  useScrollScene: () => {},
}));

import { TradesCoverage } from "./trades-coverage";
import { TRADES } from "@/lib/marketing/trades";
import { copy } from "@/lib/marketing/copy";

describe("TradesCoverage", () => {
  it("renders the section title", () => {
    render(<TradesCoverage />);
    expect(screen.getByText(copy.trades.title)).toBeInTheDocument();
  });

  it("renders every trade label (reduced-motion grid, all visible)", () => {
    render(<TradesCoverage />);
    for (const t of TRADES) {
      expect(screen.getByText(t.label)).toBeInTheDocument();
    }
  });

  it("renders every city", () => {
    render(<TradesCoverage />);
    for (const city of copy.trades.cities) {
      expect(screen.getByText(city)).toBeInTheDocument();
    }
  });

  it("renders the cities label and the 'more areas' line", () => {
    render(<TradesCoverage />);
    expect(screen.getByText(copy.trades.citiesLabel)).toBeInTheDocument();
    expect(screen.getByText(copy.trades.more)).toBeInTheDocument();
  });
});
