---
name: swift-ios-native-patterns
description: >-
  Swift and SwiftUI native iOS design patterns, UIKit bridge, haptic feedback integration,
  and native mobile motion engineering based on Apple HIG and Emil Kowalski standards.
---

# Swift & SwiftUI Native iOS Patterns

Use this skill when implementing native iOS apps, SwiftUI architecture, UIKit bridge components, and fluid native motion.

## 1. SwiftUI Architecture & Declarative State
- **View Modeling**: Use `@Observable` macro (iOS 17+) or `@StateObject` / `@ObservedObject` for decoupled business logic.
- **Environment Values**: Inject global navigation, color scheme, and app storage cleanly via `@Environment`.

## 2. Fluid Native Motion & Transitions
- **Spring Animations**:
  ```swift
  withAnimation(.spring(response: 0.35, dampingFraction: 0.75, blendDuration: 0)) {
      isExpanded.toggle()
  }
  ```
- **Matched Geometry Effect**:
  ```swift
  .matchedGeometryEffect(id: item.id, in: namespace)
  ```
- **Interactive Drag Gestures**: Preserve velocity vector on `.onEnded` to calculate continuous momentum fling.

## 3. Core Haptics & Tactile Feedback
- **UIImpactFeedbackGenerator**:
  - Light impact on tab/item selection: `UIImpactFeedbackGenerator(style: .light).impactOccurred()`
  - Medium impact on confirmation: `UIImpactFeedbackGenerator(style: .medium).impactOccurred()`
  - Notification feedback: `UINotificationFeedbackGenerator().notificationOccurred(.success)`
