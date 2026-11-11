"use client";

import * as React from "react";
import { SplitText } from "gsap/SplitText";
import { copy } from "@/lib/marketing/copy";
import { TRADES } from "@/lib/marketing/trades";
import { providers } from "@/lib/fixtures";
import { PROVIDER_CATEGORY_LABEL, type ProviderCategory } from "@/lib/contracts";
import { useScrollScene } from "@/lib/motion/use-scroll-scene";

/** Leading numeric run of a priceLabel ("from PKR 15,000 / mo" -> 15000). */
function priceValue(label: string): number {
  return parseInt(label.replace(/[^\d]/g, "").slice(0, 6) || "0", 10);
}

/** Verbatim priceLabel of the cheapest provider in a category, or null if none. */
function cheapestPriceLabel(id: ProviderCategory): string | null {
  const ps = providers.filter((p) => p.category === id);
  if (!ps.length) return null;
  let best = ps[0];
  for (const p of ps) {
    if (priceValue(p.priceLabel) < priceValue(best.priceLabel)) best = p;
  }
  return best.priceLabel;
}

/** A recurring (monthly-package) rate, which this section's headline disclaims. */
function isMonthly(label: string): boolean {
  return /\/\s*mo\b/i.test(label);
}

// Derived once from the fixture: skip trades with no providers, and keep
// monthly-package rates out of the per-job list so the rate rows never
// contradict the "Per job. No subscription." headline above them.
const ALL_RATES = TRADES.map((t) => {
  const price = cheapestPriceLabel(t.id);
  return price
    ? { id: t.id, price, text: `${PROVIDER_CATEGORY_LABEL[t.id]} — ${price}` }
    : null;
}).filter(
  (r): r is { id: ProviderCategory; price: string; text: string } => r !== null,
);

const RATE_ROWS = ALL_RATES.filter((r) => !isMonthly(r.price));
const HAS_MONTHLY = ALL_RATES.some((r) => isMonthly(r.price));

/**
 * PricingExplainer — one honest "how pricing works" block: per job, no
 * subscription, rate shown before you confirm. Starting rates are pulled from
 * the providers fixture, not hardcoded. Rate rows stagger in on scroll.
 */
export function PricingExplainer() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const pointsRef = React.useRef<HTMLUListElement>(null);
  const rowsRef = React.useRef<HTMLUListElement>(null);

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
          if (pointsRef.current) {
            gsap.from(Array.from(pointsRef.current.children), {
              x: -16,
              opacity: 0,
              stagger: 0.08,
              duration: 0.5,
              ease: "power3.out",
              delay: 0.15,
            });
          }
          const rows = rowsRef.current
            ? Array.from(rowsRef.current.children)
            : [];
          if (rows.length) {
            gsap.from(rows, {
              opacity: 0,
              y: 12,
              stagger: 0.06,
              duration: 0.4,
              ease: "power2.out",
              delay: 0.35,
            });
          }
        },
      });
    },
    [],
  );

  useScrollScene(sectionRef, build);

  return (
    <section id="pricing" ref={sectionRef} className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="overflow-hidden">
          <h2
            ref={headingRef}
            className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            {copy.pricing.title}
          </h2>
        </div>

        <ul ref={pointsRef} className="mt-8 max-w-xl space-y-3 text-base text-ink">
          {copy.pricing.points.map((point) => (
            <li key={point} className="border-l-2 border-hairline pl-4">
              {point}
            </li>
          ))}
        </ul>

        <div className="mt-12 max-w-xl rounded-lg border border-hairline bg-surface-raised p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            {copy.pricing.ratesLabel}
          </p>
          <ul ref={rowsRef} className="mt-3 divide-y divide-hairline">
            {RATE_ROWS.map((row) => (
              <li key={row.id} className="py-2.5 text-sm text-ink">
                {row.text}
              </li>
            ))}
          </ul>
          {HAS_MONTHLY && (
            <p className="mt-3 text-sm text-ink-muted">
              {copy.pricing.monthlyNote}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
