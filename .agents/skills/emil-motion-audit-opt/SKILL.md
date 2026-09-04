---
name: emil-motion-audit-opt
description: >-
  Audits UI screens for micro-interaction value, eliminates animation jank,
  inspects duration and pacing, enforces standardized motion terminology,
  and provides React Native / mobile motion patterns.
---

# Emil Kowalski Motion Audit & Optimization Skill

Use this skill when auditing an interface for motion quality, eliminating frame drops, and tuning pacing across web and mobile.

## 1. The Motion Audit Checklist

Audit every interactive state against these 5 diagnostic questions:
1. **Does this motion convey spatial continuity?** (Does the user understand *where* the element came from and *where* it went?)
2. **Is it faster than 250ms?** (If a user has to wait for an animation to finish before clicking again, it is a defect, not a delight.)
3. **Does it cause layout recalculation?** (Inspect DevTools Performance tab. If animating `height`, `width`, `top`, or `margin`, refactor immediately to `transform` and `opacity`.)
4. **Is there motion conflict?** (Do two overlapping elements animate with competing spring frequencies or clashing directions?)
5. **Does it respect `prefers-reduced-motion`?** (Must provide an instantaneous state change or subtle opacity fade for accessibility.)

## 2. Eliminating Jank & 60fps Optimization

### Strict Compositor Rules
- Animate only `transform` (`translate3d`, `scale3d`, `rotateZ`) and `opacity`.
- Use `will-change: transform` only when an interaction is pending or actively running, and remove it on idle.
- Avoid animating elements containing large un-rasterized drop shadows or massive backdrop blurs without hardware isolation (`transform: translateZ(0)`).

### Memory Leaks & RAF Loop Cleanup
- In GSAP and requestAnimationFrame loops, always cancel callbacks on component unmount:
  ```ts
  useEffect(() => {
    const ctx = gsap.context(() => { ... });
    return () => ctx.revert();
  }, []);
  ```

## 3. Standardized Motion Terminology

- **Orchestration**: The master timeline governing how multiple components enter, transition, or exit relative to each other.
- **Stagger**: Progressive time delay between sibling elements in a collection (optimal: `0.04s` to `0.06s` per item).
- **Exit/Enter Asymmetry**: Enter animations should be quick and snappy (`~180-220ms`), while exit animations should be faster and lighter (`~120-150ms`).

## 4. Mobile & React Native Motion Patterns

- Use **React Native Reanimated 3** with worklets running on the UI thread.
- Avoid bridging animation values across the JS thread during gestures.
- Pair `GestureDetector` with `withSpring(target, { damping: 20, stiffness: 200 })` for 120Hz ProMotion responsiveness on mobile devices.
