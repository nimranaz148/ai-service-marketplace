import { cn } from "@/lib/utils";

/**
 * DispatchMotif — an abstract routing / node-graph motif for the marketing hero.
 * Pure inline SVG: a request node on the left fans out through a hub to a ranked
 * set of provider nodes on the right. Decorative only.
 */
export function DispatchMotif({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 160"
      fill="none"
      className={cn("h-auto w-full text-ink-muted", className)}
    >
      {/* connecting routes: request -> hub -> providers */}
      <g className="stroke-[var(--accent)]" strokeWidth="1.25" strokeLinecap="round">
        <path d="M40 80 H108" />
        <path d="M132 80 C160 80 168 40 196 40" />
        <path d="M132 80 H196" />
        <path d="M132 80 C160 80 168 120 196 120" />
      </g>

      {/* secondary hairline routes (unranked options) */}
      <g className="stroke-hairline" strokeWidth="1" strokeLinecap="round">
        <path d="M132 80 C158 80 164 62 196 62" />
        <path d="M132 80 C158 80 164 98 196 98" />
      </g>

      {/* request node */}
      <circle cx="34" cy="80" r="6" className="fill-none stroke-[var(--accent)]" strokeWidth="1.5" />

      {/* hub */}
      <circle cx="120" cy="80" r="12" className="fill-none stroke-current" strokeWidth="1.25" />
      <circle cx="120" cy="80" r="3.5" className="fill-[var(--accent)] stroke-none" />

      {/* provider nodes — top one ranked (accent), rest neutral */}
      <circle cx="202" cy="40" r="6" className="fill-[var(--accent)] stroke-none" />
      <circle cx="202" cy="62" r="4" className="fill-none stroke-current" strokeWidth="1" />
      <circle cx="202" cy="80" r="4" className="fill-none stroke-current" strokeWidth="1" />
      <circle cx="202" cy="98" r="4" className="fill-none stroke-current" strokeWidth="1" />
      <circle cx="202" cy="120" r="4" className="fill-none stroke-current" strokeWidth="1" />
    </svg>
  );
}
