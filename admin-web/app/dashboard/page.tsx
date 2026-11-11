"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function DashboardRouterPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }

    if (user.role === "admin") {
      router.push("/dashboard/admin");
    } else if (user.role === "provider") {
      router.push("/dashboard/provider");
    } else {
      router.push("/dashboard/customer");
    }
  }, [user, isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-accent-tint border border-accent animate-spin shadow-raised" />
      <span className="text-xs font-code text-ink-muted uppercase tracking-wider">
        Routing to your role workspace...
      </span>
    </div>
  );
}
