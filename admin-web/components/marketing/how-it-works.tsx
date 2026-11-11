"use client";

import * as React from "react";
import { SplitText } from "gsap/SplitText";
import { copy } from "@/lib/marketing/copy";
import { useScrollScene } from "@/lib/motion/use-scroll-scene";
import { ChatCircleDots, UserCheck, MapPinLine } from "@phosphor-icons/react";

const STEP_ICONS = [ChatCircleDots, UserCheck, MapPinLine] as const;

const STEPS = copy.howItWorks.steps;

/**
 * HowItWorks — three step cards. The real step numbers are the mount-time state
 * on server and client alike (no placeholder zero in the prerendered HTML, no
 * hydration mismatch under prefers-reduced-motion). When motion is allowed the
 * numbers dip to 0 and count back up to the same values once on scroll-in.
 */
export function HowItWorks() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const listRef = React.useRef<HTMLOListElement>(null);
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
          if (headingRef.current) {
            const split = new SplitText(headingRef.current, { type: "lines" });
            gsap.from(split.lines, {
              yPercent: 100,
              opacity: 0,
              stagger: 0.06,
              duration: 0.5,
              ease: "power3.out",
            });
          }
          if (listRef.current) {
            gsap.from(Array.from(listRef.current.children), {
              y: 32,
              opacity: 0,
              stagger: 0.1,
              duration: 0.6,
              ease: "power3.out",
              delay: 0.15,
            });
          }

          setCounts(STEPS.map(() => 0));
          STEPS.forEach((step, i) => {
            const box = { v: 0 };
            gsap.to(box, {
              v: step.n,
              snap: { v: 1 },
              duration: 0.8,
              ease: "power1.out",
              delay: 0.4,
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
        <div className="overflow-hidden">
          <h2
            ref={headingRef}
            className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            {copy.howItWorks.title}
          </h2>
        </div>

        <ol ref={listRef} className="relative mt-12 grid gap-6 md:grid-cols-3">
          <div aria-hidden className="pointer-events-none absolute left-[16%] right-[16%] top-[3.1rem] hidden border-t-2 border-dashed border-status-live-line md:block" />
          {STEPS.map((step, i) => (
            <li
              key={step.n}
              className="group relative rounded-lg border border-hairline bg-surface-raised p-6 transition-all duration-slow ease-out hover:-translate-y-1 hover:border-accent hover:shadow-overlay"
            >
              {(() => {
                const Ico = STEP_ICONS[i];
                return (
                  <div className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-md bg-accent-tint text-accent transition-transform duration-slow group-hover:scale-110">
                    <Ico size={26} weight="duotone" aria-hidden />
                  </div>
                );
              })()}
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
