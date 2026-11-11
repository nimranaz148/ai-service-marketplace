"use client";

import * as React from "react";
import { copy } from "@/lib/marketing/copy";
import { TRADES } from "@/lib/marketing/trades";
import { providers, cities } from "@/lib/fixtures";
import { useScrollScene } from "@/lib/motion/use-scroll-scene";

// Every figure below is derived from the fixtures — nothing is invented.
const PROVIDER_COUNT = providers.length;
const CITY_COUNT = cities.length;
const TRADE_COUNT = TRADES.length;
const AVG_RATING =
  providers.reduce((a, p) => a + p.rating, 0) / providers.length;

/**
 * Proof — a small, honest credibility block. Four counts that all come straight
 * from the fixtures (verified providers, cities, trades, average rating). The
 * true figures render immediately; when motion is allowed they dip to zero and
 * count back up once as the section scrolls into view. Plus two clearly
 * labelled illustrative quotes. No fabricated testimonials, logos, or metrics.
 */
export function Proof() {
  const sectionRef = React.useRef<HTMLElement>(null);

  // State is ALWAYS seeded with the true final value — on the server and on the
  // client alike. The prerendered HTML therefore never ships a placeholder zero,
  // and there is no hydration text mismatch under prefers-reduced-motion. The
  // count-up below is a flourish layered on top of the honest value: when motion
  // is allowed, entering the viewport dips the number to 0 and tweens it back to
  // the same real figure.
  const [providerDisplay, setProviderDisplay] = React.useState(PROVIDER_COUNT);
  const [cityDisplay, setCityDisplay] = React.useState(CITY_COUNT);
  const [tradeDisplay, setTradeDisplay] = React.useState(TRADE_COUNT);
  const [avgDisplay, setAvgDisplay] = React.useState(AVG_RATING.toFixed(1));

  const build = React.useCallback<Parameters<typeof useScrollScene>[1]>(
    ({ gsap, ScrollTrigger, el }) => {
      const countInt = (target: number, set: (n: number) => void) => {
        set(0);
        const box = { v: 0 };
        gsap.to(box, {
          v: target,
          snap: { v: 1 },
          duration: 0.9,
          ease: "power1.out",
          onUpdate: () => set(Math.round(box.v)),
        });
      };

      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        once: true,
        onEnter: () => {
          countInt(PROVIDER_COUNT, setProviderDisplay);
          countInt(CITY_COUNT, setCityDisplay);
          countInt(TRADE_COUNT, setTradeDisplay);

          setAvgDisplay((0).toFixed(1));
          const avgBox = { v: 0 };
          gsap.to(avgBox, {
            v: AVG_RATING,
            duration: 0.9,
            ease: "power1.out",
            onUpdate: () => setAvgDisplay(avgBox.v.toFixed(1)),
          });
        },
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
