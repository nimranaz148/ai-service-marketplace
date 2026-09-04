---
name: apple-hig-emil-craft
description: >-
  Apple Human Interface Guidelines (HIG) standards, sleek hardware-accelerated transitions,
  tactile physics feedback, and design engineering craft bridging Figma with Next.js/React.
---

# Apple HIG & Emil Kowalski Design Engineering Craft

Use this skill to elevate UI execution to Apple Human Interface quality, combining tactile direct manipulation with precision design engineering.

## 1. Apple Human Interface Guidelines (HIG) Principles

### Spatial Depth & Vibrancy
- **Materials over Flat Colors**: Use multi-layered backdrop blurs (`backdrop-blur-2xl`) with ultra-fine white borders (`border-white/10` to `border-white/20`) to emulate real-world glass and frosted sapphire.
- **Dynamic Lighting**: Light originates from the top-center. Upper card borders have higher opacity highlights than lower borders (`box-shadow: 0 1px 0 0 rgba(255,255,255,0.15) inset`).
- **Tactile Click Feedback**: Active states must respond immediately (< 16ms) with an organic scale depression (`scale: 0.96` to `0.97`) and subtle brightness dip (`brightness(0.95)`).

### Direct Manipulation
- **Finger/Cursor Follow**: Modals, bottom sheets, and swipeable elements must track cursor/touch input 1:1 without input lag.
- **Velocity-Aware Releases**: On drag release, elements preserve projectile momentum and snap into resting anchors using damped spring physics.

## 2. Design Engineering Craft (Figma to Next.js/React)

### Design Token Architecture
- Never hardcode arbitrary padding or margins (`p-[13px]`). Adhere strictly to the 4px/8px modular rhythm:
  - Micro: `gap-1` (4px), `gap-1.5` (6px), `gap-2` (8px)
  - Component: `p-3` (12px), `p-4` (16px), `p-5` (20px), `p-6` (24px)
  - Container: `p-8` (32px), `p-12` (48px), `p-16` (64px)
- **Nested Border Radii Rule**:
  - Inner radius must equal outer radius minus padding:
    `r_inner = max(r_outer - padding, 0)`
  - Prevents the awkward visual bulge of concentric mismatched rounded corners.

### Spring Dynamics Standard (Emil Kowalski Physics)
- **Snappy Button / Toggle**:
  ```ts
  { type: "spring", stiffness: 450, damping: 35 }
  ```
- **Fluid Drawer / Modal**:
  ```ts
  { type: "spring", stiffness: 280, damping: 28, mass: 0.8 }
  ```
- **Magnetic Pull**:
  ```ts
  { type: "spring", stiffness: 350, damping: 25 }
  ```

## 3. The Micro-Interaction Quality Audit
- **Pacing**: Never make an interactive feedback animation longer than 250ms unless it is a deliberate ceremonial moment (e.g. payment completed confetti).
- **Reduced Motion**: Gracefully substitute transform motion with instantaneous crossfades when `prefers-reduced-motion: reduce` is active.
