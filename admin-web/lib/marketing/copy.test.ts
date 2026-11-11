import { describe, it, expect } from "vitest";
import { copy } from "./copy";
import { TRADES } from "./trades";
import { PROVIDER_CATEGORY_LABEL } from "@/lib/contracts";

const BANNED = /\b(biometric|escrow|GPS|Raast|NADRA|guaranteed)\b/i;

function flat(o: unknown): string[] {
  if (typeof o === "string") return [o];
  if (Array.isArray(o)) return o.flatMap(flat);
  if (o && typeof o === "object") return Object.values(o).flatMap(flat);
  return [];
}

describe("marketing copy", () => {
  it("contains no banned claim strings", () => {
    for (const s of flat(copy)) expect(s, s).not.toMatch(BANNED);
  });
  it("uses no percentage-as-stat", () => {
    for (const s of flat(copy)) expect(s).not.toMatch(/\b\d{1,3}\s?%/);
  });
  it("trades cover every provider category exactly once", () => {
    expect(TRADES.map((t) => t.id).sort()).toEqual(
      (Object.keys(PROVIDER_CATEGORY_LABEL) as string[]).sort(),
    );
  });
});
