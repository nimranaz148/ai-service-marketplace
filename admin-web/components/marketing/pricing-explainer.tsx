"use client";

import * as React from "react";
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

// Derived once from the fixture: skip trades with no providers.
const RATE_ROWS = TRADES.map((t) => {
  const price = cheapestPriceLabel(t.id);
  return price
    ? { id: t.id, text: `${PROVIDER_CATEGORY_LABEL[t.id]} — ${price}` }
    : null;
}).filter((r): r is { id: ProviderCategory; text: string } => r !== null);

/**
 * PricingExplainer — one honest "how pricing works" block: per job, no
 * subscription, rate shown before you confirm. Starting rates are pulled from
 * the providers fixture, not hardcoded. Rate rows stagger in on scroll.
 */
export function PricingExplainer() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const rowsRef = React.useRef<HTMLUListElement>(null);

  const build = React.useCallback<Parameters<typeof useScrollScene>[1]>(
    ({ gsap, el }) => {
      const rows = rowsRef.current
        ? Array.from(rowsRef.current.children)
        : [];
      if (!rows.length) return;
      gsap.from(rows, {
        opacity: 0,
        y: 12,
        stagger: 0.06,
        duration: 0.4,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    },
    [],
  );

  useScrollScene(sectionRef, build);

  return (
    <section id="pricing" ref={sectionRef} className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {copy.pricing.title}
        </h2>

        <ul className="mt-8 max-w-xl space-y-3 text-base text-ink">
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
        </div>
      </div>
    </section>
  );
}
