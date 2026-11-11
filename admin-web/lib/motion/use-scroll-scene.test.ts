import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { createRef } from "react";

const rm = { value: false };
vi.mock("@/lib/motion/gsap", () => ({
  prefersReducedMotion: () => rm.value,
  getGsap: () => ({ context: (fn: () => void) => { fn(); return { revert: vi.fn() }; } }),
}));

import { useScrollScene } from "./use-scroll-scene";

afterEach(() => { rm.value = false; });

it("calls build when motion is allowed", () => {
  const el = document.createElement("div");
  const ref = createRef<HTMLElement>();
  (ref as any).current = el;
  const build = vi.fn();
  renderHook(() => useScrollScene(ref, build));
  expect(build).toHaveBeenCalledOnce();
});

it("does not call build under reduced motion", () => {
  rm.value = true;
  const el = document.createElement("div");
  const ref = createRef<HTMLElement>();
  (ref as any).current = el;
  const build = vi.fn();
  renderHook(() => useScrollScene(ref, build));
  expect(build).not.toHaveBeenCalled();
});
