import { cn } from "@/lib/utils";

/**
 * DispatchMotif — a warm material "dispatch card" for the marketing hero.
 * A solid plaster panel (the Local Craft Premium accent against the dark
 * marketing surface) carries the routing motif: a request node fanning
 * through a hub to a ranked set of provider nodes. Pure inline SVG,
 * decorative only — no fake liveness, no counters.
 */
export function DispatchMotif({
  caption,
  className,
}: {
  caption?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-[rgba(0,0,0,0.08)] bg-[var(--plaster)] p-6 shadow-[var(--elevation-overlay)]",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 240 160"
        fill="none"
        className="h-auto w-full text-[var(--ink-900)]"
      >
        {/* connecting routes: request -> hub -> providers */}
        <g className="stroke-[var(--terracotta)]" strokeWidth="1.5" strokeLinecap="round">
          <path d="M40 80 H108" />
          <path d="M132 80 C160 80 168 40 196 40" />
          <path d="M132 80 H196" />
          <path d="M132 80 C160 80 168 120 196 120" />
        </g>

        {/* secondary hairline routes (unranked options) */}
        <g className="stroke-[rgba(28,26,23,0.22)]" strokeWidth="1" strokeLinecap="round">
          <path d="M132 80 C158 80 164 62 196 62" />
          <path d="M132 80 C158 80 164 98 196 98" />
        </g>

        {/* request node */}
        <circle cx="34" cy="80" r="6" className="fill-none stroke-[var(--terracotta)]" strokeWidth="1.75" />

        {/* hub */}
        <circle cx="120" cy="80" r="13" className="fill-none stroke-current" strokeWidth="1.5" />
        <circle cx="120" cy="80" r="3.5" className="fill-[var(--terracotta)] stroke-none" />

        {/* provider nodes — top one ranked (brass), rest neutral */}
        <circle cx="202" cy="40" r="7" className="fill-[var(--brass)] stroke-none" />
        <circle cx="202" cy="62" r="4" className="fill-none stroke-current" strokeWidth="1" />
        <circle cx="202" cy="80" r="4" className="fill-none stroke-current" strokeWidth="1" />
        <circle cx="202" cy="98" r="4" className="fill-none stroke-current" strokeWidth="1" />
        <circle cx="202" cy="120" r="4" className="fill-none stroke-current" strokeWidth="1" />
      </svg>

      {caption ? (
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-[rgba(28,26,23,0.55)]">
          {caption}
        </p>
      ) : null}
    </div>
  );
}
