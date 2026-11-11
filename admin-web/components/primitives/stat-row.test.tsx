import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { StatRow } from "./stat-row";
import { StatTile } from "./stat-tile";

describe("StatRow", () => {
  it("renders 2-4 tiles", () => {
    const { container } = render(
      <StatRow>
        <StatTile label="a" value={1} />
        <StatTile label="b" value={2} />
      </StatRow>,
    );
    expect(container.querySelectorAll("div.rounded-md").length).toBeGreaterThanOrEqual(2);
  });

  it("throws when given more than 4 tiles", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <StatRow>
          {Array.from({ length: 5 }, (_, i) => (
            <StatTile key={i} label={`x${i}`} value={i} />
          ))}
        </StatRow>,
      ),
    ).toThrow(/StatRow accepts at most 4/);
    spy.mockRestore();
  });
});
