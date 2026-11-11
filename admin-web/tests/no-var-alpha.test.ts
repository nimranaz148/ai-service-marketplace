import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const root = resolve(__dirname, "..");

function tsxFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...tsxFiles(full));
    else if (entry.endsWith(".tsx")) out.push(full);
  }
  return out;
}

const files = [...tsxFiles(resolve(root, "components")), ...tsxFiles(resolve(root, "app"))];

/**
 * Tailwind 3.4 cannot apply a `/NN` alpha modifier to an arbitrary `var()` colour —
 * `bg-[var(--status-go)]/10` emits NO CSS at all (there is no color-mix fallback for
 * this form). Such a class is silently dead. Use an explicit rgba token role instead
 * (e.g. `--status-go-tint`).
 */
describe("no alpha modifiers on var() colours", () => {
  it("finds at least one component to scan", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files.map((f) => [f.slice(root.length + 1).replace(/\\/g, "/"), f] as const))(
    "%s has no `-[var(--x)]/NN` dead class",
    (_name, full) => {
      const src = readFileSync(full, "utf8");
      const hits = src.match(/-\[var\(--[\w-]+\)\]\/\d/g) ?? [];
      expect(hits, `alpha modifier on a var() colour emits no CSS: ${hits.join(", ")}`).toEqual([]);
    },
  );
});
