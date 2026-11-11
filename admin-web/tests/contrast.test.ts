import { describe, it, expect } from "vitest";
import { tokens } from "@/lib/design/tokens";
import { ratio, blend, relLuminance } from "@/lib/design/contrast";

/**
 * Node-side WCAG contrast guard. jsdom + axe cannot evaluate colour contrast, so
 * these assertions are the compensating control for spec §12.1 criterion #11.
 *
 * Role -> primitive mapping (globals.css :root):
 *   --surface        = --paper-0
 *   --surface-sunken = --paper-50
 *   --ink            = --ink-900
 *   --ink-muted      = --ink-500
 */
const surface = tokens.color["paper-0"];
const sunken = tokens.color["paper-50"];
const ink = tokens.color["ink-900"];
const inkMuted = tokens.color["ink-500"];

describe("relLuminance / ratio sanity", () => {
  it("brackets black and white", () => {
    expect(relLuminance("#000000")).toBeCloseTo(0, 5);
    expect(relLuminance("#FFFFFF")).toBeCloseTo(1, 5);
    expect(ratio("#000000", "#FFFFFF")).toBeCloseTo(21, 2);
  });

  it("blend composites a translucent tint over an opaque ground", () => {
    expect(blend("rgba(0, 0, 0, 1)", "#FFFFFF")).toBe("#000000");
    expect(blend("rgba(0, 0, 0, 0)", "#FFFFFF")).toBe("#ffffff");
  });
});

describe("body text meets WCAG AA/AAA on application surfaces", () => {
  it("--ink-muted on --surface is at least AA (4.5:1)", () => {
    expect(ratio(inkMuted, surface)).toBeGreaterThanOrEqual(4.5);
  });

  it("--ink-muted on --surface-sunken is at least AA (4.5:1)", () => {
    expect(ratio(inkMuted, sunken)).toBeGreaterThanOrEqual(4.5);
  });

  it("--ink on --surface is AAA (7:1)", () => {
    expect(ratio(ink, surface)).toBeGreaterThanOrEqual(7);
  });

  it("--accent-ink on --accent-strong (primary button) clears AA", () => {
    expect(ratio("#FFFFFF", tokens.color["accent-strong"])).toBeGreaterThanOrEqual(4.5);
  });
});

describe("StatusBadge label (--ink on each status tint) meets AA", () => {
  const tints: Array<[string, string]> = [
    ["go", tokens.color["status-go-tint"]],
    ["warn", tokens.color["status-warn-tint"]],
    ["stop", tokens.color["status-stop-tint"]],
    ["info", tokens.color["status-info-tint"]],
    ["live", tokens.color["status-live-tint"]],
  ];

  it.each(tints)("--ink on the %s tint is at least AA (4.5:1)", (_name, tint) => {
    const composite = blend(tint, surface);
    expect(ratio(ink, composite)).toBeGreaterThanOrEqual(4.5);
  });
});
