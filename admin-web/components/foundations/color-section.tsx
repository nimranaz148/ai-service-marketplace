import { tokens } from "@/lib/design/tokens";

const ROLES = [
  "--surface", "--surface-sunken", "--surface-raised", "--hairline",
  "--ink", "--ink-muted", "--accent", "--accent-hover", "--accent-tint",
  "--status-go", "--status-warn", "--status-stop", "--status-info", "--status-live",
];

export function ColorSection() {
  return (
    <section>
      <h2 className="font-display text-2xl text-ink">Colour</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ROLES.map((r) => (
          <div key={r} className="rounded-md border border-hairline p-3">
            <div className="h-10 w-full rounded-sm border border-hairline" style={{ background: `var(${r})` }} />
            <p className="mt-2 font-mono text-xs text-ink">{r}</p>
          </div>
        ))}
      </div>
      <div className="theme-marketing mt-4 rounded-md border border-hairline bg-surface p-4">
        <p className="text-xs text-ink-muted">Craft layer — marketing subtree only</p>
        <div className="mt-2 flex gap-2">
          {["--tile", "--terracotta", "--brass", "--plaster"].map((r) => (
            <div key={r} className="h-8 w-16 rounded-sm" style={{ background: `var(${r})` }} title={r} />
          ))}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {tokens.viz.map((v, i) => (
          <div key={i} className="h-8 w-16 rounded-sm" style={{ background: v }} title={`--viz-${i + 1}`} />
        ))}
      </div>
    </section>
  );
}
