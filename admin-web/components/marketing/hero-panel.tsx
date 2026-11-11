import { CheckCircle, Star, Clock, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { providers } from "@/lib/fixtures";
import { cn } from "@/lib/utils";

// Real seeded provider — nothing invented. (prov-01: Tariq Mehmood, AC, G-13.)
const tariq = providers[0];
const initials = tariq.name
  .split(" ")
  .map((n) => n[0])
  .join("");

/**
 * HeroPanel — a product-real preview of the whole loop in one stack of cards:
 * the request, the agent's reply, the matched provider, the confirmation.
 * Pure CSS motion (floats are disabled under prefers-reduced-motion by globals.css).
 */
export function HeroPanel({ className }: { className?: string }) {
  return (
    <div className={cn("relative mx-auto w-full max-w-md pb-14", className)} aria-label="Preview of a booked request">
      {/* back card: confirmation */}
      <div className="absolute bottom-0 left-8 right-[-1.25rem] rounded-lg border border-status-go-line bg-status-go-tint px-4 pb-3 pt-12 shadow-raised">
        <div className="flex items-center gap-2 text-sm font-medium text-ink">
          <CheckCircle size={20} weight="fill" className="text-status-go" aria-hidden />
          Booked · code BK-4178
        </div>
      </div>

      {/* main card */}
      <div className="relative z-10 rounded-lg border border-hairline bg-surface-raised p-5 shadow-overlay">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-pill bg-primary font-display text-sm font-semibold text-primary-foreground">
              A
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-ink">Atelier concierge</p>
              <p className="font-mono text-[11px] text-ink-muted">Roman Urdu · online</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-status-live-line bg-status-live-tint px-2.5 py-1 font-mono text-[11px] text-ink">
            <span className="h-1.5 w-1.5 animate-pulse rounded-pill bg-status-live" aria-hidden />
            Discovery
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <div className="ml-auto max-w-[82%] rounded-lg rounded-br-sm bg-primary px-3.5 py-2.5 text-sm text-primary-foreground">
            G-13 mein AC thanda nahi kar raha. Kal subah aa sakte hain?
          </div>
          <div className="max-w-[88%] rounded-lg rounded-bl-sm border border-hairline bg-surface px-3.5 py-2.5 text-sm text-ink">
            Samajh gaya — AC repair, G-13, kal subah. Ek verified banda mil gaya:
          </div>
        </div>

        <div className="mt-4 rounded-md border border-hairline bg-surface p-3.5 transition-colors hover:border-accent">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-pill bg-[var(--brass)] font-display text-sm font-semibold text-ink">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{tariq.name}</p>
              <p className="flex items-center gap-1 text-xs text-ink-muted">
                <Star size={13} weight="fill" className="text-status-warn" aria-hidden />
                {tariq.rating} · {tariq.jobsCompleted} jobs · {tariq.area}
              </p>
            </div>
            <p className="text-right text-xs font-medium text-ink">{tariq.priceLabel}</p>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-sunken px-2.5 py-1.5 text-xs text-ink">
              <Clock size={14} weight="duotone" className="text-accent" aria-hidden />
              Tomorrow · 09:00 AM
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
              Confirm
            </span>
          </div>
        </div>
      </div>

      {/* floating tag */}
      <div className="absolute -left-8 bottom-24 z-20 hidden items-center gap-2 rounded-pill border border-hairline bg-surface-raised px-3 py-1.5 text-xs font-medium text-ink shadow-raised motion-safe:animate-[float_6s_ease-in-out_infinite] sm:flex">
        <Sparkle size={14} weight="fill" className="text-accent" aria-hidden />
        Price shown before you book
      </div>
    </div>
  );
}
