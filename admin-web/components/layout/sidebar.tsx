"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { useActivePersona } from "./auth-gate";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { persona } = useActivePersona();
  const pathname = usePathname() ?? "";
  const items = NAV[persona.role];

  return (
    <aside className="flex w-60 flex-shrink-0 flex-col border-r border-hairline bg-surface">
      <div className="border-b border-hairline px-5 py-4">
        <Link href="/" className="font-display text-md text-ink">Atelier</Link>
        <p className="mt-0.5 text-xs capitalize text-ink-muted">{persona.role} workspace</p>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {items.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + "/");
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm transition-colors duration-fast",
                active ? "bg-accent-tint text-accent" : "text-ink-muted hover:bg-surface-sunken hover:text-ink",
              )}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
