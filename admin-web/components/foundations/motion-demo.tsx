"use client";

import { useEffect, useRef } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/motion/gsap";

export function MotionDemo() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const gsap = getGsap();
    const tween = gsap.from(ref.current, {
      yPercent: 20,
      opacity: 0,
      duration: 0.26,
      ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 80%" },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section>
      <h2 className="font-display text-2xl text-ink">Motion</h2>
      <p className="mt-2 text-sm text-ink-muted">
        The only GSAP in Phase 0: a scroll-triggered text reveal (marketing pattern). Respects reduced-motion.
      </p>
      <div className="mt-6 overflow-hidden py-8">
        <h3 ref={ref} className="font-display text-4xl text-ink">Cinematic, but only where it earns its place.</h3>
      </div>
    </section>
  );
}
