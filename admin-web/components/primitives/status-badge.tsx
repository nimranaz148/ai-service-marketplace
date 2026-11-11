import { Badge } from "@/components/ui/badge";
import { BOOKING_STATUS_LABEL, type BookingStatus } from "@/lib/contracts";
import { cn } from "@/lib/utils";

type Extra = "online" | "busy" | "offline" | "verified" | "unverified";
type Tone = "go" | "warn" | "stop" | "info" | "live" | "neutral";

/**
 * Tone -> classes. Background/border use the explicit rgba `--status-*-tint` /
 * `--status-*-line` roles because Tailwind cannot apply a `/NN` alpha modifier to
 * a `var()` colour. The label is always `text-ink` (WCAG AA on the light tint);
 * the semantic hue reads from the leading dot instead.
 */
const TONE: Record<Tone, { wrap: string; dot: string | null }> = {
  go: { wrap: "border-status-go-line bg-status-go-tint text-ink", dot: "bg-status-go" },
  warn: { wrap: "border-status-warn-line bg-status-warn-tint text-ink", dot: "bg-status-warn" },
  stop: { wrap: "border-status-stop-line bg-status-stop-tint text-ink", dot: "bg-status-stop" },
  info: { wrap: "border-status-info-line bg-status-info-tint text-ink", dot: "bg-status-info" },
  live: { wrap: "border-status-live-line bg-status-live-tint text-ink", dot: "bg-status-live" },
  neutral: { wrap: "border-hairline bg-surface-sunken text-ink-muted", dot: null },
};

function bookingTone(s: BookingStatus): Tone {
  if (s === "en_route" || s === "arrived") return "live";
  if (s === "completed") return "go";
  if (s === "cancelled") return "stop";
  return "neutral";
}

const MAP: Record<string, { label: string; tone: Tone }> = {
  ...Object.fromEntries(
    (Object.keys(BOOKING_STATUS_LABEL) as BookingStatus[]).map((s) => [
      s,
      { label: BOOKING_STATUS_LABEL[s], tone: bookingTone(s) },
    ]),
  ),
  online: { label: "Online", tone: "go" },
  busy: { label: "In field", tone: "warn" },
  offline: { label: "Offline", tone: "neutral" },
  verified: { label: "Verified", tone: "info" },
  unverified: { label: "Unverified", tone: "neutral" },
};

export function StatusBadge({ status, className }: { status: BookingStatus | Extra | string; className?: string }) {
  const entry = MAP[status] ?? { label: status, tone: "neutral" as Tone };
  const tone = TONE[entry.tone];
  return (
    <Badge
      variant="outline"
      className={cn("inline-flex items-center gap-1.5 rounded-pill border px-2 py-0.5 text-xs font-medium", tone.wrap, className)}
    >
      {tone.dot ? <span aria-hidden="true" className={cn("h-1.5 w-1.5 shrink-0 rounded-full", tone.dot)} /> : null}
      {entry.label}
    </Badge>
  );
}
