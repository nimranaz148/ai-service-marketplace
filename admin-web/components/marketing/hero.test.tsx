import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// RequestBox pulls in next/navigation's useRouter.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Keep gsap out of jsdom entirely; reduced-motion => no SplitText, all content visible.
vi.mock("@/lib/motion/gsap", () => ({
  getGsap: () => ({
    from: vi.fn(() => ({ kill: vi.fn(), scrollTrigger: { kill: vi.fn() } })),
    to: vi.fn(() => ({ kill: vi.fn() })),
    context: (fn?: () => void) => {
      fn?.();
      return { revert: vi.fn() };
    },
  }),
  prefersReducedMotion: () => true,
}));

// The scene hook has its own suite; here it must not touch gsap.
vi.mock("@/lib/motion/use-scroll-scene", () => ({
  useScrollScene: () => {},
}));

import { Hero } from "./hero";
import { copy } from "@/lib/marketing/copy";

describe("Hero", () => {
  it("renders exactly one h1 and it carries the headline", () => {
    render(<Hero />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(copy.hero.headline);
  });

  it("renders a labelled request textbox", () => {
    render(<Hero />);
    expect(screen.getByLabelText(copy.hero.boxPlaceholder)).toBeInTheDocument();
  });

  it("wires the primary CTA to /signup and the secondary CTA to #how-it-works", () => {
    render(<Hero />);
    expect(
      screen.getByRole("link", { name: copy.hero.ctaPrimary }),
    ).toHaveAttribute("href", "/signup");
    expect(
      screen.getByRole("link", { name: copy.hero.ctaSecondary }),
    ).toHaveAttribute("href", "#how-it-works");
  });

  it("shows all hero content on the reduced-motion path", () => {
    render(<Hero />);
    expect(screen.getByText(copy.hero.sub)).toBeInTheDocument();
  });
});
