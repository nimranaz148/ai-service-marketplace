"use client";

import { ColorSection } from "@/components/foundations/color-section";
import { TypeSection } from "@/components/foundations/type-section";
import { MotionDemo } from "@/components/foundations/motion-demo";
import { PageHeader } from "@/components/primitives/page-header";
import { StatRow } from "@/components/primitives/stat-row";
import { StatTile } from "@/components/primitives/stat-tile";
import { EmptyState } from "@/components/primitives/empty-state";
import { DataTable } from "@/components/primitives/data-table";
import { Timeline } from "@/components/primitives/timeline";
import { AgentEventItem } from "@/components/primitives/agent-event-item";
import { StatusBadge } from "@/components/primitives/status-badge";
import { Button } from "@/components/ui/button";
import { sessions } from "@/lib/fixtures";

export default function FoundationsPage() {
  const events = sessions[0].events;
  return (
    <div className="mx-auto max-w-5xl space-y-12 p-8">
      <PageHeader title="Foundations" description="Every token, type style, and primitive. Internal reference — not linked from product nav." />

      <ColorSection />
      <TypeSection />

      <section>
        <h2 className="font-display text-2xl text-ink">Space &amp; radius</h2>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          {["--space-3", "--space-5", "--space-7", "--space-9"].map((s) => (
            <div key={s} className="bg-accent-tint" style={{ width: `var(${s})`, height: `var(${s})` }} title={s} />
          ))}
          {["--r-sm", "--r-md", "--r-lg", "--r-pill"].map((r) => (
            <div key={r} className="h-12 w-12 border border-hairline bg-surface-sunken" style={{ borderRadius: `var(${r})` }} title={r} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-ink">Elevation</h2>
        <div className="mt-4 flex gap-4">
          <div className="rounded-md bg-surface-raised p-6 shadow-raised">shadow-raised</div>
          <div className="rounded-md bg-surface-raised p-6 shadow-overlay">shadow-overlay</div>
        </div>
      </section>

      <MotionDemo />

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-ink">Primitives</h2>
        <StatRow>
          <StatTile label="Bookings today" value={12} delta={{ value: "+3", direction: "up" }} />
          <StatTile label="Active providers" value={8} />
          <StatTile label="GMV" value={0} state="no-data" />
          <StatTile label="Median latency" value={0} state="loading" />
        </StatRow>
        <div className="flex flex-wrap gap-2">
          {["confirmed", "en_route", "arrived", "completed", "cancelled", "online", "busy", "verified"].map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
        </div>
        <DataTable
          columns={[{ key: "name", header: "Provider" }, { key: "jobs", header: "Jobs", align: "right" }]}
          rows={[{ id: "1", name: "Tariq Mehmood", jobs: 142 }, { id: "2", name: "Imran Baig", jobs: 185 }]}
          getRowKey={(r) => r.id}
          renderRow={(r) => [<span key="n">{r.name}</span>, <span key="j">{r.jobs}</span>]}
        />
        <EmptyState title="No bookings yet" description="New requests will appear here." action={<Button size="sm">Refresh</Button>} />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-ink">Agent activity</h2>
        <Timeline
          items={events.slice(0, 5).map((e, i) => ({
            id: `${i}`,
            title: e.summary,
            meta: "durationMs" in e && e.durationMs ? `${e.durationMs} ms` : undefined,
            state: i === 4 ? "active" : "done",
          }))}
        />
        <div className="space-y-2">
          {events.map((e, i) => (
            <AgentEventItem
              key={i}
              event={e}
              // sessions[0] is status: "completed" — nothing here is executing, so no live dot.
              live={false}
              onAnswer={e.kind === "question_required" ? () => {} : undefined}
              onApprove={e.kind === "approval_required" ? () => {} : undefined}
              onReject={e.kind === "approval_required" ? () => {} : undefined}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-ink">Shell</h2>
        <p className="mt-2 text-sm text-ink-muted">
          The rebuilt sidebar + topbar render around this page via the app shell. Use the dev persona switcher (bottom-left) to see role-scoped nav.
        </p>
      </section>
    </div>
  );
}
