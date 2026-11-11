"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useActivePersona } from "./auth-gate";

export function Topbar() {
  const { persona } = useActivePersona();
  return (
    <header className="flex h-14 items-center justify-between border-b border-hairline bg-surface px-6">
      <span className="text-sm text-ink-muted">{persona.city.toUpperCase()} · {persona.area}</span>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm text-ink">{persona.name}</p>
          <p className="text-xs capitalize text-ink-muted">{persona.role}</p>
        </div>
        <Avatar className="h-8 w-8"><AvatarFallback>{persona.avatarInitials}</AvatarFallback></Avatar>
        <Button variant="outline" size="sm">Sign out</Button>
      </div>
    </header>
  );
}
