"use client";

import * as React from "react";
import { copy } from "@/lib/marketing/copy";
import { useScrollScene } from "@/lib/motion/use-scroll-scene";

const STEPS = copy.howItWorks.steps;

/**
 * HowItWorks — three step cards. The real step numbers are the mount-time state
 * on server and client alike (no placeholder zero in the prerendered HTML, no
 * hydration mismatch under prefers-reduced-motion). When motion is allowed the
 * numbers dip to 0 and count back up to the same values once on scroll-in.
 */
export function HowItWorks() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const [counts, setCounts] = React.useState<number[]>(() =>
    STEPS.map((s) => s.n),
  );

  const build = React.useCallback<Parameters<typeof useScrollScene>[1]>(
    ({ gsap, ScrollTrigger, el }) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        once: true,
        onEnter: () => {
          setCounts(STEPS.map(() => 0));
          STEPS.forEach((step, i) => {
            const box = { v: 0 };
            gsap.to(box, {
              v: step.n,
              snap: { v: 1 },
              duration: 0.8,
              ease: "power1.out",
              onUpdate: () => {
                setCounts((prev) => {
                  const next = prev.slice();
                  next[i] = Math.round(box.v);
                  return next;
                });
              },
            });
          });
        },
      });
    },
    [],
  );

  useScrollScene(sectionRef, build);

  return (
    <section id="how-it-works" ref={sectionRef} className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {copy.howItWorks.title}
        </h2>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li
              key={step.n}
              className="rounded-lg border border-hairline bg-surface-raised p-6"
            >
              <span
                aria-hidden="true"
                className="font-display block text-4xl font-semibold tabular-nums text-accent"
              >
                {counts[i]}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{step.h}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {step.p}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
