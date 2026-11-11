"use client";

import { personaList } from "@/lib/fixtures";
import { useActivePersona } from "@/components/layout/auth-gate";

export function PersonaSwitcher() {
  const { persona, setRole } = useActivePersona();
  if (process.env.NODE_ENV === "production") return null;
  return (
    <div className="fixed bottom-3 left-3 z-50 flex items-center gap-1 rounded-md border border-hairline bg-surface-raised p-1 text-xs shadow-overlay">
      <span className="px-1 text-ink-muted">dev persona</span>
      {personaList.map((p) => (
        <button
          key={p.id}
          onClick={() => setRole(p.role)}
          className={`rounded-sm px-2 py-1 ${p.role === persona.role ? "bg-accent text-accent-ink" : "text-ink hover:bg-surface-sunken"}`}
        >
          {p.role}
        </button>
      ))}
    </div>
  );
}
