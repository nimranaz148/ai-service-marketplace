"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Mic, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/marketing/copy";

type Variant = "hero" | "cta";

/**
 * RequestBox — the shared "ask in your words" affordance used in the hero and
 * the final CTA. Non-functional for now: submitting (or pressing the arrow)
 * routes to /signup. The mic button is a labelled, deliberate no-op.
 */
export function RequestBox({
  variant = "hero",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const router = useRouter();
  const label = copy.hero.boxPlaceholder;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push("/signup");
  }

  const hero = variant === "hero";

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg border border-hairline bg-surface-raised",
        hero ? "p-2 pl-4 text-base" : "p-1.5 pl-3.5 text-sm",
        className,
      )}
    >
      <input
        type="text"
        name="request"
        aria-label={label}
        placeholder={label}
        className={cn(
          "min-w-0 flex-1 bg-transparent text-ink placeholder:text-ink-muted",
          "focus-visible:outline-none",
          hero ? "py-2" : "py-1.5",
        )}
      />

      <button
        type="button"
        aria-label="Use voice"
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors",
          "hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
          hero ? "h-10 w-10" : "h-8 w-8",
        )}
      >
        <Mic className={hero ? "size-5" : "size-4"} aria-hidden="true" />
      </button>

      <button
        type="submit"
        aria-label={copy.hero.ctaPrimary}
        className={cn(
          "inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary font-medium text-primary-foreground transition-colors",
          "hover:bg-[var(--accent-strong-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          hero ? "h-10 px-4 text-sm" : "h-8 px-3 text-xs",
        )}
      >
        <span className={hero ? "hidden sm:inline" : "sr-only"}>{copy.hero.ctaPrimary}</span>
        <ArrowRight className={hero ? "size-4" : "size-4"} aria-hidden="true" />
      </button>
    </form>
  );
}
