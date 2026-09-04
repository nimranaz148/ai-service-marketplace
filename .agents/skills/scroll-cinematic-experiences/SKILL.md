---
name: scroll-cinematic-experiences
description: >-
  GSAP ScrollTrigger & Framer Motion scroll-driven narratives, parallax depth layers,
  pinned/sticky sections, 60fps GPU optimization, scrub engine, and 3D camera flights.
---

# Scroll & Cinematic Experiences Skill

Use this skill when building world-class scroll-driven narratives, cinematic landings, and high-performance visual storytelling.

## Core Capabilities & Rules

### 1. GSAP ScrollTrigger & Pinned Sections
- **Pinned Sections**: Pin hero/product showcases using ScrollTrigger with scrubbed progress.
- **Layer Stacking (Parallax Depth)**: Use multi-layer transform translates with varying depth multipliers (0.2x, 0.5x, 1.2x).
- **Hardware Acceleration**: Always animate transform (x, y, scale, rotation) and opacity exclusively. Never animate top, left, margin, or padding directly.
- **will-change Discipline**: Apply will-change: transform only during active scroll/interaction and remove on idle to conserve GPU memory.

### 2. Framer Motion Scroll Drivers
- Use useScroll and useTransform hooks paired with useSpring for fluid easing:
  `useSpring(transform, { stiffness: 300, damping: 30, restDelta: 0.001 })`

### 3. Reduced Motion Compliance
- Always support prefers-reduced-motion queries gracefully.
