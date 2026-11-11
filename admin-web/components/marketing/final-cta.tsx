"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/marketing/copy";
import { useScrollScene } from "@/lib/motion/use-scroll-scene";
import { RequestBox } from "@/components/marketing/request-box";

/**
 * FinalCta — the closing beat. One honest ask: the shared RequestBox plus an
 * explicit "Get help now" link to /signup.
 *
 * The single large accent moment of the page lives here: one `--accent` radial
 * spotlight sitting BEHIND the content. It scales and fades in once when the
 * section enters view; under reduced motion (or no JS) it is simply there,
 * static — there is no `opacity:0` in any className.
 */
export function FinalCta() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const spotlightRef = React.useRef<HTMLDivElement>(null);

  const build = React.useCallback<Parameters<typeof useScrollScene>[1]>(
    ({ gsap, el }) => {
      if (!spotlightRef.current) return;
      gsap.from(spotlightRef.current, {
        scale: 0.6,
        autoAlpha: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    },
    [],
  );

  useScrollScene(sectionRef, build);

  return (
    <section
      id="get-started"
      ref={sectionRef}
      className="relative overflow-hidden bg-surface"
    >
      {/* The one large accent moment: a radial spotlight behind the content. */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[42rem] max-w-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,var(--accent-tint),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-2xl px-4 py-28 text-center sm:px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {copy.finalCta.title}
        </h2>

        <RequestBox variant="cta" className="mx-auto mt-8 max-w-xl" />

        <div className="mt-6">
          <Link
            href="/signup"
            className={cn(
              "inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground",
              "transition-colors hover:bg-accent-hover",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
            )}
          >
            {copy.finalCta.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
