import { Badge } from "@/components/ui/badge";
import { BOOKING_STATUS_LABEL, type BookingStatus } from "@/lib/contracts";
import { cn } from "@/lib/utils";

type Extra = "online" | "busy" | "offline" | "verified" | "unverified";

const MAP: Record<string, { label: string; className: string }> = {
  ...Object.fromEntries(
    (Object.keys(BOOKING_STATUS_LABEL) as BookingStatus[]).map((s) => [
      s,
      {
        label: BOOKING_STATUS_LABEL[s],
        className:
          s === "en_route" || s === "arrived"
            ? "text-[var(--status-live)] border-[var(--status-live)]/30 bg-[var(--status-live)]/10"
            : s === "completed"
              ? "text-[var(--status-go)] border-[var(--status-go)]/30 bg-[var(--status-go)]/10"
              : s === "cancelled"
                ? "text-[var(--status-stop)] border-[var(--status-stop)]/30 bg-[var(--status-stop)]/10"
                : "text-ink-muted border-hairline bg-surface-sunken",
      },
    ]),
  ),
  online: { label: "Online", className: "text-[var(--status-go)] border-[var(--status-go)]/30 bg-[var(--status-go)]/10" },
  busy: { label: "In field", className: "text-[var(--status-warn)] border-[var(--status-warn)]/30 bg-[var(--status-warn)]/10" },
  offline: { label: "Offline", className: "text-ink-muted border-hairline bg-surface-sunken" },
  verified: { label: "Verified", className: "text-[var(--status-info)] border-[var(--status-info)]/30 bg-[var(--status-info)]/10" },
  unverified: { label: "Unverified", className: "text-ink-muted border-hairline bg-surface-sunken" },
};

export function StatusBadge({ status, className }: { status: BookingStatus | Extra | string; className?: string }) {
  const entry = MAP[status] ?? { label: status, className: "text-ink-muted border-hairline bg-surface-sunken" };
  return (
    <Badge variant="outline" className={cn("rounded-pill border px-2 py-0.5 text-xs font-medium", entry.className, className)}>
      {entry.label}
    </Badge>
  );
}
