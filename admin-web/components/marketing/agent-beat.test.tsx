import { describe, it, expect, vi, beforeAll } from "vitest";
import { render } from "@testing-library/react";

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

// Keep gsap out of jsdom; reduced-motion => static end-state render.
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

import { AgentBeat } from "./agent-beat";
import { copy } from "@/lib/marketing/copy";
import { sessions } from "@/lib/fixtures";
import { providers } from "@/lib/fixtures";

const acProviders = providers.filter((p) => p.category === "ac");
const fillers = providers.filter((p) => p.city === "khi" && p.category !== "ac");
const providerRows = [...acProviders, ...fillers].slice(0, 3);

describe("AgentBeat", () => {
  it("renders the section title", () => {
    const { getByText } = render(<AgentBeat />);
    expect(getByText(copy.agentBeat.title)).toBeInTheDocument();
  });

  it("shows the raw request from sessions[0]", () => {
    const { container } = render(<AgentBeat />);
    expect(container.textContent).toContain("AC technician chahiye");
    expect(container.textContent).toContain(sessions[0].rawInput);
  });

  it("shows all four intent facets", () => {
    const { container } = render(<AgentBeat />);
    const text = container.textContent ?? "";
    expect(text).toContain("Gulshan-e-Iqbal");
    expect(text.toLowerCase()).toContain("tomorrow morning");
    expect(text).toContain("high");
    expect(text).toContain("AC Technician");
  });

  it("renders at least three provider rows including the AC technicians", () => {
    const { container } = render(<AgentBeat />);
    expect(providerRows.length).toBeGreaterThanOrEqual(3);
    for (const p of providerRows) {
      expect(container.textContent).toContain(p.name);
    }
    expect(container.querySelectorAll("[data-provider-row]").length).toBeGreaterThanOrEqual(3);
  });

  it("shows the confirmed booking end state with the token", () => {
    const { container } = render(<AgentBeat />);
    expect(container.textContent).toContain("Confirmed");
    expect(container.textContent).toContain("BK-4821");
  });

  it("marks every AgentEventItem as not live", () => {
    const { container } = render(<AgentBeat />);
    expect(container.querySelectorAll('[data-live="true"]').length).toBe(0);
  });
});
