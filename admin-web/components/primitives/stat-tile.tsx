import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface StatTileProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: { value: string; direction: "up" | "down" | "flat" };
  state?: "ready" | "loading" | "no-data";
  className?: string;
}

export function StatTile({ label, value, unit, delta, state = "ready", className }: StatTileProps) {
  return (
    <div className={cn("rounded-md border border-hairline bg-surface-raised p-4", className)}>
      <p className="text-xs text-ink-muted">{label}</p>
      {state === "loading" ? (
        <Skeleton data-testid="stat-tile-skeleton" className="mt-2 h-7 w-20" />
      ) : state === "no-data" ? (
        <div className="mt-1">
          <span className="font-display text-2xl text-ink-muted">—</span>
          <span className="ml-2 text-xs text-ink-muted">no data yet</span>
        </div>
      ) : (
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="font-display text-2xl text-ink">{value}</span>
          {unit ? <span className="text-xs text-ink-muted">{unit}</span> : null}
          {delta ? (
            <span
              className={cn(
                "ml-1 font-mono text-xs",
                delta.direction === "up" && "text-[var(--status-go)]",
                delta.direction === "down" && "text-[var(--status-stop)]",
                delta.direction === "flat" && "text-ink-muted",
              )}
            >
              {delta.value}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
