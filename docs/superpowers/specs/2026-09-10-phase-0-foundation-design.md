# Phase 0 — Foundation & Cleanup — Design Spec

**Date:** 2026-09-10
**Branch:** `frontend/revamp-ui`
**Status:** Draft for review
**Program:** Full rebuild of the AI Service Marketplace web app (`admin-web`) — visual + backend + real conversational agent. This is the first of six phases.

---

## 1. Purpose

Establish the single, coherent design and data foundation that every later phase builds on, and remove the accumulated cruft that makes the current app look like a prototype.

Today the repo carries **three stacked generations of design tokens** that contradict each other (`juniper/champagne/gold/noir` in `tailwind.config.ts`, cobalt in `globals.css`, hardcoded `#090E0C` in `layout.tsx`), **~1,450 lines of dead landing components**, hardcoded "data" arrays in almost every page with **conflicting identities for the same people**, and a motion story that claims "cinematic GSAP" but ships `animate-pulse`.

Phase 0 replaces all of that with one token system, one component-primitive layer, one data source of truth, and a rebuilt application shell — proven on an internal `/foundations` reference page.

Phase 0 does **not** rebuild feature pages, wire real auth, touch the agent backend, or build the landing page. Those are Phases 1–5.

### Out of scope (explicitly deferred)

| Deferred item | Phase |
|---|---|
| Real Clerk auth, per-role login screens, `middleware.ts`, FastAPI JWT verification | 1 |
| Conversational agent backend, event streaming, approval gate | 2 |
| Landing page build (direction is set here; the page is built later) | 3 |
| Customer dashboard + live agent chat + Vapi | 3 |
| Provider dashboard + provider-scoped backend endpoints | 4 |
| Admin console + aggregation endpoints + trace UI | 5 |
| Any feature-page restyle other than the app shell | 3–5 |

---

## 2. Success criteria

Phase 0 is done when all of the following hold:

1. `globals.css` defines a two-layer token system (primitives → semantic roles) as the **sole source of truth** for color, type, space, radius, elevation, and motion. `tailwind.config.ts` only *references* those CSS variables — no literal values live in the Tailwind config.
2. A dark **marketing** semantic role set and a light **application** semantic role set both exist, switchable via `[data-theme]` + `prefers-color-scheme`. Only these two role sets are designed; the switch structure exists for future themes.
3. Four self-hosted font families are wired via `next/font/local`: **Clash Display**, **Zodiak**, **Switzer**, **JetBrains Mono**. No Google Fonts `@import`. No external font CDN.
4. shadcn/ui is initialised and the primitive set below is generated and restyled to the tokens. The four hand-rolled `components/ui/*` files are deleted.
5. The composed app primitives below exist, each with an explicit empty / no-data / reduced-motion state where applicable.
6. The application shell (`sidebar` + `topbar` + auth-interception stub) is rebuilt on the light application surface, role-aware, with no fabricated status widgets.
7. `lib/contracts/` holds API-shaped TS types; `lib/fixtures/` holds the canonical demo data; every identity (person, provider, city) is defined exactly once. `backend/app/db/seed.py` is trimmed to mirror the same canonical set.
8. The 5 dead landing components are deleted. The legacy token generations are removed from `tailwind.config.ts`, `globals.css`, and `layout.tsx`.
9. `/foundations` renders every token, type style, colour role, elevation level, motion pattern, and every primitive in every state.
10. GSAP + ScrollTrigger + SplitText are installed and registered in one client boundary, used by nothing yet except a single demo block on `/foundations`.
11. Verification passes: `npx tsc --noEmit` exits 0 · `npm run build` succeeds · the token-parity test passes · `axe` reports no serious/critical violations on `/foundations` and the shell · manual review of the shell (light) and a marketing sample block (dark) confirms the bar.

---

## 3. Migration approach

**Approach A — clean-slate foundation, big-bang token swap.** (Chosen. Alternatives B "additive parallel system" and C "restyle everything now" were rejected: B carries two systems and drift risk for weeks; C balloons Phase 0 into Phases 3–5.)

Rationale confirmed by inspection: legacy **named** Tailwind tokens (`juniper`, `gold-*`, `bg-card`, `text-foreground`, …) are referenced only inside the four hand-rolled `components/ui/*` files, which are being deleted. Feature pages use **arbitrary** values (`bg-[#111118]`) that keep compiling after token removal. Therefore no compatibility pass is required for feature pages; they will look transitional until their own phase, which is acceptable because they are auth-gated and scheduled for full rebuild.

---

## 4. Visual direction (reference, set in brainstorming)

**70% Kinetic Dispatch / 30% Local Craft Premium.**

- **Kinetic Dispatch** is the core product language: operational, fast, precise, live. It governs dashboards, agent activity, provider matching, bookings, admin, and all real-time states.
- **Local Craft Premium** is layered into brand and marketing only: sophisticated palette, photography, editorial composition, restrained locally-inspired material references (blue tile, terracotta, brass, plaster), human-centred storytelling. Never literally themed or culturally decorative.
- **Dark-primary** for marketing/landing. **Light/neutral** for application surfaces.
- Landing is cinematic and GSAP-heavy (built in Phase 3). Dashboards prioritise real product states over decorative animation.
- **No fake AI activity for visual effect.** Agent-activity UI renders only real agent/tool events (Phase 2 onward). Phase 0 ships those components as pure presentational primitives with no self-driving timers.

### Anti-AI-slop rules (enforced for the life of the project)

- No radius above `--r-lg` (12px) on application surfaces; marketing hero elements may reach `--r-lg` but no `2rem` "pill blobs".
- No blur-blob background decorations (`w-64 h-64 rounded-full blur-[120px]`).
- No glow shadows (`shadow-[0_0_20px_rgba(...)]`). Elevation is hairline borders + at most two real shadow tokens.
- No gradients as decoration. A gradient must encode meaning (e.g. a data range) or it does not ship.
- No emoji in UI chrome (labels, badges, ranks, nav). Emoji is user content only.
- No fabricated metrics or fake precision ("99.4% Accuracy", "< 980ms Latency", "98.8% Match"). A number shown is a number measured, or it is not shown.
- No repeated "banner (uppercase badge + huge headline + blurb + 2 buttons) → 4–5 KPI card grid" template. `PageHeader` is deliberately plainer; `StatTile` rows are used only where the stats are real and few.
- No decorative diagrams.
- No icon without a label or a genuine standalone-affordance reason.
- Every animation has a purpose: state change, orientation, or drawing attention to a real event. Motion that only decorates does not ship.

---

## 5. Token architecture

### 5.1 Structure

`admin-web/app/globals.css`, `@layer base`:

```
:root {
  /* ---------- PRIMITIVES (raw values; never referenced by components directly) ---------- */
  --warm-950: #0B0B0B;
  --warm-900: #131211;
  --warm-850: #1A1917;
  --warm-800: #232120;
  --warm-700: #2E2B29;
  --warm-500: #8A8882;   /* muted, per stakeholder palette */
  --warm-300: #B8B5AD;
  --warm-150: #DEDBD2;
  --warm-100: #F5F2EA;   /* marketing text, per stakeholder palette */

  --paper-0:   #FBFAF6;
  --paper-50:  #F4F2EC;
  --paper-100: #ECEAE1;
  --paper-200: #E4E1D7;

  --ink-900: #1C1A17;
  --ink-700: #3D3A34;
  --ink-500: #6B665C;

  /* Accent — craft ember (restrained; terracotta blood, not neon) */
  --ember-600: #C24A1E;  /* pressed / active */
  --ember-500: #DE5527;  /* primary accent */
  --ember-400: #F26B3A;  /* hover on dark */
  --ember-tint: rgba(222, 85, 39, 0.12);

  /* Signal — RESERVED for true live/urgent/dispatch-active states only */
  --signal: #FF5A1F;

  /* Functional (muted, not neon) */
  --go-500:   #2E7D5B;   /* success / en-route */
  --warn-500: #C98A12;
  --stop-500: #C0392B;   /* danger */
  --info-500: #3E6C8A;   /* info; blue-tile derived */

  /* Craft layer — MARKETING ONLY */
  --tile:      #1E3A5F;
  --terracotta:#A8492B;
  --brass:     #B08D57;
  --plaster:   #EBE6D9;

  /* Categorical data-viz ramp — defined once, used by charts/leaderboards in later phases */
  --viz-1: #DE5527;  --viz-2: #3E6C8A;  --viz-3: #B08D57;
  --viz-4: #2E7D5B;  --viz-5: #8A5A3C;  --viz-6: #6B665C;

  /* ---------- SCALES ---------- */
  --text-xs:   0.75rem;   /* 12 */
  --text-sm:   0.8125rem; /* 13 */
  --text-base: 0.875rem;  /* 14 — app body default */
  --text-md:   1rem;      /* 16 */
  --text-lg:   1.125rem;  /* 18 */
  --text-xl:   1.3125rem; /* 21 */
  --text-2xl:  1.625rem;  /* 26 */
  --text-3xl:  2.0625rem; /* 33 */
  --text-4xl:  2.625rem;  /* 42 */
  --text-5xl:  3.375rem;  /* 54 */
  --text-6xl:  4.25rem;   /* 68 — marketing hero only */

  --space-1: 0.125rem; --space-2: 0.25rem; --space-3: 0.5rem;
  --space-4: 0.75rem;  --space-5: 1rem;    --space-6: 1.5rem;
  --space-7: 2rem;     --space-8: 3rem;    --space-9: 4rem;   --space-10: 6rem;

  --r-sm: 4px; --r-md: 8px; --r-lg: 12px; --r-pill: 999px;

  --e-raised: 0 1px 2px rgba(0,0,0,0.06), 0 1px 1px rgba(0,0,0,0.04);
  --e-overlay: 0 8px 24px rgba(0,0,0,0.16);

  --dur-fast: 120ms; --dur: 180ms; --dur-slow: 260ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);

  /* ---------- SEMANTIC ROLES — light application surface (default) ---------- */
  --surface:        var(--paper-0);
  --surface-sunken: var(--paper-50);
  --surface-raised: #FFFFFF;
  --hairline:       var(--paper-200);
  --ink:            var(--ink-900);
  --ink-muted:      var(--ink-500);
  --accent:         var(--ember-500);
  --accent-hover:   var(--ember-600);
  --accent-ink:     #FFFFFF;
  --accent-tint:    var(--ember-tint);
  --focus-ring:     var(--ember-500);
  --status-go:      var(--go-500);
  --status-warn:    var(--warn-500);
  --status-stop:    var(--stop-500);
  --status-info:    var(--info-500);
  --status-live:    var(--signal);
  --elevation-raised: var(--e-raised);
  --elevation-overlay: var(--e-overlay);
}

[data-theme="marketing"], .theme-marketing {
  /* ---------- SEMANTIC ROLES — dark marketing surface ---------- */
  --surface:        var(--warm-950);
  --surface-sunken: #060606;
  --surface-raised: var(--warm-900);
  --hairline:       rgba(245, 242, 234, 0.10);
  --ink:            var(--warm-100);
  --ink-muted:      var(--warm-500);
  --accent:         var(--ember-500);
  --accent-hover:   var(--ember-400);
  --accent-ink:     #FFFFFF;
  --accent-tint:    var(--ember-tint);
  --focus-ring:     var(--ember-400);
  --elevation-raised: none;
  --elevation-overlay: 0 16px 48px rgba(0,0,0,0.5);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not([data-theme="marketing"]) {
    /* Future: an app dark theme. Phase 0 keeps app light regardless of OS setting
       by having the shell wrapper set data-theme="light" explicitly. This block
       exists only so the structure is present. */
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Notes:
- Components reference **semantic roles only** (`var(--surface)`, `var(--accent)`), never primitives.
- The marketing surface is opt-in per subtree via `class="theme-marketing"` or `data-theme="marketing"`. The app shell wrapper sets `data-theme="light"` explicitly so OS dark mode does not bleed into the app before an app-dark theme is designed.
- `layout.tsx` `<html>` loses its hardcoded `dark` class and hex `<body>` styles; `<body>` gets `bg-[var(--surface)] text-[var(--ink)]`.

### 5.2 Tailwind config

`tailwind.config.ts` `theme.extend` references variables only:

```
colors: {
  surface: 'var(--surface)',
  'surface-sunken': 'var(--surface-sunken)',
  'surface-raised': 'var(--surface-raised)',
  hairline: 'var(--hairline)',
  ink: 'var(--ink)',
  'ink-muted': 'var(--ink-muted)',
  accent: { DEFAULT: 'var(--accent)', hover: 'var(--accent-hover)', ink: 'var(--accent-ink)', tint: 'var(--accent-tint)' },
  status: { go: 'var(--status-go)', warn: 'var(--status-warn)', stop: 'var(--status-stop)', info: 'var(--status-info)', live: 'var(--status-live)' },
  viz: { 1: 'var(--viz-1)', 2: 'var(--viz-2)', 3: 'var(--viz-3)', 4: 'var(--viz-4)', 5: 'var(--viz-5)', 6: 'var(--viz-6)' },
},
fontFamily: {
  display: ['var(--font-clash)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  editorial: ['var(--font-zodiak)', 'Georgia', 'serif'],
  sans: ['var(--font-switzer)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  mono: ['var(--font-jbmono)', 'ui-monospace', 'monospace'],
},
fontSize: { xs:'var(--text-xs)', sm:'var(--text-sm)', base:'var(--text-base)', md:'var(--text-md)', lg:'var(--text-lg)', xl:'var(--text-xl)', '2xl':'var(--text-2xl)', '3xl':'var(--text-3xl)', '4xl':'var(--text-4xl)', '5xl':'var(--text-5xl)', '6xl':'var(--text-6xl)' },
borderRadius: { sm:'var(--r-sm)', md:'var(--r-md)', lg:'var(--r-lg)', pill:'var(--r-pill)' },
boxShadow: { raised:'var(--elevation-raised)', overlay:'var(--elevation-overlay)' },
transitionTimingFunction: { standard:'var(--ease-standard)', out:'var(--ease-out)' },
transitionDuration: { fast:'var(--dur-fast)', DEFAULT:'var(--dur)', slow:'var(--dur-slow)' },
```

The `juniper` / `champagne` / `gold` / `noir` / `hsl(var(--…))` blocks are deleted. `darkMode` stays `['class']` but the app does not use it in Phase 0.

### 5.3 Typed accessor + parity guard

- `admin-web/lib/design/tokens.ts` exports typed objects (`color`, `space`, `radius`, `duration`, `easing`, `viz`) mirroring the CSS values — used only where JS genuinely needs a raw value (a GSAP tween that cannot read a CSS var, a canvas fill).
- `admin-web/tests/token-parity.test.ts` (vitest) parses `globals.css`, extracts the `:root` custom properties, and asserts every key/value in `tokens.ts` matches. Fails the build on drift.
- Add `vitest` as a devDependency and a `"test": "vitest run"` script. This is the only test infra Phase 0 introduces.

---

## 6. Typography

Self-hosted via `next/font/local`. Font files (`.woff2`) placed under `admin-web/public/fonts/`. A `admin-web/lib/fonts.ts` module exports the four `next/font/local` instances and their CSS-variable bindings (`--font-clash`, `--font-zodiak`, `--font-switzer`, `--font-jbmono`), applied on `<body>` in `layout.tsx`.

| Role | Family | Weights | Usage | Never used for |
|---|---|---|---|---|
| Kinetic display | **Clash Display** | 500, 600 | Landing hero, marketing section titles, large in-app page titles (`text-2xl`+) | Body copy, table cells, form labels |
| Editorial serif | **Zodiak** | 400, 400 italic | Marketing storytelling paragraphs, pull quotes, section intros | **Anything inside the application shell** |
| Body / UI | **Switzer** | 400, 500, 600 | All application text, all body copy, forms, tables, nav | Display headlines above `text-xl` |
| Mono / telemetry | **JetBrains Mono** | 400, 500 | Real IDs, confirmation codes, latency values, tool names, JSON in the agent stream | Decorative labels, section eyebrows, buttons |

### Type ramp

| Token | Size | Line-height | Tracking | Typical use |
|---|---|---|---|---|
| `display-hero` | `--text-6xl` | 1.02 | -0.02em | Landing hero (marketing) |
| `display-1` | `--text-4xl` | 1.08 | -0.02em | Marketing section titles |
| `title-1` | `--text-2xl` | 1.15 | -0.01em | App page title |
| `title-2` | `--text-xl` | 1.2 | -0.01em | Card / section heading |
| `body-lg` | `--text-md` | 1.5 | 0 | Marketing body (Zodiak) |
| `body` | `--text-base` | 1.5 | 0 | App body default (Switzer) |
| `label` | `--text-sm` | 1.3 | 0 | Form labels, table headers |
| `caption` | `--text-xs` | 1.35 | 0.01em | Secondary metadata |
| `mono` | `--text-sm` | 1.4 | 0 | Telemetry (JetBrains Mono) |

App text lives in `caption`–`title-1`. Marketing owns `display-*`. Eyebrow/all-caps labels are allowed sparingly at `caption` with `0.08em` tracking, Switzer 600 — **not** mono, **not** on every page.

---

## 7. Colour system usage rules

- **`--accent` (ember)** — primary actions, active nav, focus rings, the one highlight per view. One accent element should dominate; if two things are ember on a screen, one is wrong.
- **`--status-live` (signal `#FF5A1F`)** — only: an agent step currently executing, a booking that is en-route right now, a live voice call. Never a static badge, never a CTA.
- **`--status-go / warn / stop / info`** — state communication only (booking status, validation, connectivity). Muted tones; never neon.
- **Craft layer (`--tile / --terracotta / --brass / --plaster`)** — marketing subtree only, enforced by living under `.theme-marketing`. Used in photography duotone treatment, editorial section grounds, and small material accents. Never in app UI, never as a data-series colour.
- **`--viz-*`** — the only palette for categorical data (charts, leaderboards, provider-category coding) in later phases. Assigned in fixed order; never swapped for role colours.
- Contrast: body text pairs must meet WCAG AA (4.5:1); large text and non-text UI meet 3:1. `--ink-muted` on `--surface` and on `--surface-sunken` are both verified in the `/foundations` contrast block.

---

## 8. Motion system

### 8.1 Libraries

- `gsap`, `gsap/ScrollTrigger`, `gsap/SplitText` — installed. Registered once in `admin-web/lib/motion/gsap.ts` (`'use client'`; guards against double-registration; wraps `useGSAP`-style cleanup). **Marketing/landing only.** Phase 0 uses it for exactly one demo block on `/foundations` (a scroll-pinned text reveal) to prove the wiring.
- `framer-motion` (already installed) — application surfaces only, and only for: (a) staggered entrance of real agent-event items, (b) list add/remove/reorder, (c) route-level transitions that aid orientation. A shared `admin-web/lib/motion/variants.ts` holds the small approved set of variants; ad-hoc `motion` props outside these are a review failure.

### 8.2 Rules

- One duration + one easing per interaction class: hovers/toggles `--dur-fast` `--ease-standard`; panels/dialogs `--dur` `--ease-standard`; marketing reveals `--dur-slow` `--ease-out`.
- `prefers-reduced-motion` is handled globally (section 5.1) and additionally checked in JS before any GSAP timeline or framer variant with transform/scroll — those degrade to opacity-only or no-op.
- **No component animates to imply activity, progress, or a pipeline running unless it receives a real event/prop describing that activity.** The Phase 0 agent-activity primitives take data and render it; they own no timers, no intervals, no fake step progression. (This directly replaces the `setTimeout(350/700/1050)` fake pipeline and the fabricated-on-error booking in today's `/services` page — that page is deleted in its phase, but the rule is set now.)

---

## 9. Component primitives

### 9.1 shadcn/ui

Initialise shadcn/ui (`npx shadcn@latest init`) against the existing `components.json` (update `baseColor` handling — we override with our own token classes; `cssVariables: true` stays). Generate and then restyle to tokens:

`button`, `input`, `textarea`, `label`, `select`, `checkbox`, `switch`, `radio-group`, `dialog`, `sheet`, `dropdown-menu`, `popover`, `tooltip`, `tabs`, `table`, `badge`, `card`, `skeleton`, `scroll-area`, `avatar`, `separator`, `command`, `sonner`.

Restyle pass: every generated component's classes are rewritten to use `surface / surface-raised / hairline / ink / ink-muted / accent / radius / shadow` tokens. No `slate-*`, no `zinc-*`, no arbitrary hex left in `components/ui/*`.

Delete `components/ui/badge.tsx`, `button.tsx`, `card.tsx`, `table.tsx` (hand-rolled), `MagneticButton.tsx`, `SpotlightCard.tsx`, `Toaster.tsx` (replaced by `sonner`). `lib/utils.ts` `cn()` is kept.

### 9.2 Composed app primitives

`admin-web/components/primitives/`:

| Component | Purpose | Required states |
|---|---|---|
| `page-header.tsx` | Page title + optional one-line description + optional action slot. Deliberately plain: no eyebrow badge, no blurb paragraph, no blur decoration. | — |
| `stat-tile.tsx` | A single real metric: value, label, optional delta, optional unit. | `loading` (skeleton), `no-data` (renders "—" with a muted "no data yet", never a fake number) |
| `stat-row.tsx` | Horizontal group of 2–4 `stat-tile`s. Guardrail: throws in dev if given more than 4. | inherits |
| `empty-state.tsx` | Title, body, optional action. Used wherever a list/table can be empty. | — |
| `data-table.tsx` | Thin wrapper over shadcn `table` + `scroll-area`: sticky header, column config, `loading` and `empty` slots, right-aligned numerics in mono. | `loading`, `empty` |
| `timeline.tsx` | Ordered vertical steps with a connector. Pure presentational. | `pending` / `active` / `done` / `error` per item (driven by props only) |
| `agent-event-item.tsx` | One real agent/tool event: agent name, tool name (mono), status, summary, optional expand for I/O JSON, timestamp. **No timers.** | `running` (uses `--status-live`), `succeeded`, `failed`, `needs-approval`, `question` |
| `tool-call-chip.tsx` | Compact inline representation of a tool invocation: tool name (mono) + status dot. | `running`, `ok`, `error` |
| `status-badge.tsx` | Booking/connectivity/verification status → `--status-*` colour + label. | maps every known status enum; unknown → neutral |

`agent-event-item`, `tool-call-chip`, and `timeline` are built against the **Phase 2 event contract types** (section 10) so Phase 3 can wire them to the real stream with no shape changes.

### 9.3 Application shell

Replace `components/layout/AppShell.tsx` (462 lines) with `components/layout/`:

- `app-shell.tsx` — server component wrapper; sets `data-theme="light"`; renders `sidebar` + `topbar` + `<main>`; delegates auth to `auth-gate.tsx`.
- `sidebar.tsx` — logo, role-scoped nav (nav definitions move to `lib/nav.ts`, typed, one per role), current-user block, sign-out. **Removed:** the "Gateway Health / Supabase Active Pool / Orchestrator 5 Agents / Voice RTC Vapi 16kHz" fabricated status card.
- `topbar.tsx` — page context + user menu. **Removed:** the "ISB · KHI · LHE Clustered" fake pill and "Active Persona" decoration.
- `auth-gate.tsx` — **stub** for Phase 0: reads the fixture persona from a dev-only switcher (see 10.3), renders children or a plain "sign in" placeholder. Phase 1 replaces this with Clerk + `middleware.ts`. The RBAC `isUnauthorized` logic is preserved in shape so Phase 1 can make it real.

The shell renders on `--surface` (light). Nav active state uses `--accent`. Borders are `--hairline`. No shadows except the user-menu popover (`--elevation-overlay`).

---

## 10. Data source of truth

### 10.1 Contracts

`admin-web/lib/contracts/` — TypeScript types that are the **shared shape** between Phase 0 fixtures and the real APIs of Phases 2–5. One file per aggregate:

- `user.ts` — `AppUser`, `UserRole` (`'admin' | 'provider' | 'customer'`), profile fields.
- `provider.ts` — `Provider`, `ProviderCategory`, `ProviderSlot`, `ProviderStats`.
- `city.ts` — `City` (Islamabad, Karachi, Lahore) + areas.
- `booking.ts` — `Booking`, `BookingStatus` (`'confirmed' | 'en_route' | 'arrived' | 'completed' | 'cancelled'`), `BookingToken`.
- `session.ts` — `AgentSession`, `IntentResult`.
- `agent-event.ts` — **the Phase 2 streaming contract, defined now:** `AgentEvent` discriminated union — `agent_started`, `tool_call_started`, `tool_call_result`, `info_found`, `question_required`, `approval_required`, `agent_completed`, `error` — each with `sessionId`, `step`, `agentName`, `toolName?`, `payload`, `summary`, `timestamp`, `durationMs?`.

These types are derived from the existing `PRD.md` §7/§8/§11 and `lib/api.ts` interfaces, reconciled into one canonical set. `lib/api.ts`'s ad-hoc interfaces are re-exported from / replaced by these.

### 10.2 Fixtures

`admin-web/lib/fixtures/`:

- `personas.ts` — the three canonical users, defined once, replacing `PRESET_USERS`:
  - Admin: **Ayesha Malik**, Operations, Blue Area Islamabad.
  - Provider: **Tariq Mehmood**, AC & HVAC, Sector G-13 Islamabad.
  - Customer: **Zubair Khan**, Gulshan-e-Iqbal Karachi.
- `providers.ts` — a roster of ~10 providers across the 3 cities and 5 trades (AC Technician, Plumber, Electrician, Cleaner, Tutor). **One identity per provider** — the `services/page.tsx` "Auto ECU / Academic STEM" inventions and the `ROSTER_ARTISANS` duplicates are dropped. Tariq Mehmood appears here as the same person as in `personas.ts`.
- `cities.ts` — Islamabad / Karachi / Lahore with real area lists.
- `bookings.ts` — a small set of bookings referencing real personas + providers, covering every `BookingStatus`.
- `sessions.ts` — 2–3 sample `AgentSession`s with realistic `AgentEvent[]` sequences (including one `question_required` and one `approval_required`) shaped exactly as the Phase 2 stream will emit.
- `index.ts` — barrel; also a `getFixtures()` helper so later phases can swap the import for a fetch with one edit per call site.

Every hardcoded array in the current pages (`CUSTOMER_LEADERBOARD`, `PROVIDER_LEADERBOARD`, `ROSTER_ARTISANS`, `PRESET_QUERIES`, `activeOrder`, fake GMV/latency literals) is either moved here or deleted. Pages are not otherwise rebuilt in Phase 0, but any that import removed symbols get the import repointed to fixtures (mechanical, no layout change).

### 10.3 Dev persona switcher

`components/dev/persona-switcher.tsx` — a small fixed-corner control, rendered only when `process.env.NODE_ENV !== 'production'`, that sets the active fixture persona in `auth-gate.tsx`. This preserves the "switch role to test" convenience during Phases 0–2 without shipping it. Removed or gated behind a flag once Clerk lands.

### 10.4 Backend seed

`backend/app/db/seed.py` trimmed to mirror the canonical set: the 3 personas + the ~10 fixture providers (same names, cities, categories) + 7 days of slots. The current 5-user / 11-provider list with drifting names is replaced. No schema changes. This keeps the eventual real API responses consistent with what the fixtures trained the UI on.

---

## 11. Cleanup checklist

**Delete (dead components, ~1,450 LOC):**
- `admin-web/components/landing/AgentSymphony.tsx`
- `admin-web/components/landing/AuditObservability.tsx`
- `admin-web/components/landing/ProofStrip.tsx`
- `admin-web/components/landing/ServiceBentoGrid.tsx`
- `admin-web/components/landing/VoiceShowcase.tsx`

**Delete (superseded primitives):**
- `admin-web/components/ui/badge.tsx`, `button.tsx`, `card.tsx`, `table.tsx`, `MagneticButton.tsx`, `SpotlightCard.tsx`, `Toaster.tsx`

**Rewrite:**
- `admin-web/app/globals.css` — becomes the token layer (section 5.1). Google Fonts `@import` removed. `.catalis-*` utility classes removed (unused after shell rebuild; any remaining reference in a not-yet-rebuilt page is swapped for a plain equivalent).
- `admin-web/tailwind.config.ts` — variable-referencing theme only (section 5.2).
- `admin-web/app/layout.tsx` — no `dark` class, no hex body styles; applies the four font variables; wraps in the light app theme; `AppShell` import repointed.
- `admin-web/lib/api.ts` — interfaces replaced by `lib/contracts` re-exports (fetch functions untouched functionally).

**Leave for their phase (transitional, still compiles):** all `app/**/page.tsx` feature pages except `app/foundations/page.tsx` (new) and the shell. `lib/auth-context.tsx` stays until Phase 1 but its `PRESET_USERS` data moves to `lib/fixtures/personas.ts` and it imports from there.

---

## 12. `/foundations` page

`admin-web/app/foundations/page.tsx` — not linked from product nav; reachable by URL. Sections:

1. **Colour** — every semantic role as a swatch with name, resolved value, and on-`surface` / on-`surface-sunken` contrast ratios (AA/AAA pass markers). Craft layer shown under a `.theme-marketing` block.
2. **Typography** — the full type ramp rendered in its assigned family, plus a marketing (Zodiak) paragraph and an app (Switzer) paragraph side by side, plus a mono telemetry sample.
3. **Space & radius** — the scales visualised.
4. **Elevation** — `raised` and `overlay` on both surfaces.
5. **Motion** — one hover-transition demo, one framer list add/remove demo, one GSAP `ScrollTrigger` + `SplitText` pinned text reveal (the only GSAP in Phase 0), each with a note on reduced-motion behaviour.
6. **shadcn primitives** — every generated component in its variants and states.
7. **Composed primitives** — `page-header`, `stat-tile` (incl. `loading` and `no-data`), `stat-row`, `empty-state`, `data-table` (incl. `loading` and `empty`), `timeline`, `agent-event-item` (all five states, fed from `fixtures/sessions.ts`), `tool-call-chip`, `status-badge`.
8. **Shell** — a framed live render of the rebuilt sidebar + topbar.

---

## 13. File & directory plan

```
admin-web/
  app/
    globals.css                    # rewritten — token SoT
    layout.tsx                     # cleaned
    foundations/page.tsx           # new
  components/
    ui/                            # shadcn-generated, token-styled
    layout/
      app-shell.tsx                # new (replaces AppShell.tsx)
      sidebar.tsx
      topbar.tsx
      auth-gate.tsx                # stub; Phase 1 makes real
    primitives/
      page-header.tsx  stat-tile.tsx  stat-row.tsx  empty-state.tsx
      data-table.tsx   timeline.tsx   agent-event-item.tsx
      tool-call-chip.tsx  status-badge.tsx
    dev/
      persona-switcher.tsx         # dev-only
  lib/
    fonts.ts                       # next/font/local x4
    nav.ts                         # typed role nav definitions
    utils.ts                       # keep cn()
    api.ts                         # interfaces -> contracts re-export
    design/tokens.ts               # typed accessor
    motion/
      gsap.ts                      # single registration boundary
      variants.ts                  # approved framer variants
    contracts/
      index.ts user.ts provider.ts city.ts booking.ts session.ts agent-event.ts
    fixtures/
      index.ts personas.ts providers.ts cities.ts bookings.ts sessions.ts
  public/fonts/                    # self-hosted woff2 (Clash, Zodiak, Switzer, JetBrains Mono)
  tests/
    token-parity.test.ts
  tailwind.config.ts               # variable-referencing theme
  components.json                  # updated
  package.json                     # + gsap plugins, vitest, shadcn deps; test script
  vitest.config.ts                 # new

backend/
  app/db/seed.py                   # trimmed to canonical set
```

Files deleted: listed in section 11.

---

## 14. Verification

Run and record results:

1. `cd admin-web && npx tsc --noEmit` → exits 0.
2. `cd admin-web && npm run build` → succeeds; no new warnings about missing modules/tokens.
3. `cd admin-web && npm run test` → `token-parity.test.ts` passes.
4. `axe` (via `@axe-core/cli` or a Playwright a11y check) on `/foundations` and on a shell-wrapped page → no serious or critical violations; document any moderate ones.
5. Manual review: `/foundations` in a light context and its `.theme-marketing` block in dark — confirm the ember accent reads as restrained/craft (not neon), type hierarchy is real, no blob/glow/emoji regressions, motion respects reduced-motion when toggled at OS level.
6. `grep` confirms zero remaining references to deleted components and to `juniper|champagne|--catalis|Instrument Serif|fonts.googleapis`.

---

## 15. Risks & mitigations

| Risk | Mitigation |
|---|---|
| `shadcn init` overwrites `globals.css` / `tailwind.config.ts` | Run init first, then hand-author the token layer and config over whatever it generates; the parity test + build catch mistakes. |
| Self-hosted font licensing | All four families are free for commercial use and self-hostable (Fontshare/ITF for Clash Display, Zodiak, Switzer; JetBrains Mono is OFL). Font files committed under `public/fonts/` with their license files. |
| GSAP `SplitText` was formerly a paid plugin | As of 2025 the full GSAP toolset including `SplitText` is free; install from npm `gsap@^3.13`. Bump the pinned version. |
| Transitional feature pages look inconsistent mid-program | Accepted and expected (section 3). They are auth-gated and scheduled for full rebuild in Phases 1/3/4/5. |
| `next/font/local` + CSS variable names must match Tailwind + token expectations | `lib/fonts.ts` is the single place binding `--font-*`; `tailwind.config.ts` references the same names; `/foundations` typography section is the visual check. |
| App accidentally inherits OS dark mode before an app-dark theme exists | Shell wrapper sets `data-theme="light"` explicitly; the `prefers-color-scheme` block is intentionally empty in Phase 0. |

---

## 16. Definition of done

- All Section 2 success criteria met and Section 14 verification recorded in the phase's completion note.
- Spec committed. Implementation plan produced by the writing-plans skill and approved.
- No feature page rebuilt beyond the shell; no auth, agent-backend, or landing work started.
