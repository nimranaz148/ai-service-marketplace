import { describe, it, expect } from "vitest";
import { variants } from "./variants";

describe("motion variants", () => {
  it("exposes the approved set and nothing implying looping activity", () => {
    expect(Object.keys(variants).sort()).toEqual(["fade", "listItem", "routeTransition", "staggerList"]);
  });

  it("no variant uses infinite repeat", () => {
    const json = JSON.stringify(variants);
    expect(json).not.toMatch(/"repeat"\s*:\s*(-1|Infinity)/);
    expect(json).not.toContain("repeatType");
  });

  it("durations are within the token envelope (<= 0.26s)", () => {
    const nums = Array.from(JSON.stringify(variants).matchAll(/"duration"\s*:\s*([\d.]+)/g)).map((m) => Number(m[1]));
    expect(nums.length).toBeGreaterThan(0);
    for (const n of nums) expect(n).toBeLessThanOrEqual(0.26);
  });
});
