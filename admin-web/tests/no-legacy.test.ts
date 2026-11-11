import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(__dirname, "..");

// The legacy `juniper` / `gold-*` tokens lived in tailwind.config.ts, so the root
// config files must be in scope too — not just the source trees.
const ROOT_CONFIGS = ["tailwind.config.ts", "tsconfig.json", "postcss.config.js"];

function grep(pattern: string): string {
  const targets = ["app", "components", "lib", ...ROOT_CONFIGS.filter((f) => existsSync(resolve(root, f)))];
  try {
    return execSync(
      `grep -rn --include=*.tsx --include=*.ts --include=*.css --include=*.json --include=*.js "${pattern}" ${targets.join(" ")}`,
      { cwd: root, encoding: "utf8" },
    );
  } catch {
    return ""; // grep exits 1 on no match
  }
}

describe("legacy surface removed", () => {
  it("dead landing components are gone", () => {
    for (const f of ["AgentSymphony", "AuditObservability", "ProofStrip", "ServiceBentoGrid", "VoiceShowcase"]) {
      expect(existsSync(resolve(root, `components/landing/${f}.tsx`))).toBe(false);
    }
  });

  it("hand-rolled ui primitives and old shell are gone", () => {
    // NOTE: badge/button/card/table.tsx are the shadcn/ui primitives adopted in Task 7
    // (they legitimately re-use those filenames and are consumed across the app), so only
    // the genuinely hand-rolled components + the old shell path are asserted gone here.
    for (const f of ["ui/MagneticButton.tsx", "ui/SpotlightCard.tsx", "ui/Toaster.tsx", "layout/AppShell.tsx"]) {
      expect(existsSync(resolve(root, `components/${f}`))).toBe(false);
    }
  });

  it("no legacy token names, catalis utilities, or google-fonts import remain", () => {
    expect(grep("juniper")).toBe("");
    expect(grep("champagne")).toBe("");
    expect(grep("catalis-")).toBe("");
    expect(grep("fonts.googleapis.com")).toBe("");
    expect(grep("Instrument Serif")).toBe("");
  });
});
