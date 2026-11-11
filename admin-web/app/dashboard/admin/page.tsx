"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  ChatCircleDots,
  Wrench,
  Pulse,
  Users,
  Trophy,
  Star,
  ArrowUpRight,
  Gear,
  ClockCounterClockwise,
} from "@phosphor-icons/react";
import { api, type AdminStats, type AdminCustomer, type ProviderItem } from "@/lib/api";

const STATUS_STYLE: Record<string, string> = {
  completed: "border-status-go-line bg-status-go-tint text-status-go",
  needs_input: "border-status-warn-line bg-status-warn-tint text-status-warn",
  in_progress: "border-status-info-line bg-status-info-tint text-status-info",
  failed: "border-status-stop-line bg-status-stop-tint text-status-stop",
};

/**
 * Admin overview — every figure here is read from the backend
 * (/admin/stats, /admin/providers, /admin/customers). Nothing is hardcoded,
 * so an empty marketplace shows empty states, not invented revenue.
 */
export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([api.getStats(), api.getProviders(), api.getCustomers()])
      .then(([s, p, c]) => {
        if (!alive) return;
        setStats(s);
        setProviders(p);
        setCustomers(c);
      })
      .catch(() => alive && setError("Couldn't load live data. Is the backend running?"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const topProviders = useMemo(
    () => [...providers].sort((a, b) => b.rating - a.rating || b.jobs_completed - a.jobs_completed).slice(0, 5),
    [providers],
  );
  const topCustomers = useMemo(
    () => [...customers].sort((a, b) => b.bookings_count - a.bookings_count).slice(0, 5),
    [customers],
  );

  const kpis = [
    { title: "Bookings", value: stats?.total_bookings, sub: "confirmed in the system", Icon: CalendarCheck },
    { title: "Agent conversations", value: stats?.total_sessions, sub: "chat + voice sessions", Icon: ChatCircleDots },
    { title: "Active providers", value: stats?.active_providers, sub: "listed and bookable", Icon: Wrench },
    { title: "Agent steps logged", value: stats?.total_trace_logs, sub: "tool calls, all traced", Icon: Pulse },
  ];

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Admin · Overview</p>
          <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            What's happening on the marketplace
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-muted">
            Live numbers from the database — bookings, agent conversations, providers and customers across
            Islamabad, Karachi and Lahore.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/traces"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-[var(--accent-strong-hover)]"
          >
            <Pulse size={16} weight="bold" /> Agent traces
          </Link>
          <Link
            href="/dashboard/admin/settings"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-hairline px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-raised"
          >
            <Gear size={16} weight="duotone" /> Settings
          </Link>
        </div>
      </header>

      {error ? (
        <p role="alert" className="rounded-md border border-status-stop-line bg-status-stop-tint px-4 py-3 text-sm text-ink">
          {error}
        </p>
      ) : null}

      <section aria-label="Key figures" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map(({ title, value, sub, Icon }) => (
          <div key={title} className="rounded-lg border border-hairline bg-surface-raised p-5 transition-colors hover:border-accent">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">{title}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-tint text-accent">
                <Icon size={20} weight="duotone" aria-hidden />
              </span>
            </div>
            <p className="font-display mt-4 text-4xl font-semibold tabular-nums text-ink">
              {loading ? <span className="inline-block h-9 w-12 animate-pulse rounded-sm bg-surface-sunken" /> : (value ?? "—")}
            </p>
            <p className="mt-1 text-xs text-ink-muted">{sub}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-hairline bg-surface-raised p-6" aria-labelledby="top-providers">
          <div className="flex items-center justify-between border-b border-hairline pb-4">
            <h2 id="top-providers" className="font-display flex items-center gap-2 text-lg font-semibold text-ink">
              <Trophy size={20} weight="duotone" className="text-status-warn" aria-hidden /> Top providers
            </h2>
            <Link href="/dashboard/admin/providers" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
              Roster <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>
          {topProviders.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-muted">{loading ? "Loading…" : "No providers yet."}</p>
          ) : (
            <ol className="mt-4 space-y-2">
              {topProviders.map((p, i) => (
                <li key={p.id} className="flex items-center justify-between gap-3 rounded-md border border-hairline bg-surface p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-surface-sunken font-mono text-xs text-ink-muted">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{p.name}</p>
                      <p className="truncate text-xs text-ink-muted">
                        {p.category} · {p.area}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="flex items-center justify-end gap-1 text-sm font-semibold text-ink">
                      <Star size={14} weight="fill" className="text-status-warn" aria-hidden /> {p.rating.toFixed(1)}
                    </p>
                    <p className="font-mono text-[11px] text-ink-muted">{p.jobs_completed} jobs</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="rounded-lg border border-hairline bg-surface-raised p-6" aria-labelledby="top-customers">
          <div className="flex items-center justify-between border-b border-hairline pb-4">
            <h2 id="top-customers" className="font-display flex items-center gap-2 text-lg font-semibold text-ink">
              <Users size={20} weight="duotone" className="text-accent" aria-hidden /> Most active customers
            </h2>
            <Link href="/dashboard/admin/customers" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
              All customers <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>
          {topCustomers.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-muted">{loading ? "Loading…" : "No customers yet."}</p>
          ) : (
            <ol className="mt-4 space-y-2">
              {topCustomers.map((c, i) => (
                <li key={c.id} className="flex items-center justify-between gap-3 rounded-md border border-hairline bg-surface p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-surface-sunken font-mono text-xs text-ink-muted">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{c.name}</p>
                      <p className="truncate text-xs text-ink-muted">{c.area ?? "No area set"}</p>
                    </div>
                  </div>
                  <p className="shrink-0 font-mono text-xs text-ink">
                    {c.bookings_count} {c.bookings_count === 1 ? "booking" : "bookings"}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <section className="rounded-lg border border-hairline bg-surface-raised p-6" aria-labelledby="recent">
        <div className="flex items-center justify-between border-b border-hairline pb-4">
          <h2 id="recent" className="font-display flex items-center gap-2 text-lg font-semibold text-ink">
            <ClockCounterClockwise size={20} weight="duotone" className="text-accent" aria-hidden /> Recent conversations
          </h2>
          <Link href="/traces" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
            All traces <ArrowUpRight size={14} aria-hidden />
          </Link>
        </div>
        {!stats || stats.recent_sessions.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-muted">{loading ? "Loading…" : "No conversations yet."}</p>
        ) : (
          <ul className="mt-4 divide-y divide-hairline">
            {stats.recent_sessions.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/traces/${s.id}`}
                  className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-surface-sunken sm:px-2"
                >
                  <p className="min-w-0 truncate text-sm text-ink">“{s.raw_input}”</p>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className={`rounded-pill border px-2.5 py-0.5 font-mono text-[11px] ${STATUS_STYLE[s.status] ?? "border-hairline text-ink-muted"}`}>
                      {s.status.replace("_", " ")}
                    </span>
                    <span className="hidden font-mono text-[11px] text-ink-muted sm:block">
                      {new Date(s.started_at).toLocaleString()}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
