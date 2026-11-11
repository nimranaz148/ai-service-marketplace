"use client";

import * as React from "react";
import { SplitText } from "gsap/SplitText";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/marketing/copy";
import { sessions, providers } from "@/lib/fixtures";
import { PROVIDER_CATEGORY_LABEL, type IntentResult } from "@/lib/contracts";
import { prefersReducedMotion } from "@/lib/motion/gsap";
import { useScrollScene } from "@/lib/motion/use-scroll-scene";
import { AgentEventItem } from "@/components/primitives/agent-event-item";
import { Timeline, type TimelineItem } from "@/components/primitives/timeline";
import { ToolCallChip } from "@/components/primitives/tool-call-chip";
import { StatusBadge } from "@/components/primitives/status-badge";

/**
 * AgentBeat — narrative beat 1 of the landing: a scroll-scrubbed replay of the
 * agent taking a request from raw text to a confirmed booking (spec §5 row 3,
 * §7 pinned beats, §11 a11y).
 *
 * Everything is in the DOM at all times. Motion only reveals / advances it, and
 * there is no `opacity:0` in any className — GSAP `.from()` sets the hidden state
 * after mount, so no-JS and reduced-motion both paint the END state (booking
 * confirmed). Pin/scrub is enabled only after a client check that motion is
 * allowed AND the viewport is >= 768px; otherwise this renders as a normal
 * vertical section and is never a scroll trap.
 */

const session = sessions[0];
const intent: IntentResult = session.intent ?? {
  serviceType: "ac",
  area: "Gulshan-e-Iqbal",
  timePreference: "Tomorrow morning",
  urgency: "high",
  language: "roman_ur",
};

const providerRows = providers.filter((p) => p.category === "ac");
const chosen =
  providerRows.find((p) => p.name === "Imran Baig") ??
  [...providerRows].sort((a, b) => b.rating - a.rating)[0];

const lastEvents = session.events.slice(-3);

const timelineItems: TimelineItem[] = copy.agentBeat.stages.map((title, i) => ({
  id: `stage-${i}`,
  title,
  state: "done",
}));

const intentChips = [
  { label: "Service", value: PROVIDER_CATEGORY_LABEL[intent.serviceType] },
  { label: "Area", value: intent.area },
  { label: "Time", value: intent.timePreference },
  { label: "Urgency", value: `${intent.urgency} urgency` },
];

export function AgentBeat() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const requestRef = React.useRef<HTMLDivElement>(null);
  const chipsRef = React.useRef<HTMLUListElement>(null);
  const rowsRef = React.useRef<HTMLUListElement>(null);
  const chosenRef = React.useRef<HTMLLIElement>(null);
  const bookingRef = React.useRef<HTMLDivElement>(null);

  const [canPin, setCanPin] = React.useState(false);

  React.useEffect(() => {
    const check = () => {
      setCanPin(
        !prefersReducedMotion() &&
          typeof window !== "undefined" &&
          !window.matchMedia("(max-width: 767px)").matches,
      );
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const build = React.useCallback<Parameters<typeof useScrollScene>[1]>(
    ({ gsap, ScrollTrigger, el }) => {
      if (headingRef.current) {
        const split = new SplitText(headingRef.current, { type: "lines" });
        gsap.from(split.lines, {
          yPercent: 100,
          opacity: 0,
          stagger: 0.06,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      }

      if (!canPin) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=1600",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      if (requestRef.current) {
        tl.from(requestRef.current, { autoAlpha: 0, y: 16, duration: 0.4 });
      }
      if (chipsRef.current) {
        tl.from(
          Array.from(chipsRef.current.children),
          { autoAlpha: 0, y: 12, stagger: 0.08, duration: 0.3 },
          ">-0.1",
        );
      }
      if (rowsRef.current) {
        tl.from(
          Array.from(rowsRef.current.children),
          { autoAlpha: 0, y: 14, stagger: 0.1, duration: 0.3 },
        );
      }
      if (chosenRef.current) {
        tl.to(chosenRef.current, { x: 6, duration: 0.25 });
      }
      if (bookingRef.current) {
        tl.from(bookingRef.current, { autoAlpha: 0, y: 10, duration: 0.35 });
      }
      // Settle: hold the confirmed end state on screen through the scrub tail.
      tl.to({}, { duration: 0.4 });
    },
    [canPin],
  );

  useScrollScene(sectionRef, build);

  return (
    <section
      id="agent-beat"
      ref={sectionRef}
      className="bg-surface"
    >
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-8 px-4 py-24 sm:px-6">
        <header className="space-y-2">
          <p className="font-sans text-xs uppercase tracking-wider text-ink-muted">
            {copy.agentBeat.kicker}
          </p>
          <div className="overflow-hidden">
            <h2
              ref={headingRef}
              className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
            >
              {copy.agentBeat.title}
            </h2>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            {/* 1. The request, shown as if typed. */}
            <div
              ref={requestRef}
              className="max-w-xl rounded-md border border-hairline bg-surface-raised p-4"
            >
              <p className="font-sans text-xs text-ink-muted">Customer · Roman Urdu</p>
              <p className="mt-1.5 text-sm text-ink">{session.rawInput}</p>
            </div>

            {/* 2. Intent facets. */}
            <ul ref={chipsRef} className="flex flex-wrap gap-2">
              {intentChips.map((chip) => (
                <li
                  key={chip.label}
                  className="rounded-md border border-hairline bg-surface-raised px-2.5 py-1 text-xs text-ink"
                >
                  <span className="text-ink-muted">{chip.label}: </span>
                  {chip.value}
                </li>
              ))}
            </ul>

            {/* 3. Provider rows, one marked as chosen. */}
            <ul ref={rowsRef} className="space-y-2">
              {providerRows.map((p) => {
                const isChosen = p.id === chosen.id;
                return (
                  <li
                    key={p.id}
                    data-provider-row
                    ref={isChosen ? chosenRef : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-md border bg-surface-raised px-3 py-2 text-sm",
                      isChosen ? "border-[var(--accent)]" : "border-hairline",
                    )}
                  >
                    <span className="flex items-center gap-2 text-ink">
                      {isChosen ? (
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                        />
                      ) : null}
                      {p.name}
                    </span>
                    <span className="font-mono text-xs text-ink-muted">{p.rating.toFixed(1)}</span>
                  </li>
                );
              })}
            </ul>

            {/* 4. The chosen row resolves to a confirmed booking. */}
            <div
              ref={bookingRef}
              className="flex flex-wrap items-center gap-3 rounded-md border border-hairline bg-surface-raised p-3"
            >
              <span className="text-sm text-ink">{chosen.name}</span>
              <StatusBadge status="confirmed" />
              <span className="font-mono text-xs text-ink">BK-4821</span>
            </div>
          </div>

          {/* 5. Last 3 events (replay, not live) + stage timeline. */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <ToolCallChip name="extract_intent" status="ok" />
              <ToolCallChip name="find_providers" status="ok" />
              <ToolCallChip name="create_booking" status="ok" />
            </div>

            <div className="space-y-2">
              {lastEvents.map((event, i) => (
                <AgentEventItem key={`${event.kind}-${i}`} event={event} live={false} />
              ))}
            </div>

            <Timeline items={timelineItems} />
          </div>
        </div>
      </div>
    </section>
  );
}
