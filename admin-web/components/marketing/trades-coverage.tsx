"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/marketing/copy";
import { TRADES } from "@/lib/marketing/trades";
import { prefersReducedMotion } from "@/lib/motion/gsap";
import { useScrollScene } from "@/lib/motion/use-scroll-scene";

/**
 * TradesCoverage — narrative beat 2 (spec §5 row 5 ★, §7 pinned beats, §11 a11y).
 *
 * A horizontal strip of the 5 trades that scrubs sideways as the section is
 * pinned for ~1 viewport, followed by an honest cities block (no map theatre).
 *
 * Everything is in the DOM at all times and fully visible without JS. There is
 * no `opacity:0` in any className. Pin/scrub is enabled only after a client
 * check that motion is allowed AND the viewport is >= 768px; otherwise the strip
 * renders as a normal responsive grid, no `x` transform, and the section is
 * never a scroll trap (default pinSpacing, pin releases at `end`).
 */
export function TradesCoverage() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const stripRef = React.useRef<HTMLDivElement>(null);
  const chipsRef = React.useRef<HTMLUListElement>(null);

  const [canPin, setCanPin] = React.useState(false);

  React.useEffect(() => {
    const check = () => {
      setCanPin(
        !prefersReducedMotion() &&
          typeof window !== "undefined" &&
          !window.matchMedia("(max-width: 767px)").matches,
      );
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const build = React.useCallback<Parameters<typeof useScrollScene>[1]>(
    ({ gsap, ScrollTrigger, el }) => {
      if (!canPin) return;
      const strip = stripRef.current;
      if (!strip) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=1200",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      tl.to(strip, {
        x: () => -(strip.scrollWidth - strip.clientWidth),
        ease: "none",
      });

      if (chipsRef.current) {
        tl.from(
          Array.from(chipsRef.current.children),
          { autoAlpha: 0, y: 10, stagger: 0.06, duration: 0.25 },
          ">-0.1",
        );
      }
      // Hold the strip at its final X through the scrub tail.
      tl.to({}, { duration: 0.3 });

      void ScrollTrigger;
    },
    [canPin],
  );

  useScrollScene(sectionRef, build);

  return (
    <section id="trades" ref={sectionRef} className="bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-24 sm:px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {copy.trades.title}
        </h2>

        {/* Trade strip. Pinned: one horizontal flex row translated on x.
            Not pinned: a responsive grid, all 5 cards visible, no x transform. */}
        <div className={cn(canPin && "overflow-hidden")}>
          <div
            ref={stripRef}
            className={cn(
              canPin
                ? "flex gap-6 will-change-transform"
                : "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {TRADES.map((trade) => (
              <div
                key={trade.id}
                className={cn(
                  "rounded-lg border border-hairline bg-surface-raised p-6",
                  canPin && "w-72 shrink-0",
                )}
              >
                <trade.Icon className="h-6 w-6 text-accent" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold text-ink">{trade.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{trade.blurb}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cities block. No map graphic. */}
        <div className="space-y-3">
          <p className="font-sans text-xs uppercase tracking-wider text-ink-muted">
            {copy.trades.citiesLabel}
          </p>
          <ul ref={chipsRef} className="flex flex-wrap gap-2">
            {copy.trades.cities.map((city) => (
              <li
                key={city}
                className="rounded-md border border-hairline bg-surface-raised px-3 py-1 text-sm text-ink"
              >
                {city}
              </li>
            ))}
          </ul>
          <p className="text-sm text-ink-muted">{copy.trades.more}</p>
        </div>
      </div>
    </section>
  );
}
