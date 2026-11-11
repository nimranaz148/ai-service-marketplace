/**
 * Typed mirror of the CSS custom properties in app/globals.css :root.
 * Only for JS that cannot read a CSS variable (e.g. a GSAP tween, a canvas fill).
 * Kept in lock-step with globals.css by tests/token-parity.test.ts.
 */
export const tokens = {
  color: {
    "warm-950": "#0B0B0B", "warm-900": "#131211", "warm-850": "#1A1917",
    "warm-800": "#232120", "warm-700": "#2E2B29", "warm-500": "#8A8882",
    "warm-300": "#B8B5AD", "warm-150": "#DEDBD2", "warm-100": "#F5F2EA",
    "paper-0": "#FBFAF6", "paper-50": "#F4F2EC", "paper-100": "#ECEAE1", "paper-200": "#E4E1D7",
    "ink-900": "#1C1A17", "ink-700": "#3D3A34", "ink-500": "#6B665C",
    "ember-600": "#C24A1E", "ember-500": "#DE5527", "ember-400": "#F26B3A",
    "ember-tint": "rgba(222, 85, 39, 0.12)",
    "accent-strong": "#C24A1E",
    "accent-strong-hover": "#A63D18",
    signal: "#FF5A1F",
    "go-500": "#2E7D5B", "warn-500": "#C98A12", "stop-500": "#C0392B", "info-500": "#3E6C8A",
    tile: "#1E3A5F", terracotta: "#A8492B", brass: "#B08D57", plaster: "#EBE6D9",
    // Explicit rgba tint/line roles — Tailwind cannot alpha-modify a var() colour.
    "status-go-tint": "rgba(46, 125, 91, 0.12)",
    "status-go-line": "rgba(46, 125, 91, 0.30)",
    "status-warn-tint": "rgba(201, 138, 18, 0.14)",
    "status-warn-line": "rgba(201, 138, 18, 0.32)",
    "status-stop-tint": "rgba(192, 57, 43, 0.12)",
    "status-stop-line": "rgba(192, 57, 43, 0.30)",
    "status-info-tint": "rgba(62, 108, 138, 0.12)",
    "status-info-line": "rgba(62, 108, 138, 0.30)",
    "status-live-tint": "rgba(255, 90, 31, 0.12)",
    "status-live-line": "rgba(255, 90, 31, 0.34)",
    scrim: "rgba(0, 0, 0, 0.55)",
  },
  space: {
    "space-1": "0.125rem", "space-2": "0.25rem", "space-3": "0.5rem", "space-4": "0.75rem",
    "space-5": "1rem", "space-6": "1.5rem", "space-7": "2rem", "space-8": "3rem",
    "space-9": "4rem", "space-10": "6rem",
  },
  radius: { "r-sm": "4px", "r-md": "8px", "r-lg": "12px", "r-pill": "999px" },
  duration: { "dur-fast": "120ms", dur: "180ms", "dur-slow": "260ms" },
  easing: {
    "ease-standard": "cubic-bezier(0.2, 0, 0, 1)",
    "ease-out": "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  viz: ["#DE5527", "#3E6C8A", "#B08D57", "#2E7D5B", "#8A5A3C", "#6B665C"] as const,
} as const;

export type TokenColor = keyof typeof tokens.color;
