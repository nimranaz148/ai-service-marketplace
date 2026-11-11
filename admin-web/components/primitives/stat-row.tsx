import { Children } from "react";
import { cn } from "@/lib/utils";

export function StatRow({ children, className }: { children: React.ReactNode; className?: string }) {
  const count = Children.count(children);
  // Spec §9.2: throws in DEV so the mistake is unmissable; in production it degrades
  // to a console error and still renders rather than blanking the page.
  if (count > 4) {
    if (process.env.NODE_ENV !== "production") throw new Error(`StatRow accepts at most 4 tiles, got ${count}`);
    console.error(`StatRow accepts at most 4 tiles, got ${count}`);
  }
  return (
    <div className={cn("grid gap-3", count <= 2 ? "sm:grid-cols-2" : count === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4" /* >=4, incl. the clamped >4 case */, className)}>
      {children}
    </div>
  );
}
