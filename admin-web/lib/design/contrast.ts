/**
 * WCAG 2.1 relative-luminance / contrast-ratio maths.
 *
 * Shared by tests/contrast.test.ts (the node-side guard) and the /foundations
 * contrast block. jsdom + axe cannot evaluate colour contrast, so this is the
 * compensating control for spec §12.1 criterion #11.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** Parse `#rgb`, `#rrggbb`, or `rgba(r, g, b, a)` into channel values (a defaults to 1). */
export function parseColor(input: string): Rgb & { a: number } {
  const s = input.trim();
  const rgba = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
  if (rgba) {
    return {
      r: Number(rgba[1]),
      g: Number(rgba[2]),
      b: Number(rgba[3]),
      a: rgba[4] === undefined ? 1 : Number(rgba[4]),
    };
  }
  const hex = s.replace(/^#/, "");
  if (hex.length === 3) {
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
      a: 1,
    };
  }
  if (hex.length === 6 || hex.length === 8) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1,
    };
  }
  throw new Error(`parseColor: unsupported colour "${input}"`);
}

/** WCAG relative luminance of an opaque colour. */
export function relLuminance(color: string): number {
  const { r, g, b } = parseColor(color);
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG contrast ratio between two opaque colours (1..21). */
export function ratio(a: string, b: string): number {
  const la = relLuminance(a);
  const lb = relLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Composite a (possibly translucent) foreground over an opaque background. */
export function blend(fg: string, bg: string): string {
  const f = parseColor(fg);
  const b = parseColor(bg);
  const mix = (x: number, y: number) => Math.round(x * f.a + y * (1 - f.a));
  const hx = (n: number) => n.toString(16).padStart(2, "0");
  return `#${hx(mix(f.r, b.r))}${hx(mix(f.g, b.g))}${hx(mix(f.b, b.b))}`;
}

/** Round to 2dp for display. */
export function formatRatio(n: number): string {
  return n.toFixed(2);
}
