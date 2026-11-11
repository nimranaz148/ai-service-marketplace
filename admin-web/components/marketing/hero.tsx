"use client";

import * as React from "react";
import Link from "next/link";
import { SplitText } from "gsap/SplitText";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/marketing/copy";
import { getGsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { useScrollScene } from "@/lib/motion/use-scroll-scene";
import { RequestBox } from "./request-box";
import { DispatchMotif } from "./dispatch-motif";

/**
 * Hero — the opening beat. Headline splits into lines and reveals once on mount
 * (no ScrollTrigger); the dispatch motif drifts on a slow scroll parallax.
 *
 * No `opacity:0` / `opacity-0` lives in any className: GSAP `.from()` sets the
 * hidden state after mount, so no-JS and reduced-motion both paint full content.
 */
export function Hero() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const headlineRef = React.useRef<HTMLHeadingElement>(null);
  const motifRef = React.useRef<HTMLDivElement>(null);

  // Headline line-reveal: once, on mount, no scroll trigger.
  React.useEffect(() => {
    if (prefersReducedMotion() || !headlineRef.current) return;
    const gsap = getGsap();
    const split = new SplitText(headlineRef.current, { type: "lines" });
    const tween = gsap.from(split.lines, {
      yPercent: 100,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: "power3.out",
    });
    return () => {
      tween.kill();
      split.revert();
    };
  }, []);

  // Slow vertical parallax on the motif while the hero scrolls past.
  const buildParallax = React.useCallback<Parameters<typeof useScrollScene>[1]>(
    ({ gsap, el }) => {
      if (!motifRef.current) return;
      gsap.to(motifRef.current, {
        y: 48,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    [],
  );

  useScrollScene(sectionRef, buildParallax);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative overflow-hidden bg-surface"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-32 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:pt-40">
        <div className="space-y-6">
          <div className="overflow-hidden">
            <h1
              ref={headlineRef}
              className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
            >
              {copy.hero.headline}
            </h1>
          </div>

          <p className="font-editorial max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl">
            {copy.hero.sub}
          </p>

          <RequestBox variant="hero" className="max-w-xl" />

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className={cn(
                "inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground",
                "transition-colors hover:bg-[var(--accent-strong-hover)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
              )}
            >
              {copy.hero.ctaPrimary}
            </Link>
            <Link
              href="#how-it-works"
              className={cn(
                "inline-flex items-center rounded-md border border-hairline px-5 py-2.5 text-sm font-medium text-ink",
                "transition-colors hover:bg-surface-raised",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
              )}
            >
              {copy.hero.ctaSecondary}
            </Link>
          </div>
        </div>

        <div ref={motifRef} className="hidden lg:block">
          <DispatchMotif className="mx-auto max-w-md" />
        </div>
      </div>
    </section>
  );
}
