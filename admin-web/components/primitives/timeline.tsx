import { cn } from "@/lib/utils";

export interface TimelineItem {
  id: string;
  title: string;
  meta?: string;
  state: "pending" | "active" | "done" | "error";
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative ml-3 border-l border-hairline">
      {items.map((it) => (
        <li key={it.id} className="mb-4 ml-4 last:mb-0">
          <span
            className={cn(
              "absolute -left-[5px] mt-1 h-2.5 w-2.5 rounded-full border",
              it.state === "active" && "border-[var(--status-live)] bg-[var(--status-live)]",
              it.state === "done" && "border-[var(--status-go)] bg-[var(--status-go)]",
              it.state === "error" && "border-[var(--status-stop)] bg-[var(--status-stop)]",
              it.state === "pending" && "border-hairline bg-surface",
            )}
          />
          <p className={cn("text-sm", it.state === "pending" ? "text-ink-muted" : "text-ink")}>{it.title}</p>
          {it.meta ? <p className="font-mono text-xs text-ink-muted">{it.meta}</p> : null}
        </li>
      ))}
    </ol>
  );
}
