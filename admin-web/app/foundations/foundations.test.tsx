import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import FoundationsPage from "./page";

// jsdom does not implement matchMedia; MotionDemo's reduced-motion guard needs it.
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

describe("/foundations", () => {
  it("renders every section heading", () => {
    render(<FoundationsPage />);
    for (const h of ["Colour", "Typography", "Space & radius", "Elevation", "Motion", "Primitives", "Agent activity", "Shell"]) {
      expect(screen.getByRole("heading", { name: h })).toBeInTheDocument();
    }
  });

  it("renders the honest StatTile no-data state, not a fake number", () => {
    render(<FoundationsPage />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("has no serious/critical a11y violations", async () => {
    const { container } = render(<FoundationsPage />);
    const results = await axe(container);
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious).toEqual([]);
  });
});
