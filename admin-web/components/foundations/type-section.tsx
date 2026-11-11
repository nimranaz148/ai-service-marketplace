const RAMP: { name: string; cls: string }[] = [
  { name: "display-hero", cls: "font-display text-6xl" },
  { name: "display-1", cls: "font-display text-4xl" },
  { name: "title-1", cls: "font-display text-2xl" },
  { name: "title-2", cls: "font-display text-xl" },
  { name: "body-lg (editorial)", cls: "font-editorial text-md" },
  { name: "body", cls: "font-sans text-base" },
  { name: "label", cls: "font-sans text-sm" },
  { name: "caption", cls: "font-sans text-xs" },
  { name: "mono", cls: "font-mono text-sm" },
];

export function TypeSection() {
  return (
    <section>
      <h2 className="font-display text-2xl text-ink">Typography</h2>
      <div className="mt-4 space-y-3">
        {RAMP.map((r) => (
          <div key={r.name} className="flex items-baseline gap-4 border-b border-hairline pb-2">
            <span className="w-40 shrink-0 font-mono text-xs text-ink-muted">{r.name}</span>
            <span className={`${r.cls} text-ink`}>Verified artisans, dispatched fast</span>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <p className="font-editorial text-md text-ink">Editorial serif (Zodiak) — marketing storytelling only. Rooted, human, unhurried.</p>
        <p className="font-sans text-base text-ink">Application body (Switzer). Reads cleanly at small sizes in dense dashboards.</p>
      </div>
      <p className="mt-3 font-mono text-sm text-ink-muted">BK-4821 · 640 ms · find_providers</p>
    </section>
  );
}
