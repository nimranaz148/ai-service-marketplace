"use client";

import Lenis from "lenis";
import { getGsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenis: Lenis | null = null;
let rafId = 0;

export function startLenis() {
  if (lenis || typeof window === "undefined" || prefersReducedMotion()) return;
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  const gsap = getGsap();
  const loop = (time: number) => { lenis?.raf(time * 1000); rafId = requestAnimationFrame(loop); };
  gsap.ticker.lagSmoothing(0);
  rafId = requestAnimationFrame(loop);
}

export function stopLenis() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
  lenis?.destroy();
  lenis = null;
}
