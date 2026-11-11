"use client";

import Link from "next/link";
import { copy } from "@/lib/marketing/copy";

// Product column links point at the on-page section anchors; Company / Legal
// are placeholder anchors until those pages exist.
const COL_HREFS: string[][] = [
  ["#how-it-works", "#trades", "#pricing"],
  ["#", "#"],
  ["#", "#"],
];

/**
 * MarketingFooter — page-level footer for the marketing home. A bare page-level
 * <footer> is the `contentinfo` landmark. No hooks: server component.
 */
export function MarketingFooter() {
  return (
    <footer className="border-t border-hairline bg-surface-raised text-ink">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_repeat(3,_1fr)]">
          <div className="space-y-3">
            <span className="font-display text-lg font-semibold tracking-tight">Atelier</span>
            <p className="max-w-xs text-sm text-ink-muted">{copy.footer.tagline}</p>
            <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-ink-muted">
              {copy.trades.cities.map((city) => (
                <li key={city}>{city}</li>
              ))}
            </ul>
          </div>

          {copy.footer.cols.map((col, ci) => (
            <div key={col.h} className="space-y-3">
              <h3 className="text-sm font-semibold text-ink">{col.h}</h3>
              <ul className="space-y-2">
                {col.links.map((label, li) => (
                  <li key={label}>
                    <Link
                      href={COL_HREFS[ci]?.[li] ?? "#"}
                      className="rounded-sm text-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-12 flex flex-col gap-3 border-t border-hairline pt-8 sm:flex-row sm:items-end"
        >
          <div className="flex-1 space-y-2">
            <label htmlFor="nl" className="block text-sm font-medium text-ink">
              {copy.footer.newsletterLabel}
            </label>
            <input
              id="nl"
              type="email"
              placeholder={copy.footer.newsletterPlaceholder}
              aria-label={copy.footer.newsletterLabel}
              className="w-full max-w-sm rounded-md border border-hairline bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            Subscribe
          </button>
        </form>
      </div>
    </footer>
  );
}
