"use client";

import Lenis from "lenis";
import { getGsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenis: Lenis | null = null;
let tickerFn: ((time: number) => void) | null = null;

/**
 * Drive Lenis from gsap's ticker rather than a hand-rolled rAF loop.
 *
 * gsap.ticker passes elapsed time in SECONDS and Lenis's raf() wants
 * MILLISECONDS, so `time * 1000` is the correct conversion here. (The previous
 * implementation used requestAnimationFrame directly — which already hands back
 * a millisecond timestamp — with the same *1000, blowing up Lenis's delta-time
 * maths and defeating all smoothing.)
 */
export function startLenis() {
  if (lenis || typeof window === "undefined" || prefersReducedMotion()) return;
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  const gsap = getGsap();
  tickerFn = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);
}

export function stopLenis() {
  if (tickerFn) {
    getGsap().ticker.remove(tickerFn);
    tickerFn = null;
  }
  // Restore gsap's own defaults so a route that leaves `/` is not left with
  // lag-smoothing permanently disabled.
  getGsap().ticker.lagSmoothing(500, 33);
  lenis?.destroy();
  lenis = null;
}
