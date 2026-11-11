import { cn } from "@/lib/utils";

export function ToolCallChip({ name, status }: { name: string; status: "running" | "ok" | "error" }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill border border-hairline bg-surface-sunken px-2 py-0.5 text-xs">
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "running" && "bg-[var(--status-live)]",
          status === "ok" && "bg-[var(--status-go)]",
          status === "error" && "bg-[var(--status-stop)]",
        )}
      />
      <code className="font-mono text-ink">{name}</code>
    </span>
  );
}
