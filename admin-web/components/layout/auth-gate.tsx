"use client";

/**
 * PHASE-1 STUB. Real auth (Clerk + middleware.ts + server checks) replaces this.
 * The RBAC shape (routeRole vs persona.role) is deliberately preserved so Phase 1
 * can swap the persona source for the Clerk session with no consumer changes.
 */
import { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import type { AppUser, UserRole } from "@/lib/contracts";
import { personas } from "@/lib/fixtures";
import { routeRole } from "@/lib/nav";

interface PersonaCtx {
  persona: AppUser;
  setRole: (r: UserRole) => void;
}
const Ctx = createContext<PersonaCtx | null>(null);

export function PersonaProvider({ children, initialRole = "customer" }: { children: React.ReactNode; initialRole?: UserRole }) {
  const [role, setRole] = useState<UserRole>(initialRole);
  return <Ctx.Provider value={{ persona: personas[role], setRole }}>{children}</Ctx.Provider>;
}

export function useActivePersona() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useActivePersona must be used within PersonaProvider");
  return c;
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { persona } = useActivePersona();
  const pathname = usePathname() ?? "/";
  const needed = routeRole(pathname);

  if (needed && needed !== persona.role) {
    return (
      <div className="mx-auto mt-24 max-w-md rounded-md border border-hairline bg-surface-raised p-8 text-center">
        <h2 className="font-display text-xl text-ink">Not authorised</h2>
        <p className="mt-2 text-sm text-ink-muted">
          This area is for {needed} accounts. You are signed in as {persona.role}.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}
