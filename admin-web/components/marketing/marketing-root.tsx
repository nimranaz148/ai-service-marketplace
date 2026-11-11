"use client";

import * as React from "react";
import { startLenis, stopLenis } from "@/lib/motion/lenis";
import { getGsap } from "@/lib/motion/gsap";

/**
 * MarketingRoot — the client wrapper the marketing home page composes its
 * sections inside. It:
 *  - keeps the page on the single light-paper theme (only DispatchFilm opts into the dark stage),
 *  - mounts the Lenis smooth-scroll singleton (a no-op under reduced-motion / SSR),
 *  - opens a page-scoped `gsap.context()` so any tween a section forgets to scope
 *    is still reverted on unmount.
 * Section animations are owned by the sections themselves, not here.
 */
export function MarketingRoot({ children }: { children: React.ReactNode }) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    startLenis();
    const ctx = getGsap().context(() => {}, rootRef.current ?? undefined);
    return () => {
      stopLenis();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-surface text-ink">
      {children}
    </div>
  );
}
