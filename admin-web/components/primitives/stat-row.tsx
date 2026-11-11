import { Children } from "react";
import { cn } from "@/lib/utils";

export function StatRow({ children, className }: { children: React.ReactNode; className?: string }) {
  const count = Children.count(children);
  if (count > 4) throw new Error(`StatRow accepts at most 4 tiles, got ${count}`);
  return (
    <div className={cn("grid gap-3", count <= 2 ? "sm:grid-cols-2" : count === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4", className)}>
      {children}
    </div>
  );
}
