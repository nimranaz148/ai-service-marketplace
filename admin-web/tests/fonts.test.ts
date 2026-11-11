import { describe, it, expect } from "vitest";
import { statSync } from "node:fs";
import { resolve } from "node:path";

const dir = resolve(__dirname, "../public/fonts");
const required = [
  "ClashDisplay-Medium.woff2", "ClashDisplay-Semibold.woff2",
  "Zodiak-Regular.woff2", "Zodiak-Italic.woff2",
  "Switzer-Regular.woff2", "Switzer-Medium.woff2", "Switzer-Semibold.woff2",
  "JetBrainsMono-Regular.woff2", "JetBrainsMono-Medium.woff2",
];

describe("self-hosted fonts", () => {
  it.each(required)("%s exists and is a real font file", (name) => {
    const s = statSync(resolve(dir, name));
    expect(s.size).toBeGreaterThan(5_000);
  });
});
