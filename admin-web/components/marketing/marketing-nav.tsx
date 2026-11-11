"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/marketing/copy";
import { prefersReducedMotion } from "@/lib/motion/gsap";
import { useScrollScene } from "@/lib/motion/use-scroll-scene";

const NAV_ANCHORS = ["#how-it-works", "#trades", "#pricing"] as const;

/**
 * MarketingNav — fixed page chrome for the marketing home.
 *
 * Transparent over the hero; after 80px of scroll it gains a solid raised
 * ground + hairline. The scroll toggle is driven by a ScrollTrigger created
 * inside `useScrollScene`. Under reduced motion (or SSR / no-JS) the nav
 * renders its SOLID state so it is always readable.
 */
export function MarketingNav() {
  // Start solid: SSR and the reduced-motion path both want the readable state.
  const [solid, setSolid] = React.useState(true);

  React.useEffect(() => {
    // On the client, if motion is allowed, begin transparent and let the
    // ScrollTrigger below flip us to solid past 80px.
    if (!prefersReducedMotion()) setSolid(false);
  }, []);

  const navRef = React.useRef<HTMLElement>(null);

  const build = React.useCallback<Parameters<typeof useScrollScene>[1]>(({ ScrollTrigger }) => {
    ScrollTrigger.create({
      trigger: document.documentElement,
      start: "80px top",
      onUpdate: (self) => setSolid(self.progress > 0),
      onToggle: (self) => setSolid(self.isActive),
    });
  }, []);

  useScrollScene(navRef, build);

  return (
    <header
      ref={navRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-200 ease-out",
        solid
          ? "border-b border-hairline bg-surface-raised"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <a
        href="#content"
        className={cn(
          "sr-only rounded-md bg-surface-raised px-3 py-2 text-sm font-medium text-ink",
          "focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
        )}
      >
        Skip to content
      </a>

      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6"
      >
        <Link
          href="/"
          className={cn(
            "font-display text-lg font-semibold tracking-tight text-ink",
            "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
          )}
        >
          Atelier
        </Link>

        <ul className="ml-4 hidden items-center gap-6 md:flex">
          {copy.nav.links.map((label, i) => (
            <li key={label}>
              <a
                href={NAV_ANCHORS[i]}
                className={cn(
                  "text-sm text-ink-muted transition-colors hover:text-ink",
                  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
                )}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/login"
            className={cn(
              "text-sm font-medium text-ink-muted transition-colors hover:text-ink",
              "rounded-sm px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
            )}
          >
            {copy.nav.signIn}
          </Link>
          <Link
            href="/signup"
            className={cn(
              "inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
              "transition-colors hover:bg-[var(--accent-strong-hover)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
            )}
          >
            {copy.nav.cta}
          </Link>
        </div>
      </nav>
    </header>
  );
}
