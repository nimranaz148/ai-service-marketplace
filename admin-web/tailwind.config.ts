import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "var(--surface)",
        "surface-sunken": "var(--surface-sunken)",
        "surface-raised": "var(--surface-raised)",
        hairline: "var(--hairline)",
        ink: "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          ink: "var(--accent-ink)",
          tint: "var(--accent-tint)",
        },
        status: {
          go: "var(--status-go)",
          "go-tint": "var(--status-go-tint)",
          "go-line": "var(--status-go-line)",
          warn: "var(--status-warn)",
          "warn-tint": "var(--status-warn-tint)",
          "warn-line": "var(--status-warn-line)",
          stop: "var(--status-stop)",
          "stop-tint": "var(--status-stop-tint)",
          "stop-line": "var(--status-stop-line)",
          info: "var(--status-info)",
          "info-tint": "var(--status-info-tint)",
          "info-line": "var(--status-info-line)",
          live: "var(--status-live)",
          "live-tint": "var(--status-live-tint)",
          "live-line": "var(--status-live-line)",
        },
        scrim: "var(--scrim)",
        viz: {
          1: "var(--viz-1)", 2: "var(--viz-2)", 3: "var(--viz-3)",
          4: "var(--viz-4)", 5: "var(--viz-5)", 6: "var(--viz-6)",
        },
        // shadcn-conventional names -> aliases defined in globals.css
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        secondary: { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        destructive: { DEFAULT: "var(--destructive)", foreground: "var(--destructive-foreground)" },
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
        card: { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" },
        popover: { DEFAULT: "var(--popover)", foreground: "var(--popover-foreground)" },
      },
      fontFamily: {
        display: ["var(--font-clash)", "ui-sans-serif", "system-ui", "sans-serif"],
        editorial: ["var(--font-zodiak)", "Georgia", "serif"],
        sans: ["var(--font-switzer)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-jbmono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        xs: "var(--text-xs)", sm: "var(--text-sm)", base: "var(--text-base)",
        md: "var(--text-md)", lg: "var(--text-lg)", xl: "var(--text-xl)",
        "2xl": "var(--text-2xl)", "3xl": "var(--text-3xl)", "4xl": "var(--text-4xl)",
        "5xl": "var(--text-5xl)", "6xl": "var(--text-6xl)",
      },
      borderRadius: { sm: "var(--r-sm)", md: "var(--r-md)", lg: "var(--r-lg)", pill: "var(--r-pill)" },
      boxShadow: { raised: "var(--elevation-raised)", overlay: "var(--elevation-overlay)" },
      transitionTimingFunction: { standard: "var(--ease-standard)", out: "var(--ease-out)" },
      transitionDuration: { fast: "var(--dur-fast)", DEFAULT: "var(--dur)", slow: "var(--dur-slow)" },
    },
  },
  // shadcn's overlay primitives use animate-in / animate-out / fade-in-0 / zoom-in-95 /
  // slide-in-from-*; without this plugin those classes emit no CSS at all.
  plugins: [require("tailwindcss-animate")],
};

export default config;
