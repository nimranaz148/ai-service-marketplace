import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const startLenis = vi.fn();
const stopLenis = vi.fn();
vi.mock("@/lib/motion/lenis", () => ({
  startLenis: () => startLenis(),
  stopLenis: () => stopLenis(),
}));

const revert = vi.fn();
vi.mock("@/lib/motion/gsap", () => ({
  getGsap: () => ({ context: () => ({ revert }) }),
  prefersReducedMotion: () => false,
}));

import { MarketingRoot } from "./marketing-root";
import { RequestBox } from "./request-box";
import { DispatchMotif } from "./dispatch-motif";

describe("MarketingRoot", () => {
  it("renders its children", () => {
    render(
      <MarketingRoot>
        <p>child content</p>
      </MarketingRoot>,
    );
    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("wraps children in a node carrying data-theme=\"marketing\"", () => {
    const { container } = render(
      <MarketingRoot>
        <span>x</span>
      </MarketingRoot>,
    );
    const root = container.querySelector('[data-theme="marketing"]');
    expect(root).not.toBeNull();
    expect(root).toHaveTextContent("x");
  });

  it("starts Lenis on mount", () => {
    startLenis.mockClear();
    render(
      <MarketingRoot>
        <span>x</span>
      </MarketingRoot>,
    );
    expect(startLenis).toHaveBeenCalled();
  });
});

describe("RequestBox", () => {
  it("renders a labelled textbox and a submit button", () => {
    render(<RequestBox variant="hero" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /get help now|submit|send/i })).toBeInTheDocument();
  });

  it("submitting the form routes to /signup", () => {
    push.mockClear();
    render(<RequestBox variant="hero" />);
    const input = screen.getByRole("textbox");
    fireEvent.submit(input.closest("form")!);
    expect(push).toHaveBeenCalledWith("/signup");
  });

  it("exposes a non-functional voice affordance", () => {
    render(<RequestBox variant="cta" />);
    expect(screen.getByRole("button", { name: /use voice/i })).toBeInTheDocument();
  });
});

describe("DispatchMotif", () => {
  it("renders an aria-hidden inline svg inside a card that merges className", () => {
    const { container } = render(<DispatchMotif className="test-motif" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(container.firstElementChild).toHaveClass("test-motif");
    expect(container.querySelector("image")).toBeNull();
  });

  it("renders an optional caption as plain static text", () => {
    render(<DispatchMotif caption="AC repair — G-13, Islamabad" />);
    expect(screen.getByText("AC repair — G-13, Islamabad")).toBeInTheDocument();
  });
});
