import { tokens } from "@/lib/design/tokens";
import { blend, formatRatio, ratio } from "@/lib/design/contrast";

const c = tokens.color;

/**
 * Compensating control for spec §12.1 criterion #11: jsdom + axe cannot evaluate
 * colour contrast, so the key text pairings are computed and shown here (and
 * asserted node-side in tests/contrast.test.ts).
 */
const CONTRAST_PAIRS: Array<{ label: string; fg: string; bg: string; sample: string }> = [
  { label: "--ink on --surface", fg: c["ink-900"], bg: c["paper-0"], sample: "Body text" },
  { label: "--ink-muted on --surface", fg: c["ink-500"], bg: c["paper-0"], sample: "Muted text" },
  { label: "--ink-muted on --surface-sunken", fg: c["ink-500"], bg: c["paper-50"], sample: "Muted on sunken" },
  { label: "--accent-ink on --accent", fg: "#FFFFFF", bg: c["ember-500"], sample: "Primary button" },
  { label: "--ink on go tint", fg: c["ink-900"], bg: blend(c["status-go-tint"], c["paper-0"]), sample: "Completed" },
  { label: "--ink on warn tint", fg: c["ink-900"], bg: blend(c["status-warn-tint"], c["paper-0"]), sample: "In field" },
  { label: "--ink on stop tint", fg: c["ink-900"], bg: blend(c["status-stop-tint"], c["paper-0"]), sample: "Cancelled" },
  { label: "--ink on info tint", fg: c["ink-900"], bg: blend(c["status-info-tint"], c["paper-0"]), sample: "Verified" },
  { label: "--ink on live tint", fg: c["ink-900"], bg: blend(c["status-live-tint"], c["paper-0"]), sample: "En route" },
];

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

      <h3 className="mt-8 font-display text-lg text-ink">Contrast</h3>
      <p className="mt-1 text-sm text-ink-muted">
        WCAG 2.1 ratios, computed from the tokens. Translucent status tints are composited over{" "}
        <code className="font-mono">--surface</code> first. AA needs 4.5:1 for body text, AAA needs 7:1.
      </p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-sm">
          <caption className="sr-only">Computed WCAG contrast ratios for the key text pairings</caption>
          <thead>
            <tr className="border-b border-hairline text-left">
              <th scope="col" className="py-2 pr-3 font-medium text-ink-muted">Pairing</th>
              <th scope="col" className="py-2 pr-3 font-medium text-ink-muted">Sample</th>
              <th scope="col" className="py-2 pr-3 text-right font-medium text-ink-muted">Ratio</th>
              <th scope="col" className="py-2 pr-3 font-medium text-ink-muted">AA</th>
              <th scope="col" className="py-2 font-medium text-ink-muted">AAA</th>
            </tr>
          </thead>
          <tbody>
            {CONTRAST_PAIRS.map((p) => {
              const r = ratio(p.fg, p.bg);
              return (
                <tr key={p.label} className="border-b border-hairline">
                  <td className="py-2 pr-3 font-mono text-xs text-ink">{p.label}</td>
                  <td className="py-2 pr-3">
                    <span className="inline-block rounded-sm px-2 py-1" style={{ background: p.bg, color: p.fg }}>
                      {p.sample}
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-right font-mono text-xs text-ink">{formatRatio(r)}:1</td>
                  <td className="py-2 pr-3 text-ink">{r >= 4.5 ? "AA ✓" : "AA ✗"}</td>
                  <td className="py-2 text-ink">{r >= 7 ? "AAA ✓" : "AAA ✗"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
