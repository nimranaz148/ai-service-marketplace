# Phase 0 — Foundation & Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the app's three contradicting token generations, dead components, and scattered fake data with one CSS-variable token system, a shadcn/ui primitive layer, self-hosted editorial type, a `contracts` + `fixtures` data source of truth, agent-activity primitives that cannot fake activity, and a rebuilt application shell — proven on an internal `/foundations` page.

**Architecture:** Semantic CSS custom properties in `app/globals.css` are the sole source of truth; `tailwind.config.ts` only references them. A dark "marketing" role set and a light "application" role set coexist, switched by `data-theme`. shadcn/ui components are generated then restyled to the tokens. Data lives in `lib/fixtures/` typed by `lib/contracts/` (which also defines the Phase-2 agent-event streaming contract now, so nothing reshapes later). GSAP is marketing-only; framer-motion is app-only and restrained. All feature pages except the shell are left transitional for their own later phases.

**Tech Stack:** Next.js 14.2 (App Router), TypeScript 5.6, Tailwind CSS 3.4, shadcn/ui + Radix, `next/font/local`, GSAP 3.13 (+ ScrollTrigger, SplitText), framer-motion 11, Vitest + @testing-library/react + jsdom + vitest-axe, Python (backend seed only).

**Spec:** `docs/superpowers/specs/2026-09-10-phase-0-foundation-design.md`

## Global Constraints

- **Branch:** all work on `frontend/revamp-ui`.
- **Token source of truth:** values are defined once, in `admin-web/app/globals.css` `@layer base`. `tailwind.config.ts` contains **no literal colour/size/shadow/easing values** — only `var(--…)` references. Components reference **semantic roles** (`var(--surface)`, `bg-accent`, …), never primitives (`--warm-950`) directly.
- **Two role sets only:** light `:root` (application) and `[data-theme="marketing"]` / `.theme-marketing` (dark marketing). The `@media (prefers-color-scheme: dark)` block exists but is intentionally empty. The app shell wrapper sets `data-theme="light"` explicitly.
- **Fonts:** `Clash Display`, `Zodiak`, `Switzer`, `JetBrains Mono`, all self-hosted `.woff2` under `admin-web/public/fonts/`, wired via `next/font/local` in `admin-web/lib/fonts.ts`. No `fonts.googleapis.com`, no font CDN, no `@import` for fonts.
- **Anti-slop (enforced in every task):** max radius `--r-lg` (12px) on app surfaces; no blur-blob decorations; no glow shadows (`shadow-[0_0_Npx_rgba(...)]`); no decorative gradients; no emoji in UI chrome; no fabricated metrics or fake precision; no repeated "eyebrow badge + huge headline + blurb + KPI grid" template; no icon without a label or standalone-affordance reason; every animation must encode a state change, orientation, or a real event.
- **No fake activity:** no component may run a timer, interval, or scripted step-progression to imply work is happening. Activity UI renders only from event/data props.
- **Colour rules:** `--accent` (ember `#DE5527`) = primary actions / active nav / focus / one highlight per view. `--status-live` (signal `#FF5A1F`) = only a genuinely-executing/live state, never a static badge or CTA. Craft palette (`--tile/--terracotta/--brass/--plaster`) = marketing subtree only. `--viz-1..6` = the only categorical data palette.
- **Verification bar for every task:** `cd admin-web && npx tsc --noEmit` exits 0, and `npm run test` passes, before the task's commit. `npm run build` is run at the tasks that touch config, fonts, or the shell, and at the final task.
- **Commits:** end every commit message body with:
  ```
  Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01SovFAgp53V1JhiFmcoVHTo
  ```

---

## File Structure

**Created**

| Path | Responsibility |
|---|---|
| `admin-web/vitest.config.ts` | Vitest config: jsdom env, setup file, `@/` alias. |
| `admin-web/vitest.setup.ts` | `@testing-library/jest-dom` + `vitest-axe/extend-expect`. |
| `admin-web/lib/design/tokens.ts` | Typed JS mirror of the CSS token values, for JS that cannot read a CSS var. |
| `admin-web/tests/token-parity.test.ts` | Asserts `tokens.ts` matches the `:root` custom properties in `globals.css`. |
| `admin-web/lib/fonts.ts` | The four `next/font/local` instances + their CSS-variable bindings. |
| `admin-web/public/fonts/*.woff2` | Self-hosted font files + `LICENSE` files. |
| `admin-web/lib/contracts/{index,user,provider,city,booking,session,agent-event}.ts` | API-shaped types shared by fixtures now and real endpoints later. |
| `admin-web/lib/contracts/agent-event.test.ts` | Runtime guard test for the `AgentEvent` discriminated union. |
| `admin-web/lib/fixtures/{index,personas,providers,cities,bookings,sessions}.ts` | Canonical demo data; every identity defined once. |
| `admin-web/lib/fixtures/fixtures.test.ts` | Referential-integrity checks across the fixtures. |
| `admin-web/lib/motion/gsap.ts` | Single guarded GSAP + plugin registration boundary (`'use client'`). |
| `admin-web/lib/motion/variants.ts` | The small approved set of framer-motion variants. |
| `admin-web/lib/nav.ts` | Typed role → nav-item definitions. |
| `admin-web/components/primitives/{page-header,stat-tile,stat-row,empty-state,data-table,timeline,agent-event-item,tool-call-chip,status-badge}.tsx` | Composed app primitives. |
| `admin-web/components/primitives/*.test.tsx` | Behaviour + a11y tests for the logic-bearing primitives. |
| `admin-web/components/layout/{app-shell,sidebar,topbar,auth-gate}.tsx` | Rebuilt shell. |
| `admin-web/components/dev/persona-switcher.tsx` | Dev-only fixture-persona switcher. |
| `admin-web/components/layout/auth-gate.test.tsx` | RBAC shape test for the stub gate. |
| `admin-web/app/foundations/page.tsx` (+ `admin-web/components/foundations/*`) | Internal reference page for every token, style, and primitive. |

**Modified**

| Path | Change |
|---|---|
| `admin-web/package.json` | Bump `gsap` → `^3.13.0`; add dev deps + `test` script. |
| `admin-web/app/globals.css` | Rewritten as the token layer; Google-fonts `@import` and `.catalis-*` utilities removed. |
| `admin-web/tailwind.config.ts` | Rewritten: `var(--…)`-referencing theme only; legacy colour blocks removed. |
| `admin-web/app/layout.tsx` | Apply font variables; drop `dark` class + hardcoded hex; set `data-theme="light"`; import new shell. |
| `admin-web/components.json` | Ensure aliases/paths correct for generation. |
| `admin-web/lib/api.ts` | Replace ad-hoc interfaces with re-exports from `lib/contracts`. |
| `admin-web/lib/auth-context.tsx` | `PRESET_USERS` imports its data from `lib/fixtures/personas`. |
| `admin-web/components/ui/*.tsx` | shadcn-generated, restyled to tokens. |
| `backend/app/db/seed.py` | Trimmed to mirror the canonical fixture set. |

**Deleted**

`admin-web/components/landing/{AgentSymphony,AuditObservability,ProofStrip,ServiceBentoGrid,VoiceShowcase}.tsx` · `admin-web/components/ui/{badge,button,card,table}.tsx` (hand-rolled) · `admin-web/components/ui/{MagneticButton,SpotlightCard,Toaster}.tsx` · `admin-web/components/layout/AppShell.tsx`.

---

## Task 1: Tooling — dependencies, Vitest, test harness

**Files:**
- Modify: `admin-web/package.json`
- Create: `admin-web/vitest.config.ts`, `admin-web/vitest.setup.ts`, `admin-web/tests/sanity.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `npm run test` (runs Vitest in jsdom with `@/` alias and `vitest-axe` + `jest-dom` matchers); `gsap@^3.13` available.

- [ ] **Step 1: Add dependencies**

Run in `admin-web/`:

```bash
npm install gsap@^3.13.0
npm install -D vitest@^2.1.0 @vitejs/plugin-react@^4.3.0 jsdom@^25.0.0 \
  @testing-library/react@^16.0.0 @testing-library/dom@^10.4.0 \
  @testing-library/jest-dom@^6.5.0 @testing-library/user-event@^14.5.0 \
  vitest-axe@^0.1.0 vite-tsconfig-paths@^5.0.0
```

- [ ] **Step 2: Add the `test` script**

In `admin-web/package.json` `"scripts"`, add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create `admin-web/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next"],
  },
});
```

- [ ] **Step 4: Create `admin-web/vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
import * as matchers from "vitest-axe/matchers";
import { expect } from "vitest";

expect.extend(matchers);
```

- [ ] **Step 5: Create `admin-web/tests/sanity.test.ts`**

```ts
import { describe, it, expect } from "vitest";

describe("test harness", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run the tests**

Run: `cd admin-web && npm run test`
Expected: PASS (1 test).

- [ ] **Step 7: Verify build unaffected**

Run: `cd admin-web && npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 8: Commit**

```bash
git add admin-web/package.json admin-web/package-lock.json admin-web/vitest.config.ts admin-web/vitest.setup.ts admin-web/tests/sanity.test.ts
git commit -m "chore(admin-web): add vitest harness and gsap 3.13"
```

---

## Task 2: Token layer — `globals.css`, `tailwind.config.ts`, `tokens.ts`, parity test

**Files:**
- Rewrite: `admin-web/app/globals.css`, `admin-web/tailwind.config.ts`
- Create: `admin-web/lib/design/tokens.ts`, `admin-web/tests/token-parity.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - CSS custom properties on `:root` and `[data-theme="marketing"]` (exact set below).
  - Tailwind tokens: `bg-surface|surface-sunken|surface-raised`, `border-hairline`, `text-ink|ink-muted`, `bg-accent`/`text-accent`/`bg-accent-tint`/`accent-hover`/`text-accent-ink`, `text-status-{go,warn,stop,info,live}`, `bg-viz-{1..6}`, `font-display|editorial|sans|mono`, `text-{xs..6xl}`, `rounded-{sm,md,lg,pill}`, `shadow-{raised,overlay}`, `ease-{standard,out}`, `duration-{fast,DEFAULT,slow}`.
  - shadcn-conventional aliases (`--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent` note, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--ring`, `--radius`) mapped onto the semantic roles, so shadcn components work without per-component hex.
  - `tokens` object from `lib/design/tokens.ts` with keys `color`, `space`, `radius`, `duration`, `easing`, `viz`.

- [ ] **Step 1: Write the failing parity test — `admin-web/tests/token-parity.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { tokens } from "@/lib/design/tokens";

const css = readFileSync(resolve(__dirname, "../app/globals.css"), "utf8");

/** Extract `--name: value;` pairs from the first :root { ... } block. */
function rootVars(source: string): Record<string, string> {
  const block = source.slice(source.indexOf(":root"));
  const body = block.slice(block.indexOf("{") + 1, block.indexOf("}"));
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
```

- [ ] **Step 2: Run it — verify it fails**

Run: `cd admin-web && npm run test -- token-parity`
Expected: FAIL — `Cannot find module '@/lib/design/tokens'`.

- [ ] **Step 3: Rewrite `admin-web/app/globals.css`**

Replace the entire file with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ---- PRIMITIVES (never referenced by components directly) ---- */
    --warm-950: #0B0B0B;
    --warm-900: #131211;
    --warm-850: #1A1917;
    --warm-800: #232120;
    --warm-700: #2E2B29;
    --warm-500: #8A8882;
    --warm-300: #B8B5AD;
    --warm-150: #DEDBD2;
    --warm-100: #F5F2EA;

    --paper-0: #FBFAF6;
    --paper-50: #F4F2EC;
    --paper-100: #ECEAE1;
    --paper-200: #E4E1D7;

    --ink-900: #1C1A17;
    --ink-700: #3D3A34;
    --ink-500: #6B665C;

    --ember-600: #C24A1E;
    --ember-500: #DE5527;
    --ember-400: #F26B3A;
    --ember-tint: rgba(222, 85, 39, 0.12);

    --signal: #FF5A1F;

    --go-500: #2E7D5B;
    --warn-500: #C98A12;
    --stop-500: #C0392B;
    --info-500: #3E6C8A;

    --tile: #1E3A5F;
    --terracotta: #A8492B;
    --brass: #B08D57;
    --plaster: #EBE6D9;

    --viz-1: #DE5527;
    --viz-2: #3E6C8A;
    --viz-3: #B08D57;
    --viz-4: #2E7D5B;
    --viz-5: #8A5A3C;
    --viz-6: #6B665C;

    /* ---- SCALES ---- */
    --text-xs: 0.75rem;
    --text-sm: 0.8125rem;
    --text-base: 0.875rem;
    --text-md: 1rem;
    --text-lg: 1.125rem;
    --text-xl: 1.3125rem;
    --text-2xl: 1.625rem;
    --text-3xl: 2.0625rem;
    --text-4xl: 2.625rem;
    --text-5xl: 3.375rem;
    --text-6xl: 4.25rem;

    --space-1: 0.125rem;
    --space-2: 0.25rem;
    --space-3: 0.5rem;
    --space-4: 0.75rem;
    --space-5: 1rem;
    --space-6: 1.5rem;
    --space-7: 2rem;
    --space-8: 3rem;
    --space-9: 4rem;
    --space-10: 6rem;

    --r-sm: 4px;
    --r-md: 8px;
    --r-lg: 12px;
    --r-pill: 999px;

    --e-raised: 0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 1px rgba(0, 0, 0, 0.04);
    --e-overlay: 0 8px 24px rgba(0, 0, 0, 0.16);

    --dur-fast: 120ms;
    --dur: 180ms;
    --dur-slow: 260ms;
    --ease-standard: cubic-bezier(0.2, 0, 0, 1);
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);

    /* ---- SEMANTIC ROLES — light application surface (default) ---- */
    --surface: var(--paper-0);
    --surface-sunken: var(--paper-50);
    --surface-raised: #FFFFFF;
    --hairline: var(--paper-200);
    --ink: var(--ink-900);
    --ink-muted: var(--ink-500);
    --accent: var(--ember-500);
    --accent-hover: var(--ember-600);
    --accent-ink: #FFFFFF;
    --accent-tint: var(--ember-tint);
    --focus-ring: var(--ember-500);
    --status-go: var(--go-500);
    --status-warn: var(--warn-500);
    --status-stop: var(--stop-500);
    --status-info: var(--info-500);
    --status-live: var(--signal);
    --elevation-raised: var(--e-raised);
    --elevation-overlay: var(--e-overlay);

    /* ---- shadcn-conventional aliases onto the semantic roles ---- */
    --background: var(--surface);
    --foreground: var(--ink);
    --card: var(--surface-raised);
    --card-foreground: var(--ink);
    --popover: var(--surface-raised);
    --popover-foreground: var(--ink);
    --primary: var(--accent);
    --primary-foreground: var(--accent-ink);
    --secondary: var(--surface-sunken);
    --secondary-foreground: var(--ink);
    --muted: var(--surface-sunken);
    --muted-foreground: var(--ink-muted);
    --accent-foreground: var(--ink);
    --destructive: var(--status-stop);
    --destructive-foreground: #FFFFFF;
    --border: var(--hairline);
    --input: var(--hairline);
    --ring: var(--focus-ring);
    --radius: var(--r-md);
  }

  [data-theme="marketing"],
  .theme-marketing {
    --surface: var(--warm-950);
    --surface-sunken: #060606;
    --surface-raised: var(--warm-900);
    --hairline: rgba(245, 242, 234, 0.10);
    --ink: var(--warm-100);
    --ink-muted: var(--warm-500);
    --accent: var(--ember-500);
    --accent-hover: var(--ember-400);
    --accent-ink: #FFFFFF;
    --accent-tint: var(--ember-tint);
    --focus-ring: var(--ember-400);
    --elevation-raised: none;
    --elevation-overlay: 0 16px 48px rgba(0, 0, 0, 0.5);
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]):not([data-theme="marketing"]) {
      /* Reserved for a future application dark theme. Intentionally empty in Phase 0. */
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  * {
    border-color: var(--hairline);
    box-sizing: border-box;
  }

  body {
    background-color: var(--surface);
    color: var(--ink);
    font-family: var(--font-switzer), ui-sans-serif, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::selection {
    background-color: var(--accent);
    color: var(--accent-ink);
  }
}

::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: var(--surface-sunken); }
::-webkit-scrollbar-thumb { background: var(--hairline); border-radius: var(--r-pill); }
```

- [ ] **Step 4: Rewrite `admin-web/tailwind.config.ts`**

```ts
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
          warn: "var(--status-warn)",
          stop: "var(--status-stop)",
          info: "var(--status-info)",
          live: "var(--status-live)",
        },
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
  plugins: [],
};

export default config;
```

- [ ] **Step 5: Create `admin-web/lib/design/tokens.ts`**

```ts
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
    signal: "#FF5A1F",
    "go-500": "#2E7D5B", "warn-500": "#C98A12", "stop-500": "#C0392B", "info-500": "#3E6C8A",
    tile: "#1E3A5F", terracotta: "#A8492B", brass: "#B08D57", plaster: "#EBE6D9",
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
```

- [ ] **Step 6: Run the parity test — verify it passes**

Run: `cd admin-web && npm run test -- token-parity`
Expected: PASS (3 tests). If a value-drift assertion fails, fix `tokens.ts` to match `globals.css` verbatim (globals.css wins).

- [ ] **Step 7: Verify types and build**

Run: `cd admin-web && npx tsc --noEmit && npm run build`
Expected: both exit 0. (Feature pages still compile — they use arbitrary hex, not the removed named tokens. The four hand-rolled `components/ui/*` files still reference `hsl(var(--border))` etc.; those vars no longer exist but Tailwind resolves unknown arbitrary values to nothing rather than erroring — build stays green. They are replaced in Task 7.)

- [ ] **Step 8: Commit**

```bash
git add admin-web/app/globals.css admin-web/tailwind.config.ts admin-web/lib/design/tokens.ts admin-web/tests/token-parity.test.ts
git commit -m "feat(admin-web): single CSS-variable token system as source of truth"
```

---

## Task 3: Self-hosted fonts

**Files:**
- Create: `admin-web/public/fonts/` (`.woff2` + `LICENSE` files), `admin-web/lib/fonts.ts`, `admin-web/tests/fonts.test.ts`
- Modify: `admin-web/app/layout.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `fonts` from `lib/fonts.ts` — an object `{ clash, zodiak, switzer, jbmono }` of `next/font/local` results, and `fontVariables: string` (space-joined `.variable` class names) binding `--font-clash`, `--font-zodiak`, `--font-switzer`, `--font-jbmono`.

- [ ] **Step 1: Acquire the font files**

Run in a scratch dir, then copy results into `admin-web/public/fonts/`:

```bash
# Fontshare families (free for commercial use, self-hostable)
curl -L "https://api.fontshare.com/v2/fonts/download/clash-display" -o clash.zip
curl -L "https://api.fontshare.com/v2/fonts/download/zodiak" -o zodiak.zip
curl -L "https://api.fontshare.com/v2/fonts/download/switzer" -o switzer.zip
unzip -o clash.zip -d clash && unzip -o zodiak.zip -d zodiak && unzip -o switzer.zip -d switzer
```

Copy these exact files into `admin-web/public/fonts/` (rename as shown):

| Source (inside each zip's `*/WEB/fonts/` or `*/*.woff2`) | Destination filename |
|---|---|
| Clash Display 500 woff2 | `ClashDisplay-Medium.woff2` |
| Clash Display 600 woff2 | `ClashDisplay-Semibold.woff2` |
| Zodiak 400 woff2 | `Zodiak-Regular.woff2` |
| Zodiak 400 italic woff2 | `Zodiak-Italic.woff2` |
| Switzer 400 woff2 | `Switzer-Regular.woff2` |
| Switzer 500 woff2 | `Switzer-Medium.woff2` |
| Switzer 600 woff2 | `Switzer-Semibold.woff2` |

For **JetBrains Mono** (OFL), download the self-host woff2 for weights 400 and 500 from google-webfonts-helper (`https://gwfh.mranftl.com/fonts/jetbrains-mono?subsets=latin`) and save as `JetBrainsMono-Regular.woff2`, `JetBrainsMono-Medium.woff2`.

Also copy each family's license text to `admin-web/public/fonts/LICENSE-ClashDisplay.txt`, `LICENSE-Zodiak.txt`, `LICENSE-Switzer.txt`, `LICENSE-JetBrainsMono.txt`.

If any `curl` endpoint is unreachable, use the family's download button on `fontshare.com` / the gwfh web UI and place the same files.

- [ ] **Step 2: Write `admin-web/tests/fonts.test.ts`**

```ts
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
```

- [ ] **Step 3: Run it — verify it fails or passes**

Run: `cd admin-web && npm run test -- fonts`
Expected: PASS once Step 1 files are in place. If FAIL, a file is missing or truncated — redo Step 1 for that file.

- [ ] **Step 4: Create `admin-web/lib/fonts.ts`**

```ts
import localFont from "next/font/local";

export const clash = localFont({
  src: [
    { path: "../public/fonts/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-clash",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const zodiak = localFont({
  src: [
    { path: "../public/fonts/Zodiak-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Zodiak-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-zodiak",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export const switzer = localFont({
  src: [
    { path: "../public/fonts/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Switzer-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/Switzer-Semibold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-switzer",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const jbmono = localFont({
  src: [
    { path: "../public/fonts/JetBrainsMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/JetBrainsMono-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-jbmono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const fonts = { clash, zodiak, switzer, jbmono };
export const fontVariables = [clash.variable, zodiak.variable, switzer.variable, jbmono.variable].join(" ");
```

- [ ] **Step 5: Update `admin-web/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { AppShell } from "@/components/layout/app-shell";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Atelier — Local Service Concierge",
  description:
    "Multi-agent local service marketplace for Pakistan. Book verified artisans in Islamabad, Karachi, and Lahore.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fontVariables} scroll-smooth`} suppressHydrationWarning>
      <body data-theme="light" className="min-h-screen bg-surface text-ink antialiased">
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  );
}
```

Note: `@/components/layout/app-shell` and `@/components/ui/sonner` do not exist yet — they arrive in Tasks 11 and 7. Until then `npm run build` will fail on this file; that is expected and is resolved by Task 7. `npx tsc --noEmit` will report the two missing modules — record it and proceed. Do **not** re-add the old `AppShell`/`Toaster` imports.

- [ ] **Step 6: Run font + parity tests**

Run: `cd admin-web && npm run test -- fonts token-parity`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add admin-web/public/fonts admin-web/lib/fonts.ts admin-web/tests/fonts.test.ts admin-web/app/layout.tsx
git commit -m "feat(admin-web): self-host Clash Display, Zodiak, Switzer, JetBrains Mono"
```

---

## Task 4: Contracts

**Files:**
- Create: `admin-web/lib/contracts/{user,provider,city,booking,session,agent-event,index}.ts`, `admin-web/lib/contracts/agent-event.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces (imported by Tasks 5, 8, 10, 11):
  - `UserRole = "admin" | "provider" | "customer"`
  - `AppUser { id: string; role: UserRole; name: string; email: string; phone: string; city: CityId; area: string; avatarInitials: string; category?: ProviderCategory; }`
  - `CityId = "isb" | "khi" | "lhe"`; `City { id: CityId; name: string; areas: string[]; }`
  - `ProviderCategory = "ac" | "plumber" | "electrician" | "cleaner" | "tutor"`
  - `Provider { id: string; name: string; category: ProviderCategory; city: CityId; area: string; rating: number; jobsCompleted: number; priceLabel: string; verified: boolean; active: boolean; }`
  - `ProviderSlot { id: string; providerId: string; date: string; time: string; booked: boolean; }`
  - `BookingStatus = "confirmed" | "en_route" | "arrived" | "completed" | "cancelled"`
  - `Booking { id: string; token: string; customerId: string; providerId: string; slotId: string; status: BookingStatus; pricePkr: number; createdAt: string; }`
  - `IntentResult { serviceType: ProviderCategory; area: string; timePreference: string; urgency: "low" | "medium" | "high"; language: "en" | "ur" | "roman_ur"; }`
  - `AgentSession { id: string; customerId: string; rawInput: string; language: IntentResult["language"]; status: "in_progress" | "completed" | "failed"; startedAt: string; intent?: IntentResult; events: AgentEvent[]; }`
  - `AgentEventKind`, `AgentEvent` (discriminated union — see below), and `isAgentEvent(x: unknown): x is AgentEvent`.

- [ ] **Step 1: Write the failing test — `admin-web/lib/contracts/agent-event.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { isAgentEvent, type AgentEvent } from "./agent-event";

const base = { sessionId: "s1", step: 1, agentName: "IntentAgent", timestamp: "2026-09-10T10:00:00Z" };

describe("isAgentEvent", () => {
  it("accepts every valid kind", () => {
    const kinds: AgentEvent["kind"][] = [
      "agent_started", "tool_call_started", "tool_call_result", "info_found",
      "question_required", "approval_required", "agent_completed", "error",
    ];
    for (const kind of kinds) {
      expect(isAgentEvent({ ...base, kind, summary: "x", payload: {} })).toBe(true);
    }
  });

  it("rejects unknown kind and malformed objects", () => {
    expect(isAgentEvent({ ...base, kind: "nope", summary: "x", payload: {} })).toBe(false);
    expect(isAgentEvent({ kind: "error" })).toBe(false);
    expect(isAgentEvent(null)).toBe(false);
    expect(isAgentEvent("agent_started")).toBe(false);
  });

  it("requires toolName on tool_call_* kinds", () => {
    expect(isAgentEvent({ ...base, kind: "tool_call_started", summary: "x", payload: {}, toolName: "find_providers" })).toBe(true);
    expect(isAgentEvent({ ...base, kind: "tool_call_started", summary: "x", payload: {} })).toBe(false);
  });
});
```

- [ ] **Step 2: Run it — verify it fails**

Run: `cd admin-web && npm run test -- agent-event`
Expected: FAIL — `Cannot find module './agent-event'`.

- [ ] **Step 3: Create `admin-web/lib/contracts/city.ts`**

```ts
export type CityId = "isb" | "khi" | "lhe";
export interface City {
  id: CityId;
  name: string;
  areas: string[];
}
```

- [ ] **Step 4: Create `admin-web/lib/contracts/provider.ts`**

```ts
import type { CityId } from "./city";

export type ProviderCategory = "ac" | "plumber" | "electrician" | "cleaner" | "tutor";

export const PROVIDER_CATEGORY_LABEL: Record<ProviderCategory, string> = {
  ac: "AC Technician",
  plumber: "Plumber",
  electrician: "Electrician",
  cleaner: "Cleaner",
  tutor: "Tutor",
};

export interface Provider {
  id: string;
  name: string;
  category: ProviderCategory;
  city: CityId;
  area: string;
  rating: number;
  jobsCompleted: number;
  priceLabel: string;
  verified: boolean;
  active: boolean;
}

export interface ProviderSlot {
  id: string;
  providerId: string;
  date: string; // ISO date
  time: string; // "09:00 AM"
  booked: boolean;
}

export interface ProviderStats {
  providerId: string;
  upcomingJobs: number;
  monthlyEarningsPkr: number;
  rating: number;
  onTimeRate: number; // 0..1
}
```

- [ ] **Step 5: Create `admin-web/lib/contracts/user.ts`**

```ts
import type { CityId } from "./city";
import type { ProviderCategory } from "./provider";

export type UserRole = "admin" | "provider" | "customer";

export interface AppUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  city: CityId;
  area: string;
  avatarInitials: string;
  category?: ProviderCategory; // providers only
}
```

- [ ] **Step 6: Create `admin-web/lib/contracts/booking.ts`**

```ts
export type BookingStatus =
  | "confirmed"
  | "en_route"
  | "arrived"
  | "completed"
  | "cancelled";

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  confirmed: "Confirmed",
  en_route: "En route",
  arrived: "Arrived",
  completed: "Completed",
  cancelled: "Cancelled",
};

export interface Booking {
  id: string;
  token: string; // "BK-4821"
  customerId: string;
  providerId: string;
  slotId: string;
  status: BookingStatus;
  pricePkr: number;
  createdAt: string; // ISO datetime
}
```

- [ ] **Step 7: Create `admin-web/lib/contracts/agent-event.ts`**

```ts
export type AgentEventKind =
  | "agent_started"
  | "tool_call_started"
  | "tool_call_result"
  | "info_found"
  | "question_required"
  | "approval_required"
  | "agent_completed"
  | "error";

interface AgentEventBase {
  sessionId: string;
  step: number;
  agentName: string;
  summary: string;
  payload: Record<string, unknown>;
  timestamp: string; // ISO datetime
  durationMs?: number;
}

export type AgentEvent =
  | (AgentEventBase & { kind: "agent_started" })
  | (AgentEventBase & { kind: "tool_call_started"; toolName: string })
  | (AgentEventBase & { kind: "tool_call_result"; toolName: string })
  | (AgentEventBase & { kind: "info_found" })
  | (AgentEventBase & { kind: "question_required"; question: string })
  | (AgentEventBase & { kind: "approval_required"; action: string })
  | (AgentEventBase & { kind: "agent_completed" })
  | (AgentEventBase & { kind: "error"; errorCode?: string });

const KINDS: readonly AgentEventKind[] = [
  "agent_started", "tool_call_started", "tool_call_result", "info_found",
  "question_required", "approval_required", "agent_completed", "error",
];

export function isAgentEvent(x: unknown): x is AgentEvent {
  if (typeof x !== "object" || x === null) return false;
  const e = x as Record<string, unknown>;
  if (typeof e.kind !== "string" || !KINDS.includes(e.kind as AgentEventKind)) return false;
  if (typeof e.sessionId !== "string" || typeof e.step !== "number") return false;
  if (typeof e.agentName !== "string" || typeof e.summary !== "string") return false;
  if (typeof e.timestamp !== "string" || typeof e.payload !== "object" || e.payload === null) return false;
  if ((e.kind === "tool_call_started" || e.kind === "tool_call_result") && typeof e.toolName !== "string") return false;
  return true;
}
```

- [ ] **Step 8: Create `admin-web/lib/contracts/session.ts`**

```ts
import type { ProviderCategory } from "./provider";
import type { AgentEvent } from "./agent-event";

export interface IntentResult {
  serviceType: ProviderCategory;
  area: string;
  timePreference: string;
  urgency: "low" | "medium" | "high";
  language: "en" | "ur" | "roman_ur";
}

export interface AgentSession {
  id: string;
  customerId: string;
  rawInput: string;
  language: IntentResult["language"];
  status: "in_progress" | "completed" | "failed";
  startedAt: string;
  intent?: IntentResult;
  events: AgentEvent[];
}
```

- [ ] **Step 9: Create `admin-web/lib/contracts/index.ts`**

```ts
export * from "./city";
export * from "./provider";
export * from "./user";
export * from "./booking";
export * from "./agent-event";
export * from "./session";
```

- [ ] **Step 10: Run the test — verify it passes**

Run: `cd admin-web && npm run test -- agent-event`
Expected: PASS (3 tests).

- [ ] **Step 11: Typecheck**

Run: `cd admin-web && npx tsc --noEmit`
Expected: only the two known missing-module errors from `layout.tsx` (Task 3, Step 5). No new errors in `lib/contracts`.

- [ ] **Step 12: Commit**

```bash
git add admin-web/lib/contracts
git commit -m "feat(admin-web): API-shaped contracts incl. Phase-2 agent-event union"
```

---

## Task 5: Fixtures + backend seed trim

**Files:**
- Create: `admin-web/lib/fixtures/{personas,providers,cities,bookings,sessions,index}.ts`, `admin-web/lib/fixtures/fixtures.test.ts`
- Modify: `admin-web/lib/api.ts`, `admin-web/lib/auth-context.tsx`, `backend/app/db/seed.py`

**Interfaces:**
- Consumes: everything from `@/lib/contracts`.
- Produces:
  - `personas: Record<UserRole, AppUser>` and `personaList: AppUser[]`
  - `cities: City[]`, `cityById: Record<CityId, City>`
  - `providers: Provider[]`, `providerSlots: ProviderSlot[]`
  - `bookings: Booking[]`
  - `sessions: AgentSession[]`
  - `getFixtures()` → `{ personas, cities, providers, providerSlots, bookings, sessions }`

- [ ] **Step 1: Write the failing test — `admin-web/lib/fixtures/fixtures.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { personas, personaList, cities, providers, providerSlots, bookings, sessions } from "./index";
import { isAgentEvent } from "@/lib/contracts";

describe("fixtures referential integrity", () => {
  it("has exactly one persona per role", () => {
    expect(personaList.map((p) => p.role).sort()).toEqual(["admin", "customer", "provider"]);
  });

  it("the provider persona exists in the provider roster as the same identity", () => {
    const match = providers.find((p) => p.name === personas.provider.name);
    expect(match, "provider persona must appear in roster").toBeTruthy();
    expect(match!.category).toBe(personas.provider.category);
    expect(match!.city).toBe(personas.provider.city);
  });

  it("provider names are unique", () => {
    expect(new Set(providers.map((p) => p.name)).size).toBe(providers.length);
  });

  it("every provider references a known city id", () => {
    const ids = new Set(cities.map((c) => c.id));
    for (const p of providers) expect(ids.has(p.city)).toBe(true);
  });

  it("every slot references a known provider", () => {
    const ids = new Set(providers.map((p) => p.id));
    for (const s of providerSlots) expect(ids.has(s.providerId)).toBe(true);
  });

  it("every booking references a real customer, provider, and slot, and covers all statuses", () => {
    const providerIds = new Set(providers.map((p) => p.id));
    const slotIds = new Set(providerSlots.map((s) => s.id));
    for (const b of bookings) {
      expect(b.customerId).toBe(personas.customer.id);
      expect(providerIds.has(b.providerId)).toBe(true);
      expect(slotIds.has(b.slotId)).toBe(true);
    }
    expect(new Set(bookings.map((b) => b.status))).toEqual(
      new Set(["confirmed", "en_route", "arrived", "completed", "cancelled"]),
    );
  });

  it("sample sessions carry valid events including a question and an approval", () => {
    const kinds = sessions.flatMap((s) => s.events.map((e) => e.kind));
    expect(sessions.every((s) => s.events.every(isAgentEvent))).toBe(true);
    expect(kinds).toContain("question_required");
    expect(kinds).toContain("approval_required");
  });
});
```

- [ ] **Step 2: Run it — verify it fails**

Run: `cd admin-web && npm run test -- fixtures`
Expected: FAIL — `Cannot find module './index'`.

- [ ] **Step 3: Create `admin-web/lib/fixtures/cities.ts`**

```ts
import type { City, CityId } from "@/lib/contracts";

export const cities: City[] = [
  { id: "isb", name: "Islamabad", areas: ["Sector G-13", "Sector G-11", "Sector F-10", "Sector F-11", "Sector I-8", "Blue Area", "Bahria Town"] },
  { id: "khi", name: "Karachi", areas: ["Gulshan-e-Iqbal", "DHA Phase 5", "Clifton", "PECHS", "Gulistan-e-Johar", "North Nazimabad"] },
  { id: "lhe", name: "Lahore", areas: ["DHA Phase 5", "Gulberg", "Model Town", "Johar Town", "Bahria Town"] },
];

export const cityById = Object.fromEntries(cities.map((c) => [c.id, c])) as Record<CityId, City>;
```

- [ ] **Step 4: Create `admin-web/lib/fixtures/personas.ts`**

```ts
import type { AppUser, UserRole } from "@/lib/contracts";

export const personas: Record<UserRole, AppUser> = {
  admin: {
    id: "usr-admin-01", role: "admin", name: "Ayesha Malik",
    email: "ayesha.malik@atelier.pk", phone: "+92 51 888 2040",
    city: "isb", area: "Blue Area", avatarInitials: "AM",
  },
  provider: {
    id: "usr-prov-01", role: "provider", name: "Tariq Mehmood",
    email: "tariq.mehmood@atelier.pk", phone: "+92 301 555 4321",
    city: "isb", area: "Sector G-13", avatarInitials: "TM", category: "ac",
  },
  customer: {
    id: "usr-cust-01", role: "customer", name: "Zubair Khan",
    email: "zubair.khan@gmail.com", phone: "+92 300 987 6543",
    city: "khi", area: "Gulshan-e-Iqbal", avatarInitials: "ZK",
  },
};

export const personaList: AppUser[] = Object.values(personas);
```

- [ ] **Step 5: Create `admin-web/lib/fixtures/providers.ts`**

```ts
import type { Provider, ProviderSlot } from "@/lib/contracts";

export const providers: Provider[] = [
  { id: "prov-01", name: "Tariq Mehmood", category: "ac", city: "isb", area: "Sector G-13", rating: 4.9, jobsCompleted: 142, priceLabel: "from PKR 2,500", verified: true, active: true },
  { id: "prov-02", name: "Imran Baig", category: "ac", city: "khi", area: "Gulshan-e-Iqbal", rating: 4.8, jobsCompleted: 185, priceLabel: "from PKR 2,500", verified: true, active: true },
  { id: "prov-03", name: "Kashif Siddiqui", category: "electrician", city: "khi", area: "Gulshan-e-Iqbal", rating: 4.7, jobsCompleted: 210, priceLabel: "from PKR 2,000", verified: true, active: true },
  { id: "prov-04", name: "Naveed Akhtar", category: "electrician", city: "isb", area: "Sector G-13", rating: 4.8, jobsCompleted: 110, priceLabel: "from PKR 1,800", verified: true, active: true },
  { id: "prov-05", name: "Arshad Hussain", category: "plumber", city: "khi", area: "Gulistan-e-Johar", rating: 4.7, jobsCompleted: 98, priceLabel: "from PKR 1,500", verified: true, active: true },
  { id: "prov-06", name: "Rafiq Masih", category: "plumber", city: "isb", area: "Sector F-10", rating: 4.6, jobsCompleted: 75, priceLabel: "from PKR 1,500", verified: true, active: true },
  { id: "prov-07", name: "Bushra Cleaning Co.", category: "cleaner", city: "khi", area: "North Nazimabad", rating: 4.9, jobsCompleted: 310, priceLabel: "from PKR 3,500", verified: true, active: true },
  { id: "prov-08", name: "Capital Deep Clean", category: "cleaner", city: "isb", area: "Sector F-10", rating: 4.9, jobsCompleted: 215, priceLabel: "from PKR 3,500", verified: true, active: true },
  { id: "prov-09", name: "Dr. Usman Farooq", category: "tutor", city: "lhe", area: "Johar Town", rating: 5.0, jobsCompleted: 89, priceLabel: "from PKR 15,000 / mo", verified: true, active: true },
  { id: "prov-10", name: "Sana Tutors", category: "tutor", city: "khi", area: "Clifton", rating: 4.8, jobsCompleted: 64, priceLabel: "from PKR 12,000 / mo", verified: true, active: false },
];

const TIMES = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM", "06:00 PM"];

/** 3 upcoming dates x 5 times per provider; deterministic ids. */
export const providerSlots: ProviderSlot[] = providers.flatMap((p) =>
  [0, 1, 2].flatMap((d) =>
    TIMES.map((time, ti) => ({
      id: `slot-${p.id}-${d}-${ti}`,
      providerId: p.id,
      date: `2026-09-${String(11 + d).padStart(2, "0")}`,
      time,
      booked: false,
    })),
  ),
);
```

- [ ] **Step 6: Create `admin-web/lib/fixtures/bookings.ts`**

```ts
import type { Booking } from "@/lib/contracts";
import { personas } from "./personas";

export const bookings: Booking[] = [
  { id: "bk-01", token: "BK-4821", customerId: personas.customer.id, providerId: "prov-02", slotId: "slot-prov-02-0-2", status: "en_route", pricePkr: 2800, createdAt: "2026-09-10T08:30:00Z" },
  { id: "bk-02", token: "BK-4790", customerId: personas.customer.id, providerId: "prov-03", slotId: "slot-prov-03-0-0", status: "confirmed", pricePkr: 2000, createdAt: "2026-09-10T07:15:00Z" },
  { id: "bk-03", token: "BK-4655", customerId: personas.customer.id, providerId: "prov-07", slotId: "slot-prov-07-1-3", status: "arrived", pricePkr: 3500, createdAt: "2026-09-09T14:00:00Z" },
  { id: "bk-04", token: "BK-4501", customerId: personas.customer.id, providerId: "prov-05", slotId: "slot-prov-05-2-1", status: "completed", pricePkr: 1600, createdAt: "2026-09-05T10:00:00Z" },
  { id: "bk-05", token: "BK-4410", customerId: personas.customer.id, providerId: "prov-10", slotId: "slot-prov-10-1-4", status: "cancelled", pricePkr: 12000, createdAt: "2026-09-03T09:00:00Z" },
];
```

- [ ] **Step 7: Create `admin-web/lib/fixtures/sessions.ts`**

```ts
import type { AgentSession } from "@/lib/contracts";
import { personas } from "./personas";

const cid = personas.customer.id;

export const sessions: AgentSession[] = [
  {
    id: "sess-01",
    customerId: cid,
    rawInput: "Mujhe kal subah Gulshan mein AC technician chahiye, cooling nahi kar raha",
    language: "roman_ur",
    status: "completed",
    startedAt: "2026-09-10T08:29:40Z",
    intent: { serviceType: "ac", area: "Gulshan-e-Iqbal", timePreference: "Tomorrow morning", urgency: "high", language: "roman_ur" },
    events: [
      { kind: "agent_started", sessionId: "sess-01", step: 1, agentName: "IntentAgent", summary: "Reading the request", payload: {}, timestamp: "2026-09-10T08:29:41Z" },
      { kind: "tool_call_started", sessionId: "sess-01", step: 1, agentName: "IntentAgent", toolName: "extract_intent", summary: "Extracting service, area, time", payload: { raw: "…" }, timestamp: "2026-09-10T08:29:41Z" },
      { kind: "tool_call_result", sessionId: "sess-01", step: 1, agentName: "IntentAgent", toolName: "extract_intent", summary: "AC Technician · Gulshan-e-Iqbal · tomorrow morning · high urgency", payload: { serviceType: "ac" }, timestamp: "2026-09-10T08:29:42Z", durationMs: 640 },
      { kind: "tool_call_started", sessionId: "sess-01", step: 2, agentName: "DiscoveryAgent", toolName: "find_providers", summary: "Searching Gulshan-e-Iqbal for AC technicians", payload: { area: "Gulshan-e-Iqbal" }, timestamp: "2026-09-10T08:29:42Z" },
      { kind: "info_found", sessionId: "sess-01", step: 2, agentName: "DiscoveryAgent", summary: "3 verified technicians available tomorrow morning", payload: { count: 3 }, timestamp: "2026-09-10T08:29:43Z", durationMs: 410 },
      { kind: "question_required", sessionId: "sess-01", step: 3, agentName: "RankingAgent", question: "Two technicians can come at 9 AM. Do you prefer the highest-rated (Imran Baig, 4.8) or the nearest (2 km away)?", summary: "Needs a preference before ranking", payload: {}, timestamp: "2026-09-10T08:29:44Z" },
      { kind: "approval_required", sessionId: "sess-01", step: 4, agentName: "BookingAgent", action: "Book Imran Baig for tomorrow 9:00 AM at PKR 2,800", summary: "Waiting for confirmation before booking", payload: { providerId: "prov-02", pricePkr: 2800 }, timestamp: "2026-09-10T08:29:58Z" },
      { kind: "tool_call_result", sessionId: "sess-01", step: 4, agentName: "BookingAgent", toolName: "create_booking", summary: "Booked · token BK-4821", payload: { token: "BK-4821" }, timestamp: "2026-09-10T08:30:02Z", durationMs: 520 },
      { kind: "agent_completed", sessionId: "sess-01", step: 5, agentName: "FollowupAgent", summary: "Reminder scheduled for 8:00 AM tomorrow", payload: {}, timestamp: "2026-09-10T08:30:03Z" },
    ],
  },
  {
    id: "sess-02",
    customerId: cid,
    rawInput: "F-10 mein pipe leak ho raha hai, abhi chahiye",
    language: "roman_ur",
    status: "failed",
    startedAt: "2026-09-09T21:10:00Z",
    intent: { serviceType: "plumber", area: "Sector F-10", timePreference: "Now", urgency: "high", language: "roman_ur" },
    events: [
      { kind: "agent_started", sessionId: "sess-02", step: 1, agentName: "IntentAgent", summary: "Reading the request", payload: {}, timestamp: "2026-09-09T21:10:01Z" },
      { kind: "tool_call_result", sessionId: "sess-02", step: 1, agentName: "IntentAgent", toolName: "extract_intent", summary: "Plumber · Sector F-10 · now · high urgency", payload: {}, timestamp: "2026-09-09T21:10:02Z", durationMs: 590 },
      { kind: "info_found", sessionId: "sess-02", step: 2, agentName: "DiscoveryAgent", summary: "No plumbers available in F-10 after 9 PM", payload: { count: 0 }, timestamp: "2026-09-09T21:10:03Z", durationMs: 380 },
      { kind: "error", sessionId: "sess-02", step: 2, agentName: "DiscoveryAgent", errorCode: "no_providers", summary: "No providers available — suggested trying again at 7 AM", payload: {}, timestamp: "2026-09-09T21:10:03Z" },
    ],
  },
];
```

- [ ] **Step 8: Create `admin-web/lib/fixtures/index.ts`**

```ts
export { personas, personaList } from "./personas";
export { cities, cityById } from "./cities";
export { providers, providerSlots } from "./providers";
export { bookings } from "./bookings";
export { sessions } from "./sessions";

import { personas } from "./personas";
import { cities } from "./cities";
import { providers, providerSlots } from "./providers";
import { bookings } from "./bookings";
import { sessions } from "./sessions";

/** Single accessor so later phases swap this import for a fetch with one edit per call site. */
export function getFixtures() {
  return { personas, cities, providers, providerSlots, bookings, sessions };
}
```

- [ ] **Step 9: Run the test — verify it passes**

Run: `cd admin-web && npm run test -- fixtures`
Expected: PASS (7 tests).

- [ ] **Step 10: Repoint `admin-web/lib/api.ts` interfaces**

At the top of `lib/api.ts`, replace the locally-declared `AdminStats`, `TraceLog`, `SessionItem`, `BookingItem`, `ProviderItem` interfaces with:

```ts
import type { Booking, Provider, AgentSession, AgentEvent } from "@/lib/contracts";

// Transitional aliases kept so existing feature pages still compile until their phase.
export type BookingItem = Booking;
export type ProviderItem = Provider;
export type SessionItem = AgentSession;
export type TraceLog = AgentEvent;
export interface AdminStats {
  total_sessions: number;
  total_bookings: number;
  active_providers: number;
  total_trace_logs: number;
  recent_sessions: unknown[];
}
```

Leave the `fetch` functions in `lib/api.ts` unchanged in behaviour. If a feature page references a removed property name, that page is out of scope — do the minimal cast (`as any`) at that call site with a `// TODO(phase-N)` comment; do not restyle or refactor the page.

- [ ] **Step 11: Repoint `admin-web/lib/auth-context.tsx`**

Replace the inline `PRESET_USERS` object with a re-shape of the fixtures (keep the file's existing exported type so importers still compile):

```ts
import { personas } from "@/lib/fixtures/personas";

export const PRESET_USERS = {
  admin: { id: personas.admin.id, name: personas.admin.name, email: personas.admin.email, role: "admin", phone: personas.admin.phone, area: personas.admin.area, avatar: personas.admin.avatarInitials },
  provider: { id: personas.provider.id, name: personas.provider.name, email: personas.provider.email, role: "provider", phone: personas.provider.phone, area: personas.provider.area, category: "AC Technician & HVAC", rating: 4.9, completedJobs: 142, avatar: personas.provider.avatarInitials },
  customer: { id: personas.customer.id, name: personas.customer.name, email: personas.customer.email, role: "customer", phone: personas.customer.phone, area: personas.customer.area, avatar: personas.customer.avatarInitials },
} as const;
```

Keep the rest of `auth-context.tsx` untouched (it is retired in Phase 1).

- [ ] **Step 12: Trim `backend/app/db/seed.py`**

Replace the `users` list with the 3 personas (admin `Ayesha Malik`, provider `Tariq Mehmood`, customer `Zubair Khan`) and the `providers` list with the 10 roster entries from `providers.ts` — same names, cities, categories, ratings, `jobs_completed`, `price_range` (`"PKR 2500"` style). Keep the slot-generation loop (7 days × the 5 times) and the `id` UUIDs may be regenerated deterministically or left as `uuid.uuid4()`. Category strings map: `ac`→`"AC Technician"`, `plumber`→`"Plumber"`, `electrician`→`"Electrician"`, `cleaner`→`"Cleaner"`, `tutor`→`"Tutor"`. Do not change the schema, the `Base.metadata.create_all` call, or the upsert logic.

- [ ] **Step 13: Verify**

Run: `cd admin-web && npm run test && npx tsc --noEmit`
Expected: all tests pass; `tsc` shows only the two known missing-module errors from `layout.tsx`.

- [ ] **Step 14: Commit**

```bash
git add admin-web/lib/fixtures admin-web/lib/api.ts admin-web/lib/auth-context.tsx backend/app/db/seed.py
git commit -m "feat: single fixtures source of truth; align backend seed; fix identity drift"
```

---

## Task 6: Motion setup

**Files:**
- Create: `admin-web/lib/motion/gsap.ts`, `admin-web/lib/motion/variants.ts`, `admin-web/lib/motion/variants.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `getGsap()` → returns the `gsap` instance with `ScrollTrigger` + `SplitText` registered exactly once; safe to call in any client component.
  - `prefersReducedMotion()` → `boolean`.
  - `variants` — `{ fade, staggerList, listItem, routeTransition }` framer-motion `Variants` objects.

- [ ] **Step 1: Write the failing test — `admin-web/lib/motion/variants.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { variants } from "./variants";

describe("motion variants", () => {
  it("exposes the approved set and nothing implying looping activity", () => {
    expect(Object.keys(variants).sort()).toEqual(["fade", "listItem", "routeTransition", "staggerList"]);
  });

  it("no variant uses infinite repeat", () => {
    const json = JSON.stringify(variants);
    expect(json).not.toMatch(/"repeat"\s*:\s*(-1|Infinity)/);
    expect(json).not.toContain("repeatType");
  });

  it("durations are within the token envelope (<= 0.26s)", () => {
    const nums = [...JSON.stringify(variants).matchAll(/"duration"\s*:\s*([\d.]+)/g)].map((m) => Number(m[1]));
    expect(nums.length).toBeGreaterThan(0);
    for (const n of nums) expect(n).toBeLessThanOrEqual(0.26);
  });
});
```

- [ ] **Step 2: Run it — verify it fails**

Run: `cd admin-web && npm run test -- motion`
Expected: FAIL — `Cannot find module './variants'`.

- [ ] **Step 3: Create `admin-web/lib/motion/variants.ts`**

```ts
import type { Variants } from "framer-motion";

/**
 * The only framer-motion variants used on application surfaces.
 * Ad-hoc `animate`/`transition` props elsewhere are a review failure.
 * Nothing here loops or implies ongoing activity.
 */
export const variants = {
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.18 } },
  },
  staggerList: {
    hidden: {},
    show: { transition: { staggerChildren: 0.04 } },
  },
  listItem: {
    hidden: { opacity: 0, y: 4 },
    show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
    exit: { opacity: 0, transition: { duration: 0.12 } },
  },
  routeTransition: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.18 } },
    exit: { opacity: 0, transition: { duration: 0.12 } },
  },
} satisfies Record<string, Variants>;
```

- [ ] **Step 4: Create `admin-web/lib/motion/gsap.ts`**

```ts
"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let registered = false;

/** Returns the shared gsap instance with plugins registered once. Marketing surfaces only. */
export function getGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    registered = true;
  }
  return gsap;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
```

- [ ] **Step 5: Run the test — verify it passes**

Run: `cd admin-web && npm run test -- motion`
Expected: PASS (3 tests).

- [ ] **Step 6: Typecheck**

Run: `cd admin-web && npx tsc --noEmit`
Expected: only the two known `layout.tsx` errors. If `gsap/SplitText` types are missing, add `// @ts-expect-error - SplitText ships types under gsap-trial only in some versions` above the import **only if** `tsc` actually errors; GSAP 3.13 from npm includes `SplitText`.

- [ ] **Step 7: Commit**

```bash
git add admin-web/lib/motion
git commit -m "feat(admin-web): GSAP registration boundary and approved framer variants"
```

---

## Task 7: shadcn/ui primitives — generate and restyle to tokens

**Files:**
- Modify: `admin-web/components.json`
- Create/overwrite: `admin-web/components/ui/*.tsx` (generated), then restyled
- Create: `admin-web/tests/ui-tokens.test.ts`
- Delete: `admin-web/components/ui/{badge,button,card,table,MagneticButton,SpotlightCard,Toaster}.tsx`

**Interfaces:**
- Consumes: token classes from Task 2.
- Produces: token-styled shadcn components importable from `@/components/ui/<name>` — at minimum `button`, `input`, `textarea`, `label`, `select`, `checkbox`, `switch`, `dialog`, `sheet`, `dropdown-menu`, `popover`, `tooltip`, `tabs`, `table`, `badge`, `card`, `skeleton`, `scroll-area`, `avatar`, `separator`, `command`, `sonner`.

- [ ] **Step 1: Confirm `components.json`**

Ensure it reads (adjust only if different):

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": { "config": "tailwind.config.ts", "css": "app/globals.css", "baseColor": "neutral", "cssVariables": true, "prefix": "" },
  "aliases": { "components": "@/components", "utils": "@/lib/utils", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks" }
}
```

- [ ] **Step 2: Delete the hand-rolled components**

```bash
cd admin-web
git rm components/ui/badge.tsx components/ui/button.tsx components/ui/card.tsx components/ui/table.tsx components/ui/MagneticButton.tsx components/ui/SpotlightCard.tsx components/ui/Toaster.tsx
```

- [ ] **Step 3: Generate the components**

```bash
cd admin-web
npx shadcn@latest add button input textarea label select checkbox switch dialog sheet dropdown-menu popover tooltip tabs table badge card skeleton scroll-area avatar separator command sonner --yes --overwrite
```

If the CLI attempts to patch `app/globals.css` or `tailwind.config.ts`, discard those patches (`git checkout -- app/globals.css tailwind.config.ts`) — the token layer from Task 2 already provides every variable shadcn needs.

- [ ] **Step 4: Restyle pass — remove non-token values**

In every generated `components/ui/*.tsx`:
- Replace any `rounded-md`/`rounded-lg`/`rounded-xl` with `rounded-md` (max `rounded-lg` for `dialog`/`sheet`/`popover` content).
- Replace `bg-background`/`text-foreground`/`border-input`/`bg-muted`/`text-muted-foreground`/`bg-primary`/`ring-ring` etc. — these already resolve via the aliases, so **leave them**. Only change literal colours: search each file for `#`, `slate-`, `zinc-`, `neutral-`, `gray-` and replace with the nearest token class (`bg-surface`, `text-ink`, `text-ink-muted`, `border-hairline`, `bg-surface-sunken`).
- In `button.tsx`: the default variant stays `bg-primary text-primary-foreground hover:bg-accent-hover`; add `focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-surface`. Remove any `shadow-lg`/glow.
- In `card.tsx`: `rounded-lg border border-hairline bg-card text-card-foreground shadow-raised`.
- In `badge.tsx`: variants use `bg-surface-sunken text-ink` (default), `bg-accent-tint text-accent` (accent), `border border-hairline` (outline). No colour literals.
- In `sonner.tsx`: set `theme="light"`, `toastOptions` classNames using `bg-surface-raised text-ink border border-hairline`.

- [ ] **Step 5: Write `admin-web/tests/ui-tokens.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const dir = resolve(__dirname, "../components/ui");
const files = readdirSync(dir).filter((f) => f.endsWith(".tsx"));

describe("ui primitives use tokens only", () => {
  it("has generated the expected component set", () => {
    for (const name of ["button", "card", "badge", "dialog", "table", "sonner", "tooltip", "tabs", "select"]) {
      expect(files, `missing ${name}.tsx`).toContain(`${name}.tsx`);
    }
  });

  it.each(files)("%s contains no colour literals or non-token palette classes", (file) => {
    const src = readFileSync(resolve(dir, file), "utf8");
    expect(src, "hex colour literal").not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(src, "tailwind default palette class").not.toMatch(/\b(slate|zinc|neutral|gray|stone)-\d{2,3}\b/);
    expect(src, "glow shadow").not.toMatch(/shadow-\[0_0_\d+px/);
  });
});
```

- [ ] **Step 6: Run the test**

Run: `cd admin-web && npm run test -- ui-tokens`
Expected: PASS. Fix any file the `it.each` flags by swapping the literal for a token class.

- [ ] **Step 7: Build**

Run: `cd admin-web && npx tsc --noEmit && npm run build`
Expected: `tsc` clean **except** `layout.tsx` still missing `@/components/layout/app-shell` (Task 11). `npm run build` fails only on that missing module. Record and proceed.

- [ ] **Step 8: Commit**

```bash
git add -A admin-web/components/ui admin-web/components.json admin-web/tests/ui-tokens.test.ts
git commit -m "feat(admin-web): adopt shadcn/ui primitives, restyled to design tokens"
```

---

## Task 8: Logic-bearing primitives — `status-badge`, `stat-tile`, `stat-row`

**Files:**
- Create: `admin-web/components/primitives/{status-badge,stat-tile,stat-row}.tsx` and matching `.test.tsx`

**Interfaces:**
- Consumes: `BookingStatus`, `BOOKING_STATUS_LABEL` from `@/lib/contracts`; `@/components/ui/badge`, `@/components/ui/skeleton`.
- Produces:
  - `<StatusBadge status={string} />` — maps `BookingStatus` (+ `"online"|"busy"|"offline"|"verified"|"unverified"`) to a `--status-*` colour + label; unknown → neutral badge with the raw string.
  - `<StatTile label value unit? delta? state? />` where `state?: "ready" | "loading" | "no-data"` (default `"ready"`).
  - `<StatRow>` — wraps 2–4 `<StatTile>`; throws in dev if `Children.count > 4`.

- [ ] **Step 1: Write `admin-web/components/primitives/status-badge.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("renders a known booking status with its label", () => {
    render(<StatusBadge status="en_route" />);
    expect(screen.getByText("En route")).toBeInTheDocument();
  });

  it("renders an availability status", () => {
    render(<StatusBadge status="online" />);
    expect(screen.getByText("Online")).toBeInTheDocument();
  });

  it("falls back to a neutral badge with the raw value for unknown status", () => {
    render(<StatusBadge status="teleporting" />);
    expect(screen.getByText("teleporting")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it — verify it fails**

Run: `cd admin-web && npm run test -- status-badge`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `admin-web/components/primitives/status-badge.tsx`**

```tsx
import { Badge } from "@/components/ui/badge";
import { BOOKING_STATUS_LABEL, type BookingStatus } from "@/lib/contracts";
import { cn } from "@/lib/utils";

type Extra = "online" | "busy" | "offline" | "verified" | "unverified";

const MAP: Record<string, { label: string; className: string }> = {
  ...Object.fromEntries(
    (Object.keys(BOOKING_STATUS_LABEL) as BookingStatus[]).map((s) => [
      s,
      {
        label: BOOKING_STATUS_LABEL[s],
        className:
          s === "en_route" || s === "arrived"
            ? "text-[var(--status-live)] border-[var(--status-live)]/30 bg-[var(--status-live)]/10"
            : s === "completed"
              ? "text-[var(--status-go)] border-[var(--status-go)]/30 bg-[var(--status-go)]/10"
              : s === "cancelled"
                ? "text-[var(--status-stop)] border-[var(--status-stop)]/30 bg-[var(--status-stop)]/10"
                : "text-ink-muted border-hairline bg-surface-sunken",
      },
    ]),
  ),
  online: { label: "Online", className: "text-[var(--status-go)] border-[var(--status-go)]/30 bg-[var(--status-go)]/10" },
  busy: { label: "In field", className: "text-[var(--status-warn)] border-[var(--status-warn)]/30 bg-[var(--status-warn)]/10" },
  offline: { label: "Offline", className: "text-ink-muted border-hairline bg-surface-sunken" },
  verified: { label: "Verified", className: "text-[var(--status-info)] border-[var(--status-info)]/30 bg-[var(--status-info)]/10" },
  unverified: { label: "Unverified", className: "text-ink-muted border-hairline bg-surface-sunken" },
};

export function StatusBadge({ status, className }: { status: BookingStatus | Extra | string; className?: string }) {
  const entry = MAP[status] ?? { label: status, className: "text-ink-muted border-hairline bg-surface-sunken" };
  return (
    <Badge variant="outline" className={cn("rounded-pill border px-2 py-0.5 text-xs font-medium", entry.className, className)}>
      {entry.label}
    </Badge>
  );
}
```

- [ ] **Step 4: Run it — verify it passes**

Run: `cd admin-web && npm run test -- status-badge`
Expected: PASS.

- [ ] **Step 5: Write `admin-web/components/primitives/stat-tile.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatTile } from "./stat-tile";

describe("StatTile", () => {
  it("renders value and label", () => {
    render(<StatTile label="Bookings today" value={12} />);
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Bookings today")).toBeInTheDocument();
  });

  it("renders an em dash and 'no data yet' when state is no-data, never a number", () => {
    render(<StatTile label="GMV" value={0} state="no-data" />);
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByText(/no data yet/i)).toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("renders a skeleton and no value when loading", () => {
    render(<StatTile label="GMV" value={999} state="loading" />);
    expect(screen.queryByText("999")).not.toBeInTheDocument();
    expect(screen.getByTestId("stat-tile-skeleton")).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run it — verify it fails, then create `admin-web/components/primitives/stat-tile.tsx`**

```tsx
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface StatTileProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: { value: string; direction: "up" | "down" | "flat" };
  state?: "ready" | "loading" | "no-data";
  className?: string;
}

export function StatTile({ label, value, unit, delta, state = "ready", className }: StatTileProps) {
  return (
    <div className={cn("rounded-md border border-hairline bg-surface-raised p-4", className)}>
      <p className="text-xs text-ink-muted">{label}</p>
      {state === "loading" ? (
        <Skeleton data-testid="stat-tile-skeleton" className="mt-2 h-7 w-20" />
      ) : state === "no-data" ? (
        <div className="mt-1">
          <span className="font-display text-2xl text-ink-muted">—</span>
          <span className="ml-2 text-xs text-ink-muted">no data yet</span>
        </div>
      ) : (
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="font-display text-2xl text-ink">{value}</span>
          {unit ? <span className="text-xs text-ink-muted">{unit}</span> : null}
          {delta ? (
            <span
              className={cn(
                "ml-1 font-mono text-xs",
                delta.direction === "up" && "text-[var(--status-go)]",
                delta.direction === "down" && "text-[var(--status-stop)]",
                delta.direction === "flat" && "text-ink-muted",
              )}
            >
              {delta.value}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
```

Run: `cd admin-web && npm run test -- stat-tile` → PASS.

- [ ] **Step 7: Write `admin-web/components/primitives/stat-row.test.tsx`**

```tsx
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { StatRow } from "./stat-row";
import { StatTile } from "./stat-tile";

describe("StatRow", () => {
  it("renders 2-4 tiles", () => {
    const { container } = render(
      <StatRow>
        <StatTile label="a" value={1} />
        <StatTile label="b" value={2} />
      </StatRow>,
    );
    expect(container.querySelectorAll("div.rounded-md").length).toBeGreaterThanOrEqual(2);
  });

  it("throws when given more than 4 tiles", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <StatRow>
          {Array.from({ length: 5 }, (_, i) => (
            <StatTile key={i} label={`x${i}`} value={i} />
          ))}
        </StatRow>,
      ),
    ).toThrow(/StatRow accepts at most 4/);
    spy.mockRestore();
  });
});
```

- [ ] **Step 8: Create `admin-web/components/primitives/stat-row.tsx`**

```tsx
import { Children } from "react";
import { cn } from "@/lib/utils";

export function StatRow({ children, className }: { children: React.ReactNode; className?: string }) {
  const count = Children.count(children);
  if (count > 4) throw new Error(`StatRow accepts at most 4 tiles, got ${count}`);
  return (
    <div className={cn("grid gap-3", count <= 2 ? "sm:grid-cols-2" : count === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4", className)}>
      {children}
    </div>
  );
}
```

Run: `cd admin-web && npm run test -- stat-row` → PASS.

- [ ] **Step 9: Commit**

```bash
git add admin-web/components/primitives/status-badge.tsx admin-web/components/primitives/stat-tile.tsx admin-web/components/primitives/stat-row.tsx admin-web/components/primitives/*.test.tsx
git commit -m "feat(admin-web): StatusBadge, StatTile (honest no-data), StatRow primitives"
```

---

## Task 9: Presentational primitives — `page-header`, `empty-state`, `data-table`

**Files:**
- Create: `admin-web/components/primitives/{page-header,empty-state,data-table}.tsx`, `admin-web/components/primitives/data-table.test.tsx`

**Interfaces:**
- Consumes: `@/components/ui/{table,skeleton,scroll-area}`.
- Produces:
  - `<PageHeader title description? actions? />` — plain: title (`font-display text-xl`), optional one-line description, optional right-aligned actions slot. No eyebrow, no blurb paragraph, no decoration.
  - `<EmptyState title description? action? icon? />`.
  - `<DataTable columns rows state? renderRow getRowKey />` where `state?: "ready" | "loading" | "empty"`; `columns: { key: string; header: string; align?: "left" | "right" }[]`. `loading` → 5 skeleton rows; `empty` → `<EmptyState>` inside the table body.

- [ ] **Step 1: Write `admin-web/components/primitives/data-table.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataTable } from "./data-table";

const columns = [
  { key: "name", header: "Name" },
  { key: "n", header: "Jobs", align: "right" as const },
];

describe("DataTable", () => {
  it("renders rows in ready state", () => {
    render(
      <DataTable
        columns={columns}
        rows={[{ id: "1", name: "Tariq", n: 142 }]}
        getRowKey={(r) => r.id}
        renderRow={(r) => [<span key="a">{r.name}</span>, <span key="b">{r.n}</span>]}
      />,
    );
    expect(screen.getByText("Tariq")).toBeInTheDocument();
    expect(screen.getByText("142")).toBeInTheDocument();
  });

  it("shows the empty state when state is empty", () => {
    render(
      <DataTable
        columns={columns}
        rows={[]}
        state="empty"
        emptyTitle="No providers"
        getRowKey={(r: { id: string }) => r.id}
        renderRow={() => []}
      />,
    );
    expect(screen.getByText("No providers")).toBeInTheDocument();
  });

  it("renders skeleton rows when loading and no data text", () => {
    render(
      <DataTable
        columns={columns}
        rows={[]}
        state="loading"
        getRowKey={(r: { id: string }) => r.id}
        renderRow={() => []}
      />,
    );
    expect(screen.getAllByTestId("data-table-skeleton-row").length).toBe(5);
  });
});
```

- [ ] **Step 2: Run it — verify it fails**

Run: `cd admin-web && npm run test -- data-table`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `admin-web/components/primitives/empty-state.tsx`**

```tsx
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-hairline bg-surface-sunken px-6 py-12 text-center", className)}>
      <p className="font-display text-lg text-ink">{title}</p>
      {description ? <p className="max-w-sm text-sm text-ink-muted">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
```

- [ ] **Step 4: Create `admin-web/components/primitives/page-header.tsx`**

```tsx
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-wrap items-start justify-between gap-4 border-b border-hairline pb-5", className)}>
      <div>
        <h1 className="font-display text-xl text-ink">{title}</h1>
        {description ? <p className="mt-1 text-sm text-ink-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
```

- [ ] **Step 5: Create `admin-web/components/primitives/data-table.tsx`**

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "./empty-state";
import { cn } from "@/lib/utils";

export interface Column {
  key: string;
  header: string;
  align?: "left" | "right";
}

export interface DataTableProps<Row> {
  columns: Column[];
  rows: Row[];
  getRowKey: (row: Row) => string;
  renderRow: (row: Row) => React.ReactNode[];
  state?: "ready" | "loading" | "empty";
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<Row>({
  columns,
  rows,
  getRowKey,
  renderRow,
  state = "ready",
  emptyTitle = "Nothing here yet",
  emptyDescription,
}: DataTableProps<Row>) {
  return (
    <ScrollArea className="w-full rounded-md border border-hairline bg-surface-raised">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.key} className={cn("text-xs text-ink-muted", c.align === "right" && "text-right")}>
                {c.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {state === "loading" ? (
            Array.from({ length: 5 }, (_, i) => (
              <TableRow key={i} data-testid="data-table-skeleton-row">
                {columns.map((c) => (
                  <TableCell key={c.key}><Skeleton className="h-4 w-24" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : state === "empty" || rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="p-0">
                <EmptyState title={emptyTitle} description={emptyDescription} className="border-0" />
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const cells = renderRow(row);
              return (
                <TableRow key={getRowKey(row)}>
                  {columns.map((c, i) => (
                    <TableCell key={c.key} className={cn(c.align === "right" && "text-right font-mono")}>
                      {cells[i]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
```

- [ ] **Step 6: Run the test — verify it passes**

Run: `cd admin-web && npm run test -- data-table`
Expected: PASS (3 tests).

- [ ] **Step 7: Commit**

```bash
git add admin-web/components/primitives/page-header.tsx admin-web/components/primitives/empty-state.tsx admin-web/components/primitives/data-table.tsx admin-web/components/primitives/data-table.test.tsx
git commit -m "feat(admin-web): PageHeader, EmptyState, DataTable primitives"
```

---

## Task 10: Agent-activity primitives — `timeline`, `tool-call-chip`, `agent-event-item`

**Files:**
- Create: `admin-web/components/primitives/{timeline,tool-call-chip,agent-event-item}.tsx`, `admin-web/components/primitives/agent-event-item.test.tsx`

**Interfaces:**
- Consumes: `AgentEvent` from `@/lib/contracts`; `@/components/ui/{badge,button}`.
- Produces:
  - `<ToolCallChip name status />` where `status: "running" | "ok" | "error"` — inline pill, tool name in `font-mono`, a status dot. `running` uses `--status-live`.
  - `<Timeline items />` where `items: { id: string; title: string; meta?: string; state: "pending" | "active" | "done" | "error" }[]` — ordered vertical steps with a connector. Pure; state comes only from props.
  - `<AgentEventItem event onAnswer? onApprove? onReject? />` — renders one `AgentEvent`. `kind: "question_required"` shows `event.question` + (if `onAnswer`) an input; `kind: "approval_required"` shows `event.action` + (if `onApprove`) Approve / Reject buttons; `tool_call_*` renders a `ToolCallChip`; `running`-ish states (`agent_started`, `tool_call_started`) use `--status-live`. **No timers, no intervals, no effects.**

- [ ] **Step 1: Write `admin-web/components/primitives/agent-event-item.test.tsx`**

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AgentEventItem } from "./agent-event-item";
import type { AgentEvent } from "@/lib/contracts";

const at = "2026-09-10T10:00:00Z";

describe("AgentEventItem", () => {
  it("shows the tool name for a tool call", () => {
    const e: AgentEvent = { kind: "tool_call_started", sessionId: "s", step: 2, agentName: "DiscoveryAgent", toolName: "find_providers", summary: "Searching", payload: {}, timestamp: at };
    render(<AgentEventItem event={e} />);
    expect(screen.getByText("find_providers")).toBeInTheDocument();
  });

  it("renders the question and an answer field when onAnswer is provided", () => {
    const e: AgentEvent = { kind: "question_required", sessionId: "s", step: 3, agentName: "RankingAgent", question: "Nearest or highest-rated?", summary: "needs input", payload: {}, timestamp: at };
    render(<AgentEventItem event={e} onAnswer={vi.fn()} />);
    expect(screen.getByText("Nearest or highest-rated?")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders Approve and Reject for approval_required when handlers are provided", () => {
    const e: AgentEvent = { kind: "approval_required", sessionId: "s", step: 4, agentName: "BookingAgent", action: "Book Imran Baig at PKR 2,800", summary: "confirm", payload: {}, timestamp: at };
    render(<AgentEventItem event={e} onApprove={vi.fn()} onReject={vi.fn()} />);
    expect(screen.getByRole("button", { name: /approve/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reject/i })).toBeInTheDocument();
  });

  it("does not mutate its own DOM over time (no self-driving activity)", () => {
    vi.useFakeTimers();
    const e: AgentEvent = { kind: "agent_started", sessionId: "s", step: 1, agentName: "IntentAgent", summary: "Reading the request", payload: {}, timestamp: at };
    const { container } = render(<AgentEventItem event={e} />);
    const before = container.innerHTML;
    act(() => vi.advanceTimersByTime(10_000));
    expect(container.innerHTML).toBe(before);
    vi.useRealTimers();
  });
});
```

- [ ] **Step 2: Run it — verify it fails**

Run: `cd admin-web && npm run test -- agent-event-item`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `admin-web/components/primitives/tool-call-chip.tsx`**

```tsx
import { cn } from "@/lib/utils";

export function ToolCallChip({ name, status }: { name: string; status: "running" | "ok" | "error" }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill border border-hairline bg-surface-sunken px-2 py-0.5 text-xs">
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "running" && "bg-[var(--status-live)]",
          status === "ok" && "bg-[var(--status-go)]",
          status === "error" && "bg-[var(--status-stop)]",
        )}
      />
      <code className="font-mono text-ink">{name}</code>
    </span>
  );
}
```

- [ ] **Step 4: Create `admin-web/components/primitives/timeline.tsx`**

```tsx
import { cn } from "@/lib/utils";

export interface TimelineItem {
  id: string;
  title: string;
  meta?: string;
  state: "pending" | "active" | "done" | "error";
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative ml-3 border-l border-hairline">
      {items.map((it) => (
        <li key={it.id} className="mb-4 ml-4 last:mb-0">
          <span
            className={cn(
              "absolute -left-[5px] mt-1 h-2.5 w-2.5 rounded-full border",
              it.state === "active" && "border-[var(--status-live)] bg-[var(--status-live)]",
              it.state === "done" && "border-[var(--status-go)] bg-[var(--status-go)]",
              it.state === "error" && "border-[var(--status-stop)] bg-[var(--status-stop)]",
              it.state === "pending" && "border-hairline bg-surface",
            )}
          />
          <p className={cn("text-sm", it.state === "pending" ? "text-ink-muted" : "text-ink")}>{it.title}</p>
          {it.meta ? <p className="font-mono text-xs text-ink-muted">{it.meta}</p> : null}
        </li>
      ))}
    </ol>
  );
}
```

- [ ] **Step 5: Create `admin-web/components/primitives/agent-event-item.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { AgentEvent } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { ToolCallChip } from "./tool-call-chip";
import { cn } from "@/lib/utils";

export interface AgentEventItemProps {
  event: AgentEvent;
  onAnswer?: (text: string) => void;
  onApprove?: () => void;
  onReject?: () => void;
}

const LIVE_KINDS = new Set<AgentEvent["kind"]>(["agent_started", "tool_call_started"]);

export function AgentEventItem({ event, onAnswer, onApprove, onReject }: AgentEventItemProps) {
  const [answer, setAnswer] = useState("");
  const live = LIVE_KINDS.has(event.kind);

  return (
    <div className="rounded-md border border-hairline bg-surface-raised p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={cn("h-1.5 w-1.5 rounded-full", live ? "bg-[var(--status-live)]" : event.kind === "error" ? "bg-[var(--status-stop)]" : "bg-[var(--status-go)]")}
          />
          <span className="font-mono text-xs text-ink-muted">{event.agentName}</span>
        </div>
        {"toolName" in event && event.toolName ? (
          <ToolCallChip name={event.toolName} status={event.kind === "tool_call_result" ? "ok" : "running"} />
        ) : null}
      </div>

      <p className="mt-1.5 text-sm text-ink">{event.summary}</p>

      {event.kind === "question_required" ? (
        <div className="mt-2 space-y-2">
          <p className="text-sm text-ink">{event.question}</p>
          {onAnswer ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (answer.trim()) onAnswer(answer.trim());
              }}
              className="flex gap-2"
            >
              <input
                className="flex-1 rounded-md border border-hairline bg-surface px-2 py-1 text-sm text-ink outline-none focus:border-accent"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                aria-label="Your answer"
              />
              <Button type="submit" size="sm">Send</Button>
            </form>
          ) : null}
        </div>
      ) : null}

      {event.kind === "approval_required" ? (
        <div className="mt-2 space-y-2">
          <p className="text-sm text-ink">{event.action}</p>
          {onApprove || onReject ? (
            <div className="flex gap-2">
              <Button size="sm" onClick={onApprove}>Approve</Button>
              <Button size="sm" variant="outline" onClick={onReject}>Reject</Button>
            </div>
          ) : null}
        </div>
      ) : null}

      {event.durationMs ? <p className="mt-1 font-mono text-xs text-ink-muted">{event.durationMs} ms</p> : null}
    </div>
  );
}
```

(`useState` for the answer field is local form state, not activity simulation — the fake-activity test in Step 1 still passes because nothing changes without user input or a new `event` prop.)

- [ ] **Step 6: Run the test — verify it passes**

Run: `cd admin-web && npm run test -- agent-event-item`
Expected: PASS (4 tests).

- [ ] **Step 7: Commit**

```bash
git add admin-web/components/primitives/timeline.tsx admin-web/components/primitives/tool-call-chip.tsx admin-web/components/primitives/agent-event-item.tsx admin-web/components/primitives/agent-event-item.test.tsx
git commit -m "feat(admin-web): agent-activity primitives (props-driven, no fake timers)"
```

---

## Task 11: Application shell rebuild

**Files:**
- Create: `admin-web/lib/nav.ts`, `admin-web/components/layout/{app-shell,sidebar,topbar,auth-gate}.tsx`, `admin-web/components/dev/persona-switcher.tsx`, `admin-web/components/layout/auth-gate.test.tsx`
- Delete: `admin-web/components/layout/AppShell.tsx`

**Interfaces:**
- Consumes: `personas`, `personaList` from `@/lib/fixtures`; `AppUser`, `UserRole` from `@/lib/contracts`; shadcn `avatar`, `dropdown-menu`, `button`, `separator`.
- Produces:
  - `NAV: Record<UserRole, { href: string; label: string }[]>` and `routeRole(pathname: string): UserRole | null`.
  - `<AppShell>` — sets `data-theme="light"`; renders `<Sidebar>` + `<Topbar>` + `<main>`; wraps children in `<AuthGate>`.
  - `<AuthGate>` — reads active persona from a `PersonaContext` (default `personas.customer`), exposes `useActivePersona()`; if the current route's role (`routeRole`) differs from the persona role, renders a plain 403 block; if no persona, renders a plain "Sign in" block. Marked clearly as a Phase-1 stub.
  - `<PersonaSwitcher>` — dev-only (`process.env.NODE_ENV !== "production"`) fixed bottom-left control cycling `personaList`.

- [ ] **Step 1: Write `admin-web/lib/nav.ts`**

```ts
import type { UserRole } from "@/lib/contracts";

export const NAV: Record<UserRole, { href: string; label: string }[]> = {
  admin: [
    { href: "/dashboard/admin", label: "Overview" },
    { href: "/dashboard/admin/customers", label: "Customers" },
    { href: "/dashboard/admin/providers", label: "Providers" },
    { href: "/traces", label: "Agent traces" },
    { href: "/bookings", label: "Bookings" },
    { href: "/dashboard/admin/settings", label: "Settings" },
  ],
  provider: [
    { href: "/dashboard/provider", label: "Today" },
    { href: "/dashboard/provider/bookings", label: "Assigned jobs" },
    { href: "/dashboard/provider/services", label: "Services" },
    { href: "/dashboard/provider/slots", label: "Availability" },
  ],
  customer: [
    { href: "/dashboard/customer", label: "Home" },
    { href: "/dashboard/customer/providers", label: "Find artisans" },
    { href: "/dashboard/customer/bookings", label: "My bookings" },
    { href: "/dashboard/customer/profile", label: "Addresses" },
  ],
};

const PREFIX: Record<string, UserRole> = {
  "/dashboard/admin": "admin",
  "/traces": "admin",
  "/bookings": "admin",
  "/services": "admin",
  "/dashboard/provider": "provider",
  "/dashboard/customer": "customer",
};

export function routeRole(pathname: string): UserRole | null {
  const hit = Object.keys(PREFIX).find((p) => pathname === p || pathname.startsWith(p + "/"));
  return hit ? PREFIX[hit] : null;
}
```

- [ ] **Step 2: Write `admin-web/components/layout/auth-gate.test.tsx`**

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthGate, PersonaProvider } from "./auth-gate";

vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard/admin" }));

describe("AuthGate (Phase-1 stub)", () => {
  it("blocks a customer persona on an admin route", () => {
    render(
      <PersonaProvider initialRole="customer">
        <AuthGate><div>secret admin content</div></AuthGate>
      </PersonaProvider>,
    );
    expect(screen.queryByText("secret admin content")).not.toBeInTheDocument();
    expect(screen.getByText(/not authorised/i)).toBeInTheDocument();
  });

  it("allows an admin persona on an admin route", () => {
    render(
      <PersonaProvider initialRole="admin">
        <AuthGate><div>secret admin content</div></AuthGate>
      </PersonaProvider>,
    );
    expect(screen.getByText("secret admin content")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run it — verify it fails**

Run: `cd admin-web && npm run test -- auth-gate`
Expected: FAIL — module not found.

- [ ] **Step 4: Create `admin-web/components/layout/auth-gate.tsx`**

```tsx
"use client";

/**
 * PHASE-1 STUB. Real auth (Clerk + middleware.ts + server checks) replaces this.
 * The RBAC shape (routeRole vs persona.role) is deliberately preserved so Phase 1
 * can swap the persona source for the Clerk session with no consumer changes.
 */
import { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import type { AppUser, UserRole } from "@/lib/contracts";
import { personas } from "@/lib/fixtures";
import { routeRole } from "@/lib/nav";

interface PersonaCtx {
  persona: AppUser;
  setRole: (r: UserRole) => void;
}
const Ctx = createContext<PersonaCtx | null>(null);

export function PersonaProvider({ children, initialRole = "customer" }: { children: React.ReactNode; initialRole?: UserRole }) {
  const [role, setRole] = useState<UserRole>(initialRole);
  return <Ctx.Provider value={{ persona: personas[role], setRole }}>{children}</Ctx.Provider>;
}

export function useActivePersona() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useActivePersona must be used within PersonaProvider");
  return c;
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { persona } = useActivePersona();
  const pathname = usePathname() ?? "/";
  const needed = routeRole(pathname);

  if (needed && needed !== persona.role) {
    return (
      <div className="mx-auto mt-24 max-w-md rounded-md border border-hairline bg-surface-raised p-8 text-center">
        <h2 className="font-display text-xl text-ink">Not authorised</h2>
        <p className="mt-2 text-sm text-ink-muted">
          This area is for {needed} accounts. You are signed in as {persona.role}.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}
```

- [ ] **Step 5: Run the test — verify it passes**

Run: `cd admin-web && npm run test -- auth-gate`
Expected: PASS (2 tests).

- [ ] **Step 6: Create `admin-web/components/dev/persona-switcher.tsx`**

```tsx
"use client";

import { personaList } from "@/lib/fixtures";
import { useActivePersona } from "@/components/layout/auth-gate";

export function PersonaSwitcher() {
  const { persona, setRole } = useActivePersona();
  if (process.env.NODE_ENV === "production") return null;
  return (
    <div className="fixed bottom-3 left-3 z-50 flex items-center gap-1 rounded-md border border-hairline bg-surface-raised p-1 text-xs shadow-overlay">
      <span className="px-1 text-ink-muted">dev persona</span>
      {personaList.map((p) => (
        <button
          key={p.id}
          onClick={() => setRole(p.role)}
          className={`rounded-sm px-2 py-1 ${p.role === persona.role ? "bg-accent text-accent-ink" : "text-ink hover:bg-surface-sunken"}`}
        >
          {p.role}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 7: Create `admin-web/components/layout/sidebar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { useActivePersona } from "./auth-gate";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { persona } = useActivePersona();
  const pathname = usePathname() ?? "";
  const items = NAV[persona.role];

  return (
    <aside className="flex w-60 flex-shrink-0 flex-col border-r border-hairline bg-surface">
      <div className="border-b border-hairline px-5 py-4">
        <Link href="/" className="font-display text-md text-ink">Atelier</Link>
        <p className="mt-0.5 text-xs capitalize text-ink-muted">{persona.role} workspace</p>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {items.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + "/");
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm transition-colors duration-fast",
                active ? "bg-accent-tint text-accent" : "text-ink-muted hover:bg-surface-sunken hover:text-ink",
              )}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 8: Create `admin-web/components/layout/topbar.tsx`**

```tsx
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useActivePersona } from "./auth-gate";

export function Topbar() {
  const { persona } = useActivePersona();
  return (
    <header className="flex h-14 items-center justify-between border-b border-hairline bg-surface px-6">
      <span className="text-sm text-ink-muted">{persona.city.toUpperCase()} · {persona.area}</span>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm text-ink">{persona.name}</p>
          <p className="text-xs capitalize text-ink-muted">{persona.role}</p>
        </div>
        <Avatar className="h-8 w-8"><AvatarFallback>{persona.avatarInitials}</AvatarFallback></Avatar>
        <Button variant="outline" size="sm">Sign out</Button>
      </div>
    </header>
  );
}
```

- [ ] **Step 9: Create `admin-web/components/layout/app-shell.tsx`**

```tsx
"use client";

import { usePathname } from "next/navigation";
import { PersonaProvider, AuthGate } from "./auth-gate";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { PersonaSwitcher } from "@/components/dev/persona-switcher";

const BARE = ["/", "/login", "/signup", "/provider/login", "/provider/signup", "/admin/login", "/foundations"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const bare = BARE.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (bare) return <>{children}</>;

  return (
    <PersonaProvider>
      <div data-theme="light" className="flex min-h-screen bg-surface text-ink">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="mx-auto w-full max-w-6xl flex-1 p-6">
            <AuthGate>{children}</AuthGate>
          </main>
        </div>
      </div>
      <PersonaSwitcher />
    </PersonaProvider>
  );
}
```

- [ ] **Step 10: Delete the old shell and fix imports**

```bash
cd admin-web
git rm components/layout/AppShell.tsx
```

`app/layout.tsx` already imports `@/components/layout/app-shell` (Task 3, Step 5). Grep for any other importer of the old path:

Run: `cd admin-web && grep -rn "layout/AppShell" app components`
Expected: no results. If any, repoint to `@/components/layout/app-shell`.

- [ ] **Step 11: Typecheck, test, build**

Run: `cd admin-web && npx tsc --noEmit && npm run test && npm run build`
Expected: `tsc` clean; all tests pass; **`npm run build` succeeds** (the two missing modules from Task 3 now exist — `app-shell` here, `sonner` from Task 7).

- [ ] **Step 12: Commit**

```bash
git add -A admin-web/lib/nav.ts admin-web/components/layout admin-web/components/dev
git commit -m "feat(admin-web): rebuild application shell on light surface; RBAC-shaped auth stub"
```

---

## Task 12: `/foundations` reference page

**Files:**
- Create: `admin-web/app/foundations/page.tsx`, `admin-web/components/foundations/{color-section,type-section,motion-demo}.tsx`, `admin-web/app/foundations/foundations.test.tsx`

**Interfaces:**
- Consumes: `tokens` from `@/lib/design/tokens`; every primitive from `@/components/primitives/*`; `getGsap`, `prefersReducedMotion` from `@/lib/motion/gsap`; `sessions` from `@/lib/fixtures`.
- Produces: the `/foundations` route (not in product nav).

- [ ] **Step 1: Write `admin-web/app/foundations/foundations.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import FoundationsPage from "./page";

describe("/foundations", () => {
  it("renders every section heading", () => {
    render(<FoundationsPage />);
    for (const h of ["Colour", "Typography", "Space & radius", "Elevation", "Motion", "Primitives", "Agent activity", "Shell"]) {
      expect(screen.getByRole("heading", { name: h })).toBeInTheDocument();
    }
  });

  it("renders the honest StatTile no-data state, not a fake number", () => {
    render(<FoundationsPage />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("has no serious/critical a11y violations", async () => {
    const { container } = render(<FoundationsPage />);
    const results = await axe(container);
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it — verify it fails**

Run: `cd admin-web && npm run test -- foundations`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `admin-web/components/foundations/color-section.tsx`**

```tsx
import { tokens } from "@/lib/design/tokens";

const ROLES = [
  "--surface", "--surface-sunken", "--surface-raised", "--hairline",
  "--ink", "--ink-muted", "--accent", "--accent-hover", "--accent-tint",
  "--status-go", "--status-warn", "--status-stop", "--status-info", "--status-live",
];

export function ColorSection() {
  return (
    <section>
      <h2 className="font-display text-2xl text-ink">Colour</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ROLES.map((r) => (
          <div key={r} className="rounded-md border border-hairline p-3">
            <div className="h-10 w-full rounded-sm border border-hairline" style={{ background: `var(${r})` }} />
            <p className="mt-2 font-mono text-xs text-ink">{r}</p>
          </div>
        ))}
      </div>
      <div className="theme-marketing mt-4 rounded-md border border-hairline bg-surface p-4">
        <p className="text-xs text-ink-muted">Craft layer — marketing subtree only</p>
        <div className="mt-2 flex gap-2">
          {["--tile", "--terracotta", "--brass", "--plaster"].map((r) => (
            <div key={r} className="h-8 w-16 rounded-sm" style={{ background: `var(${r})` }} title={r} />
          ))}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {tokens.viz.map((v, i) => (
          <div key={i} className="h-8 w-16 rounded-sm" style={{ background: v }} title={`--viz-${i + 1}`} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `admin-web/components/foundations/type-section.tsx`**

```tsx
const RAMP: { name: string; cls: string }[] = [
  { name: "display-hero", cls: "font-display text-6xl" },
  { name: "display-1", cls: "font-display text-4xl" },
  { name: "title-1", cls: "font-display text-2xl" },
  { name: "title-2", cls: "font-display text-xl" },
  { name: "body-lg (editorial)", cls: "font-editorial text-md" },
  { name: "body", cls: "font-sans text-base" },
  { name: "label", cls: "font-sans text-sm" },
  { name: "caption", cls: "font-sans text-xs" },
  { name: "mono", cls: "font-mono text-sm" },
];

export function TypeSection() {
  return (
    <section>
      <h2 className="font-display text-2xl text-ink">Typography</h2>
      <div className="mt-4 space-y-3">
        {RAMP.map((r) => (
          <div key={r.name} className="flex items-baseline gap-4 border-b border-hairline pb-2">
            <span className="w-40 shrink-0 font-mono text-xs text-ink-muted">{r.name}</span>
            <span className={`${r.cls} text-ink`}>Verified artisans, dispatched fast</span>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <p className="font-editorial text-md text-ink">Editorial serif (Zodiak) — marketing storytelling only. Rooted, human, unhurried.</p>
        <p className="font-sans text-base text-ink">Application body (Switzer). Reads cleanly at small sizes in dense dashboards.</p>
      </div>
      <p className="mt-3 font-mono text-sm text-ink-muted">BK-4821 · 640 ms · find_providers</p>
    </section>
  );
}
```

- [ ] **Step 5: Create `admin-web/components/foundations/motion-demo.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/motion/gsap";

export function MotionDemo() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const gsap = getGsap();
    const split = new (window as unknown as { SplitText: new (el: Element, o: object) => { chars: Element[]; revert: () => void } }).SplitText;
    // Use the plugin via gsap namespace to avoid direct import issues:
    const st = (gsap as unknown as { SplitText?: new (el: Element, o: object) => { chars: Element[]; revert: () => void } }).SplitText
      ? new (gsap as unknown as { SplitText: new (el: Element, o: object) => { chars: Element[]; revert: () => void } }).SplitText(ref.current, { type: "chars" })
      : null;
    const target = st ? st.chars : [ref.current];
    const tween = gsap.from(target, {
      yPercent: 100, opacity: 0, stagger: 0.02, duration: 0.26, ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 80%" },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      st?.revert();
      void split;
    };
  }, []);

  return (
    <section>
      <h2 className="font-display text-2xl text-ink">Motion</h2>
      <p className="mt-2 text-sm text-ink-muted">
        The only GSAP in Phase 0: a scroll-triggered SplitText reveal (marketing pattern). Respects reduced-motion.
      </p>
      <div className="mt-6 overflow-hidden py-8">
        <h3 ref={ref} className="font-display text-4xl text-ink">Cinematic, but only where it earns its place.</h3>
      </div>
    </section>
  );
}
```

If the `SplitText` construction shape above does not typecheck against the installed GSAP types, simplify: drop SplitText and animate the whole `<h3>` with `gsap.from(ref.current, { yPercent: 20, opacity: 0, duration: 0.26, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 80%" } })`. The point proven is ScrollTrigger wiring + reduced-motion guard, not the specific plugin.

- [ ] **Step 6: Create `admin-web/app/foundations/page.tsx`**

```tsx
import { ColorSection } from "@/components/foundations/color-section";
import { TypeSection } from "@/components/foundations/type-section";
import { MotionDemo } from "@/components/foundations/motion-demo";
import { PageHeader } from "@/components/primitives/page-header";
import { StatRow } from "@/components/primitives/stat-row";
import { StatTile } from "@/components/primitives/stat-tile";
import { EmptyState } from "@/components/primitives/empty-state";
import { DataTable } from "@/components/primitives/data-table";
import { Timeline } from "@/components/primitives/timeline";
import { AgentEventItem } from "@/components/primitives/agent-event-item";
import { StatusBadge } from "@/components/primitives/status-badge";
import { Button } from "@/components/ui/button";
import { sessions } from "@/lib/fixtures";

export default function FoundationsPage() {
  const events = sessions[0].events;
  return (
    <div className="mx-auto max-w-5xl space-y-12 p-8">
      <PageHeader title="Foundations" description="Every token, type style, and primitive. Internal reference — not linked from product nav." />

      <ColorSection />
      <TypeSection />

      <section>
        <h2 className="font-display text-2xl text-ink">Space &amp; radius</h2>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          {["--space-3", "--space-5", "--space-7", "--space-9"].map((s) => (
            <div key={s} className="bg-accent-tint" style={{ width: `var(${s})`, height: `var(${s})` }} title={s} />
          ))}
          {["--r-sm", "--r-md", "--r-lg", "--r-pill"].map((r) => (
            <div key={r} className="h-12 w-12 border border-hairline bg-surface-sunken" style={{ borderRadius: `var(${r})` }} title={r} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-ink">Elevation</h2>
        <div className="mt-4 flex gap-4">
          <div className="rounded-md bg-surface-raised p-6 shadow-raised">shadow-raised</div>
          <div className="rounded-md bg-surface-raised p-6 shadow-overlay">shadow-overlay</div>
        </div>
      </section>

      <MotionDemo />

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-ink">Primitives</h2>
        <StatRow>
          <StatTile label="Bookings today" value={12} delta={{ value: "+3", direction: "up" }} />
          <StatTile label="Active providers" value={8} />
          <StatTile label="GMV" value={0} state="no-data" />
          <StatTile label="Median latency" value={0} state="loading" />
        </StatRow>
        <div className="flex flex-wrap gap-2">
          {["confirmed", "en_route", "arrived", "completed", "cancelled", "online", "busy", "verified"].map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
        </div>
        <DataTable
          columns={[{ key: "name", header: "Provider" }, { key: "jobs", header: "Jobs", align: "right" }]}
          rows={[{ id: "1", name: "Tariq Mehmood", jobs: 142 }, { id: "2", name: "Imran Baig", jobs: 185 }]}
          getRowKey={(r) => r.id}
          renderRow={(r) => [<span key="n">{r.name}</span>, <span key="j">{r.jobs}</span>]}
        />
        <EmptyState title="No bookings yet" description="New requests will appear here." action={<Button size="sm">Refresh</Button>} />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-ink">Agent activity</h2>
        <Timeline
          items={events.slice(0, 5).map((e, i) => ({
            id: `${i}`,
            title: e.summary,
            meta: "durationMs" in e && e.durationMs ? `${e.durationMs} ms` : undefined,
            state: i === 4 ? "active" : "done",
          }))}
        />
        <div className="space-y-2">
          {events.map((e, i) => (
            <AgentEventItem
              key={i}
              event={e}
              onAnswer={e.kind === "question_required" ? () => {} : undefined}
              onApprove={e.kind === "approval_required" ? () => {} : undefined}
              onReject={e.kind === "approval_required" ? () => {} : undefined}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-ink">Shell</h2>
        <p className="mt-2 text-sm text-ink-muted">
          The rebuilt sidebar + topbar render around this page via the app shell. Use the dev persona switcher (bottom-left) to see role-scoped nav.
        </p>
      </section>
    </div>
  );
}
```

- [ ] **Step 7: Run the test — verify it passes**

Run: `cd admin-web && npm run test -- foundations`
Expected: PASS (3 tests). If the a11y test flags a serious violation, fix it (usually a missing label or heading order) before moving on.

- [ ] **Step 8: Full build + visual check**

Run: `cd admin-web && npx tsc --noEmit && npm run build && npm run dev`
Then open `http://localhost:3000/foundations`. Confirm by eye: ember accent reads restrained (not neon), the type ramp has real hierarchy, no blur blobs / glow shadows / emoji, the GSAP headline reveals on scroll, and toggling OS "reduce motion" disables it. Stop the dev server.

- [ ] **Step 9: Commit**

```bash
git add admin-web/app/foundations admin-web/components/foundations
git commit -m "feat(admin-web): /foundations reference page for tokens and primitives"
```

---

## Task 13: Cleanup + final verification

**Files:**
- Delete: `admin-web/components/landing/{AgentSymphony,AuditObservability,ProofStrip,ServiceBentoGrid,VoiceShowcase}.tsx`
- Modify: `admin-web/app/globals.css` (remove any leftover `.catalis-*` if present), any page importing a deleted symbol
- Create: `admin-web/tests/no-legacy.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: a guard test asserting the legacy surface is gone.

- [ ] **Step 1: Delete dead landing components**

```bash
cd admin-web
git rm components/landing/AgentSymphony.tsx components/landing/AuditObservability.tsx components/landing/ProofStrip.tsx components/landing/ServiceBentoGrid.tsx components/landing/VoiceShowcase.tsx
```

- [ ] **Step 2: Find and fix any dangling importers**

Run: `cd admin-web && grep -rn "AgentSymphony\|AuditObservability\|ProofStrip\|ServiceBentoGrid\|VoiceShowcase" app components`
Expected: no results (they were already orphaned). If any import appears, delete that import line and the JSX usage (these are all on `app/page.tsx` which is rebuilt in Phase 3 — a minimal removal is fine).

- [ ] **Step 3: Write `admin-web/tests/no-legacy.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(__dirname, "..");

function grep(pattern: string): string {
  try {
    return execSync(`grep -rn --include=*.tsx --include=*.ts --include=*.css "${pattern}" app components lib`, {
      cwd: root, encoding: "utf8",
    });
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
    for (const f of ["ui/badge.tsx", "ui/button.tsx", "ui/card.tsx", "ui/table.tsx", "ui/MagneticButton.tsx", "ui/SpotlightCard.tsx", "ui/Toaster.tsx", "layout/AppShell.tsx"]) {
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
```

- [ ] **Step 4: Run it — fix what it flags**

Run: `cd admin-web && npm run test -- no-legacy`
Expected: PASS. If a `grep` assertion is non-empty, remove that reference (e.g. a `.catalis-btn` still used on a not-yet-rebuilt auth page → swap for `className="rounded-md bg-accent px-4 py-2 text-accent-ink"`).

- [ ] **Step 5: Full verification sweep**

Run each and confirm the expected result:

```bash
cd admin-web
npx tsc --noEmit        # exits 0
npm run test            # all suites pass
npm run build           # succeeds
npm run lint            # no new errors
```

Then a manual pass on `npm run dev`:
- `/foundations` — matches the bar (section headings, honest `—` no-data tile, ember reads restrained, GSAP reveal works, reduced-motion disables it).
- `/dashboard/customer` via the dev persona switcher — renders inside the new shell (transitional styling on the page body is expected; the **shell** is what's under review).
- Switch persona to `admin`, navigate to `/dashboard/admin` — allowed; switch to `customer`, hit `/dashboard/admin` — the plain 403 block shows.

- [ ] **Step 6: Commit**

```bash
git add -A admin-web
git commit -m "chore(admin-web): remove dead components and legacy token surface; add guard test"
```

- [ ] **Step 7: Update progress doc**

Append to `progress.md` under a new `## Phase 0 — Foundation & Cleanup` heading: the date, "COMPLETED", and a one-line summary of what shipped (token system, fonts, shadcn primitives, fixtures SoT, shell rebuild, `/foundations`, ~1,450 LOC dead code removed). Commit:

```bash
git add progress.md
git commit -m "docs: mark Phase 0 complete"
```

---

## Self-Review

**1. Spec coverage**

| Spec section | Task(s) |
|---|---|
| §2.1 token system, SoT in globals.css | Task 2 |
| §2.2 two role sets + theme switch structure | Task 2 (`:root` + `[data-theme="marketing"]` + empty `prefers-color-scheme` block) |
| §2.3 four self-hosted fonts via `next/font/local` | Task 3 |
| §2.4 shadcn init + primitive set + delete hand-rolled | Task 7 |
| §2.5 composed primitives with empty/no-data/reduced-motion states | Tasks 8, 9, 10 |
| §2.6 shell rebuilt, no fabricated status widgets | Task 11 |
| §2.7 contracts + fixtures + one identity each + seed trim | Tasks 4, 5 |
| §2.8 delete 5 dead components + legacy token generations | Tasks 7 (ui), 11 (shell), 13 (landing + grep guard); legacy token blocks removed in Task 2 |
| §2.9 `/foundations` covers everything | Task 12 |
| §2.10 GSAP + ScrollTrigger + SplitText in one boundary, used only by a demo | Tasks 6, 12 |
| §2.11 verification bar | every task's final steps + Task 13 Step 5 |
| §5 token architecture (exact values) | Task 2 (verbatim) |
| §6 typography (families, ramp, "never used for" rules) | Task 3 + Task 12 type section |
| §7 colour usage rules | encoded in Task 8 `status-badge` mapping + Global Constraints |
| §8 motion system (libs, rules, no-fake-activity) | Task 6 + Task 10 (props-only, fake-activity test) |
| §9.1 shadcn adoption incl. `sonner` replacing Toaster | Task 7 |
| §9.2 primitive table (every component + states) | Tasks 8–10 |
| §9.3 shell files, nav in `lib/nav.ts`, auth-gate stub preserving RBAC shape | Task 11 |
| §10.1 contracts incl. `agent-event` union defined now | Task 4 |
| §10.2 fixtures (personas, providers, cities, bookings, sessions, `getFixtures`) | Task 5 |
| §10.3 dev persona switcher, prod-gated | Task 11 |
| §10.4 backend seed trimmed to canonical set | Task 5 Step 12 |
| §11 cleanup checklist (delete/rewrite/leave lists) | Tasks 2, 5, 7, 11, 13 |
| §12 `/foundations` 8 sections | Task 12 (headings: Colour, Typography, Space & radius, Elevation, Motion, Primitives, Agent activity, Shell) |
| §13 file/dir plan | matches the File Structure section above |
| §14 verification (tsc, build, parity test, axe, greps) | Tasks 2, 12, 13 |
| §15 risks (shadcn overwrite, font licensing, SplitText free, transitional pages, OS dark mode) | handled inline in Tasks 3, 7, 12; `data-theme="light"` on shell wrapper (Task 11) |

No gaps found.

**2. Placeholder scan** — no "TBD"/"implement later"/"add error handling"/"similar to Task N". Every code step has real code. Font acquisition (Task 3 Step 1) names exact files and endpoints with a manual fallback.

**3. Type consistency** — checked across tasks:
- `AgentEvent` union shape (Task 4) is consumed identically in `fixtures/sessions.ts` (Task 5), `agent-event-item.tsx` (Task 10), `/foundations` (Task 12): `kind`, `sessionId`, `step`, `agentName`, `summary`, `payload`, `timestamp`, optional `durationMs`, plus `toolName` / `question` / `action` / `errorCode` on their variants.
- `AppUser` fields (`id`, `role`, `name`, `email`, `phone`, `city`, `area`, `avatarInitials`, `category?`) — defined Task 4, produced Task 5 `personas`, consumed Task 11 `sidebar`/`topbar`/`auth-gate`.
- `Provider` fields — defined Task 4, produced Task 5, consumed Task 12 DataTable demo.
- `routeRole` / `NAV` (Task 11 `lib/nav.ts`) — consumed by `auth-gate.tsx`, `sidebar.tsx`, and `auth-gate.test.tsx`, same signatures.
- `useActivePersona()` (Task 11 `auth-gate.tsx`) — consumed by `sidebar`, `topbar`, `persona-switcher` with the `{ persona, setRole }` shape.
- `StatTile` `state` union `"ready" | "loading" | "no-data"` — same in component (Task 8) and `/foundations` usage (Task 12).
- `DataTable` prop names (`columns`, `rows`, `getRowKey`, `renderRow`, `state`, `emptyTitle`) — same in Task 9 definition, Task 9 test, Task 12 usage.
- `getGsap` / `prefersReducedMotion` (Task 6) — consumed by `motion-demo.tsx` (Task 12) with those exact names.
- Token CSS var names in `globals.css` (Task 2) vs `tokens.ts` keys (Task 2) vs `color-section.tsx` role list (Task 12) — all use the `--surface` / `--accent` / `--status-*` / `--viz-N` spellings.

No inconsistencies found.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-09-10-phase-0-foundation.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach?**
