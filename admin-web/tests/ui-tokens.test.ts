import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const dir = resolve(__dirname, "../components/ui");
const files = readdirSync(dir).filter((f) => f.endsWith(".tsx"));

describe("ui primitives use tokens only", () => {
  it("has generated the expected component set", () => {
    // The full spec §9.1 primitive set (23).
    const SPEC_PRIMITIVES = [
      "button", "input", "textarea", "label", "select", "checkbox", "switch", "radio-group",
      "dialog", "sheet", "dropdown-menu", "popover", "tooltip", "tabs", "table", "badge",
      "card", "skeleton", "scroll-area", "avatar", "separator", "command", "sonner",
    ];
    expect(SPEC_PRIMITIVES).toHaveLength(23);
    for (const name of SPEC_PRIMITIVES) {
      expect(files, `missing ${name}.tsx`).toContain(`${name}.tsx`);
    }
  });

  it.each(files)("%s contains no colour literals or non-token palette classes", (file) => {
    const src = readFileSync(resolve(dir, file), "utf8");
    expect(src, "hex colour literal").not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(src, "tailwind default palette class").not.toMatch(/\b(slate|zinc|neutral|gray|stone)-\d{2,3}\b/);
    expect(src, "glow shadow").not.toMatch(/shadow-\[0_0_\d+px/);
  });

  it.each(files)("%s does not repaint shadcn's neutral 'accent' hover with the brand token", (file) => {
    const src = readFileSync(resolve(dir, file), "utf8");
    // bare `bg-accent` (not `bg-accent-tint`) as a hover/focus/state fill is the brand token leaking into neutral hovers
    expect(src, "bare bg-accent used as a fill").not.toMatch(/(?<![\w-])(?:hover:|focus:|focus-visible:|aria-selected:|data-\[[^\]]*\]:)?bg-accent(?![-\w])/);
    expect(src, "text-accent-foreground").not.toContain("text-accent-foreground");
  });
});
