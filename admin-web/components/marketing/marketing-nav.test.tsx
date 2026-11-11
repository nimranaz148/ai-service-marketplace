import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Keep gsap out of jsdom entirely.
vi.mock("@/lib/motion/gsap", () => ({
  getGsap: () => ({ context: () => ({ revert: vi.fn() }) }),
  prefersReducedMotion: () => false,
}));

// The scene hook is exercised in its own suite; here it must not touch gsap.
vi.mock("@/lib/motion/use-scroll-scene", () => ({
  useScrollScene: () => {},
}));

import { MarketingNav } from "./marketing-nav";
import { MarketingFooter } from "./marketing-footer";
import { copy } from "@/lib/marketing/copy";

function href(name: RegExp | string) {
  return (screen.getByRole("link", { name }) as HTMLAnchorElement).getAttribute("href");
}

describe("MarketingNav", () => {
  it("renders the three nav links pointing at the section anchors", () => {
    render(<MarketingNav />);
    expect(href(copy.nav.links[0])).toBe("#how-it-works");
    expect(href(copy.nav.links[1])).toBe("#trades");
    expect(href(copy.nav.links[2])).toBe("#pricing");
  });

  it("links 'Sign in' to /login and the CTA to /signup", () => {
    render(<MarketingNav />);
    expect(href(copy.nav.signIn)).toBe("/login");
    expect(href(copy.nav.cta)).toBe("/signup");
  });

  it("renders the wordmark linking home", () => {
    render(<MarketingNav />);
    expect(href(/atelier/i)).toBe("/");
  });

  it("puts a skip-to-content link to #content first among links", () => {
    render(<MarketingNav />);
    const skip = screen.getByRole("link", { name: /skip to content/i });
    expect(skip).toHaveAttribute("href", "#content");
    expect(screen.getAllByRole("link")[0]).toBe(skip);
  });
});

describe("MarketingFooter", () => {
  it("is a contentinfo landmark", () => {
    render(<MarketingFooter />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the three column headings", () => {
    render(<MarketingFooter />);
    for (const col of copy.footer.cols) {
      expect(screen.getByRole("heading", { name: col.h })).toBeInTheDocument();
    }
  });

  it("has a labelled newsletter textbox", () => {
    render(<MarketingFooter />);
    const input = screen.getByLabelText(copy.footer.newsletterLabel);
    expect(input).toHaveAttribute("type", "email");
  });

  it("lists the coverage cities and the tagline", () => {
    render(<MarketingFooter />);
    for (const city of copy.trades.cities) {
      expect(screen.getByText(city)).toBeInTheDocument();
    }
    expect(screen.getByText(copy.footer.tagline)).toBeInTheDocument();
  });
});
