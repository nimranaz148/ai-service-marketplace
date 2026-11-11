"use client";

import { useEffect } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Build = (ctx: { gsap: ReturnType<typeof getGsap>; ScrollTrigger: typeof ScrollTrigger; el: HTMLElement }) => void;

export function useScrollScene(ref: React.RefObject<HTMLElement>, build: Build) {
  useEffect(() => {
    if (prefersReducedMotion() || typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    const gsap = getGsap();
    const ctx = gsap.context(() => build({ gsap, ScrollTrigger, el }), el);
    return () => ctx.revert();
  }, [ref, build]);
}
