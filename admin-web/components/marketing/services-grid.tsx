import Link from "next/link";
import {
  Snowflake,
  Drop,
  Lightning,
  Broom,
  GraduationCap,
  PaintRoller,
  Hammer,
  Bug,
  Camera,
  Wrench,
  MapPin,
  ArrowUpRight,
  Star,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { providers, cities } from "@/lib/fixtures";
import { TRADES } from "@/lib/marketing/trades";
import type { ProviderCategory } from "@/lib/contracts";
import { cn } from "@/lib/utils";

const ICONS: Record<ProviderCategory, Icon> = {
  ac: Snowflake,
  plumber: Drop,
  electrician: Lightning,
  cleaner: Broom,
  tutor: GraduationCap,
};

const SOON: { label: string; Icon: Icon }[] = [
  { label: "Painting", Icon: PaintRoller },
  { label: "Carpentry", Icon: Hammer },
  { label: "Pest control", Icon: Bug },
  { label: "CCTV & security", Icon: Camera },
  { label: "Appliance repair", Icon: Wrench },
];

// Every figure comes from the provider fixtures — nothing is invented.
function statsFor(id: ProviderCategory) {
  const rows = providers.filter((p) => p.category === id && p.verified);
  const rating = rows.reduce((a, p) => a + p.rating, 0) / Math.max(rows.length, 1);
  const prices = rows.map((p) => p.priceLabel);
  return { count: rows.length, rating: rating.toFixed(1), from: prices[0] ?? "—" };
}

/**
 * ServicesGrid — "what we cover": five real trades as a bento (the first two are
 * larger), each with its real verified-provider count, average rating and starting
 * rate, then an honest "coming" row and the three live cities.
 * Server component: no motion library, fully visible without JS.
 */
export function ServicesGrid() {
  return (
    <section id="trades" className="bg-surface-sunken py-20 sm:py-28" aria-labelledby="trades-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">What we cover</p>
            <h2 id="trades-title" className="font-display mt-3 text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
              Five trades, every provider verified.
            </h2>
          </div>
          <p className="font-editorial max-w-sm text-lg text-ink-muted">
            Pick nothing. Say the problem — the concierge routes it to the right trade.
          </p>
        </div>

        <ul className="mt-12 grid auto-rows-fr gap-4 sm:grid-cols-6">
          {TRADES.map((t, i) => {
            const Ico = ICONS[t.id];
            const s = statsFor(t.id);
            const big = i < 2;
            return (
              <li key={t.id} className={cn(big ? "sm:col-span-3" : "sm:col-span-2")}>
                <Link
                  href="/signup"
                  className={cn(
                    "group relative flex h-full flex-col justify-between overflow-hidden rounded-lg border border-hairline bg-surface-raised p-6 transition-all duration-slow ease-out",
                    "hover:-translate-y-1 hover:border-accent hover:shadow-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
                    big && "sm:min-h-[15rem] sm:p-8",
                  )}
                >
                  <Ico
                    size={big ? 220 : 150}
                    weight="duotone"
                    aria-hidden
                    className="pointer-events-none absolute -bottom-10 -right-8 text-accent opacity-[0.07] transition-all duration-slow ease-out group-hover:-rotate-6 group-hover:opacity-[0.14]"
                  />
                  <div className="relative flex items-start justify-between">
                    <span
                      className={cn(
                        "flex items-center justify-center rounded-md bg-accent-tint text-accent transition-transform duration-slow ease-out group-hover:scale-110 group-hover:-rotate-6",
                        big ? "h-16 w-16" : "h-12 w-12",
                      )}
                    >
                      <Ico size={big ? 36 : 28} weight="duotone" aria-hidden />
                    </span>
                    <ArrowUpRight
                      size={20}
                      className="text-ink-muted transition-all duration-slow group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                      aria-hidden
                    />
                  </div>
                  <div className="relative mt-8">
                    <h3 className={cn("font-display font-semibold text-ink", big ? "text-2xl" : "text-xl")}>{t.label}</h3>
                    <p className="mt-1.5 text-sm text-ink-muted">{t.blurb}</p>
                    <dl className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-ink-muted">
                      <div className="flex items-center gap-1">
                        <ShieldCheck size={14} weight="duotone" className="text-status-go" aria-hidden />
                        <dt className="sr-only">Verified providers</dt>
                        <dd>{s.count} verified</dd>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={14} weight="fill" className="text-status-warn" aria-hidden />
                        <dt className="sr-only">Average rating</dt>
                        <dd>{s.rating}</dd>
                      </div>
                      <div>
                        <dt className="sr-only">Starting rate</dt>
                        <dd className="text-ink">{s.from}</dd>
                      </div>
                    </dl>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-col gap-6 border-t border-hairline pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">Rolling out next</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {SOON.map(({ label, Icon: I }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-pill border border-dashed border-ink-muted/50 px-3 py-1.5 text-sm text-ink-muted"
                >
                  <I size={16} weight="duotone" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">Live in</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {cities.map((c) => (
                <li key={c.id} className="inline-flex items-center gap-2 rounded-pill bg-ink px-4 py-1.5 text-sm font-medium text-surface">
                  <MapPin size={16} weight="fill" aria-hidden />
                  {c.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
