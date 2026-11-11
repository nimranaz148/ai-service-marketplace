import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { tokens } from "@/lib/design/tokens";

const css = readFileSync(resolve(__dirname, "../app/globals.css"), "utf8");

/** Extract `--name: value;` pairs from the first :root { ... } block. */
function rootVars(source: string): Record<string, string> {
  const block = source.slice(source.indexOf(":root"));
  const body = block.slice(block.indexOf("{") + 1, block.indexOf("}")).replace(/\/\*[\s\S]*?\*\//g, "");
  const out: Record<string, string> = {};
  for (const line of body.split(";")) {
    const m = line.match(/^\s*(--[\w-]+)\s*:\s*(.+?)\s*$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

describe("token parity", () => {
  const vars = rootVars(css);

  it("every tokens.ts colour value exists verbatim in globals.css :root", () => {
    for (const [k, v] of Object.entries(tokens.color)) {
      const cssVar = `--${k}`;
      expect(vars, `missing ${cssVar}`).toHaveProperty(cssVar);
      expect(vars[cssVar], `value drift for ${cssVar}`).toBe(v);
    }
  });

  it("every tokens.ts scale value exists verbatim in globals.css :root", () => {
    const groups = { ...tokens.space, ...tokens.radius, ...tokens.duration, ...tokens.easing };
    for (const [k, v] of Object.entries(groups)) {
      expect(vars, `missing --${k}`).toHaveProperty(`--${k}`);
      expect(vars[`--${k}`]).toBe(v);
    }
  });

  it("viz ramp has 6 stops present in :root", () => {
    tokens.viz.forEach((v, i) => {
      expect(vars[`--viz-${i + 1}`]).toBe(v);
    });
  });
});
