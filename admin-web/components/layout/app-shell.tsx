"use client";

import { usePathname } from "next/navigation";
import { PersonaProvider, AuthGate } from "./auth-gate";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { PersonaSwitcher } from "@/components/dev/persona-switcher";

const BARE = ["/", "/login", "/signup", "/provider/login", "/provider/signup", "/admin/login"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const bare = BARE.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (bare) return <>{children}</>;

  return (
    <PersonaProvider>
      <div data-theme="light" className="flex min-h-screen bg-surface text-ink">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="mx-auto w-full max-w-6xl flex-1 p-6">
            <AuthGate>{children}</AuthGate>
          </main>
        </div>
      </div>
      <PersonaSwitcher />
    </PersonaProvider>
  );
}
