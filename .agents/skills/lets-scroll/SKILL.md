---
name: lets-scroll
description: >-
  Continuous 3D/cinematic camera flights, isometric world diorama landings,
  and frame-accurate scroll video and canvas scrubbing engine (scrub-engine.js).
---

# Let's Scroll: 3D & Cinematic Scroll Experiences

Use this skill when engineering advanced 3D camera journeys, isometric diorama landscapes, and frame-accurate canvas/video scroll scrubbing engines.

## Core Architectural Pillars

### 1. The Scroll Scrubbing Engine (`scrub-engine.js` Architecture)
- **Frame-Accurate Video/Canvas Scrubbing**:
  - Instead of decoding HTML5 video directly during high-speed wheel events (which causes severe keyframe lag and decoder stalling), decode frames into an offscreen canvas or pre-rendered image sprite sequence.
  - Compute normalized progress:
    ```js
    const progress = Math.min(Math.max((window.scrollY - sectionTop) / (sectionHeight - window.innerHeight), 0), 1);
    const targetFrame = Math.floor(progress * (totalFrames - 1));
    ```
  - Lerp current displayed frame to target frame using damped inertia:
    ```js
    currentFrame += (targetFrame - currentFrame) * 0.12;
    renderCanvasFrame(Math.round(currentFrame));
    ```

### 2. Continuous 3D Camera Flights
- **CSS 3D Perspective Matrix**:
  - Root container: `perspective: 1000px; transform-style: preserve-3d; perspective-origin: 50% 50%;`
  - Camera translation: Move scene elements along the Z-axis towards the viewer as the user scrolls (`translateZ(scrollProgress * 2000px)`).
  - Depth Culling: Set `opacity: 0; pointer-events: none;` on elements once their `translateZ` crosses the camera clipping plane (> 200px past viewer).

### 3. Isometric Diorama Landings
- **Spatial Rotation & Lighting**:
  - Base rotation: `rotateX(55deg) rotateZ(-45deg)` creates the signature isometric axonometric projection.
  - Multi-layer elevation: Float cards, trees, buildings, or infrastructure layers at varying `translateZ(20px)`, `translateZ(60px)`, `translateZ(120px)`.
  - Dynamic ambient shadows: Invert `box-shadow` offset proportionally to the tilt angle so shadows cast realistically across the ground plane.

### 4. 60fps GPU Performance Standards
- **Zero Layout Thrashing**: Never query `getBoundingClientRect()` inside the scroll event handler or RAF loop. Measure once on mount and resize.
- **Strict Compositor Properties**: Only animate `transform` and `opacity`.
- **Pre-allocation**: Pre-allocate typed arrays and reusable vectors to avoid triggering V8 garbage collection mid-flight.
- **Scroll Unpinning**: Decouple scroll position from document height when unpinning sticky stages to prevent harsh visual snapping.
