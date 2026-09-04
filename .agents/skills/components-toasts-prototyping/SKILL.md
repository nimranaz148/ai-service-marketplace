---
name: components-toasts-prototyping
description: >-
  Radix UI primitives, shadcn/ui components, Sonner interactive toasts,
  action notifications, and rapid flow prototyping.
---

# Components, Toasts & Prototyping Skill

Use this skill to assemble high-reliability UI component trees using Radix UI, shadcn/ui, and Sonner.

## Best Practices

### 1. Radix & shadcn/ui Composition
- Keep components unstyled-first, accessible, with full keyboard navigation.
- Use Compound Component patterns for complex dialogs, popovers, and accordions.

### 2. Sonner Toasts
- Promise-based toasts for async workflows:
  `toast.promise(saveData(), { loading: 'Saving...', success: 'Saved!', error: 'Could not save' })`
