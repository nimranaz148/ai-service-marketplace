"use client";

import * as React from "react";
import { copy } from "@/lib/marketing/copy";
import { TRADES } from "@/lib/marketing/trades";
import { providers, cities } from "@/lib/fixtures";
import { useScrollScene } from "@/lib/motion/use-scroll-scene";
import { prefersReducedMotion } from "@/lib/motion/gsap";

// Every figure below is derived from the fixtures — nothing is invented.
const PROVIDER_COUNT = providers.length;
const CITY_COUNT = cities.length;
const TRADE_COUNT = TRADES.length;
const AVG_RATING =
  providers.reduce((a, p) => a + p.rating, 0) / providers.length;

/**
 * Proof — a small, honest credibility block. Four counts that all come straight
 * from the fixtures (verified providers, cities, trades, average rating), each
 * counter-tweening once when the section scrolls into view, plus two clearly
 * labelled illustrative quotes. No fabricated testimonials, logos, or metrics.
 */
export function Proof() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const reduced = prefersReducedMotion();

  const [providerDisplay, setProviderDisplay] = React.useState(
    reduced ? PROVIDER_COUNT : 0,
  );
  const [cityDisplay, setCityDisplay] = React.useState(
    reduced ? CITY_COUNT : 0,
  );
  const [tradeDisplay, setTradeDisplay] = React.useState(
    reduced ? TRADE_COUNT : 0,
  );
  const [avgDisplay, setAvgDisplay] = React.useState(
    reduced ? AVG_RATING.toFixed(1) : "0.0",
  );

  const build = React.useCallback<Parameters<typeof useScrollScene>[1]>(
    ({ gsap, el }) => {
      const scrollTrigger = { trigger: el, start: "top 80%", once: true };

      const countInt = (target: number, set: (n: number) => void) => {
        const box = { v: 0 };
        gsap.to(box, {
          v: target,
          snap: { v: 1 },
          duration: 0.9,
          ease: "power1.out",
          scrollTrigger,
          onUpdate: () => set(Math.round(box.v)),
        });
      };

      countInt(PROVIDER_COUNT, setProviderDisplay);
      countInt(CITY_COUNT, setCityDisplay);
      countInt(TRADE_COUNT, setTradeDisplay);

      const avgBox = { v: 0 };
      gsap.to(avgBox, {
        v: AVG_RATING,
        duration: 0.9,
        ease: "power1.out",
        scrollTrigger,
        onUpdate: () => setAvgDisplay(avgBox.v.toFixed(1)),
      });
    },
    [],
  );

  useScrollScene(sectionRef, build);

  const stats: { key: string; value: React.ReactNode; label: string }[] = [
    { key: "providers", value: providerDisplay, label: "verified providers" },
    { key: "cities", value: cityDisplay, label: "cities" },
    { key: "trades", value: tradeDisplay, label: "trades" },
    { key: "avg", value: avgDisplay, label: "avg rating" },
  ];

  return (
    <section id="proof" ref={sectionRef} className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {copy.proof.title}
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.key}
              className="rounded-lg border border-hairline bg-surface-raised p-5"
            >
              <p className="font-display text-3xl font-semibold text-ink tabular-nums">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {copy.proof.quotes.map((q) => (
            <blockquote
              key={q.who}
              className="font-editorial rounded-lg border border-hairline bg-surface-raised p-6 text-lg text-ink"
            >
              <p>{q.text}</p>
              <cite className="mt-3 block font-sans text-sm not-italic text-ink-muted">
                {q.who}
              </cite>
            </blockquote>
          ))}
        </div>

        <p className="mt-4 text-xs text-ink-muted">{copy.proof.quotesNote}</p>
      </div>
    </section>
  );
}
