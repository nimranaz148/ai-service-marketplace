import * as React from "react";
import Link from "next/link";
import { copy } from "@/lib/marketing/copy";

type AuthShellProps = {
  /** Optional kicker line above the title (e.g. "Client concierge access"). */
  kicker?: string;
  /** Optional page title rendered as the card heading (font-display). */
  title?: string;
  /** Optional supporting line under the title. */
  subtitle?: string;
  /** Optional footer line shown under the card. */
  footer?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * AuthShell — shared marketing chrome for the 4 unauthenticated auth pages.
 *
 * Frame only: a slim top bar with the "Atelier" wordmark + a back-to-home
 * link, a centered <main> holding a hairline card, and an optional slim
 * footer line. Marketing tokens throughout (bg-surface / text-ink /
 * border-hairline / font-display). No blur blobs, no glow shadows, no emoji,
 * no hex. Server component — no hooks.
 */
export function AuthShell({ kicker, title, subtitle, footer, children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <header className="border-b border-hairline">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="rounded-sm font-display text-lg font-semibold tracking-tight text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            Atelier
          </Link>
          <Link
            href="/"
            className="rounded-sm px-2 py-1 text-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            {copy.auth.backToHome}
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md rounded-lg border border-hairline bg-surface-raised p-6 sm:p-8">
          {(kicker || title || subtitle) && (
            <div className="mb-6 space-y-2">
              {kicker && (
                <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                  {kicker}
                </p>
              )}
              {title && (
                <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
                  {title}
                </h1>
              )}
              {subtitle && <p className="text-sm text-ink-muted">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </main>

      {footer && (
        <footer className="border-t border-hairline">
          <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-ink-muted sm:px-6">
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
}
