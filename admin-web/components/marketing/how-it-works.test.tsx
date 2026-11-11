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

import { HowItWorks } from "./how-it-works";
import { copy } from "@/lib/marketing/copy";

/** The rendered step-number spans, in document order. */
function stepNumbers(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("ol > li > span")).map(
    (el) => el.textContent ?? "",
  );
}

describe("HowItWorks", () => {
  it("renders the section title and every step heading + body", () => {
    render(<HowItWorks />);
    expect(
      screen.getByRole("heading", { name: copy.howItWorks.title }),
    ).toBeInTheDocument();
    for (const step of copy.howItWorks.steps) {
      expect(screen.getByRole("heading", { name: step.h })).toBeInTheDocument();
      expect(screen.getByText(step.p)).toBeInTheDocument();
    }
  });

  it("shows the real step numbers on the initial render", () => {
    const { container } = render(<HowItWorks />);
    expect(stepNumbers(container)).toEqual(
      copy.howItWorks.steps.map((s) => String(s.n)),
    );
  });

  it("marks the decorative step number aria-hidden", () => {
    const { container } = render(<HowItWorks />);
    for (const span of Array.from(
      container.querySelectorAll("ol > li > span"),
    )) {
      expect(span).toHaveAttribute("aria-hidden", "true");
    }
  });
});
