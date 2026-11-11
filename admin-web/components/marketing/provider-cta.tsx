import Link from "next/link";
import { Storefront, CalendarCheck, Receipt, UsersThree, ArrowRight } from "@phosphor-icons/react/dist/ssr";

const PERKS = [
  { Icon: UsersThree, h: "Jobs come to you", p: "Customers are matched by trade, area and rating — no bidding, no cold calls." },
  { Icon: CalendarCheck, h: "You set the hours", p: "Open the slots you want. A booked slot is locked, so there are no double-bookings." },
  { Icon: Receipt, h: "Clear, per-job pay", p: "You see the job and the rate before you accept. No subscription to carry." },
] as const;

/** ProviderCta — second audience: the tradespeople. Server component, no motion. */
export function ProviderCta() {
  return (
    <section id="providers" className="bg-surface py-20 sm:py-28" aria-labelledby="provider-title">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-md bg-accent-tint text-accent">
            <Storefront size={32} weight="duotone" aria-hidden />
          </span>
          <h2 id="provider-title" className="font-display mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Run a trade? Get the jobs, skip the chasing.
          </h2>
          <p className="font-editorial mt-4 max-w-md text-lg text-ink-muted">
            Technicians, cleaners and tutors across Islamabad, Karachi and Lahore use Atelier to fill their week.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/provider/signup"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-[var(--accent-strong-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Become a provider <ArrowRight size={16} weight="bold" aria-hidden />
            </Link>
            <Link
              href="/provider/login"
              className="inline-flex items-center rounded-md border border-hairline px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              Provider sign in
            </Link>
          </div>
        </div>

        <ul className="grid gap-4">
          {PERKS.map(({ Icon, h, p }) => (
            <li key={h} className="flex gap-4 rounded-lg border border-hairline bg-surface-raised p-5 transition-colors hover:border-accent">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent-tint text-accent">
                <Icon size={24} weight="duotone" aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">{h}</h3>
                <p className="mt-1 text-sm text-ink-muted">{p}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
