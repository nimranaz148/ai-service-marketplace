---
name: emil-animations-motion
description: >-
  Physics-based UI animations, spring dynamics, tactile micro-interactions,
  hardware-accelerated layout transitions, and motion orchestration.
---

# Emil Kowalski Animation & Micro-Interactions Skill

Use this skill to build tactile, physics-based UI micro-interactions and smooth layout transitions.

## Motion Standards

### 1. Spring Physics Over Duration Easing
- Use spring physics for interactive elements (buttons, modals, drag sheets):
  - **Quick & Snappy**: `{ type: 'spring', stiffness: 400, damping: 30 }` (Dropdowns, buttons, tooltips).
  - **Smooth & Weighted**: `{ type: 'spring', stiffness: 200, damping: 25 }` (Drawers, page transitions).

### 2. Micro-Interactions & Tactile Feedback
- Active click states: `whileTap={{ scale: 0.97 }}`.
- Subtle hover lifts: `whileHover={{ y: -2, transition: { duration: 0.15 } }}`.
- Coordinated Stagger: Orchestrate lists with `staggerChildren: 0.05`.
