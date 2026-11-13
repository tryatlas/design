"use client";

import { useSyncExternalStore, type ReactNode } from "react";

import { cn } from "../../lib/utils.ts";

/**
 * The small pieces a session sidebar row is made of: the project badge and
 * its stack, the "attached" mark, the working ring and its timer, the done
 * check, the relative time.
 *
 * Each is cheap on purpose. A list mounts a window of rows at a time and
 * re-renders a row only when its own props change, so a clock in any of
 * these must tick by itself — one shared one-second ticker for every timer
 * on screen, one shared minute ticker for every age — and never through the
 * row.
 */

/**
 * The project's badge, the size of an icon: the icon the project ships (its
 * favicon or app icon) when the app found one, else its monogram on a tile
 * tinted with the project's colour. The app owns the lookup and the colour;
 * this draws what it is given.
 */
export function ProjectBadge({
  monogram,
  color,
  icon,
  className,
}: {
  /** One or two characters, drawn when there is no icon. */
  monogram: string;
  /** The tile's ink; its fill is a 14% tint of the same colour. */
  color: string;
  /** An image URL for the project's own icon. */
  icon?: string | null;
  className?: string;
}) {
  if (icon) {
    return (
      <img
        src={icon}
        alt=""
        aria-hidden
        draggable={false}
        className={cn("size-4 shrink-0 rounded-sm object-contain", className)}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-4 shrink-0 place-items-center rounded-sm font-mono text-3xs font-bold leading-none tracking-tighter",
        className,
      )}
      style={{ color, backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)` }}
    >
      {monogram}
    </span>
  );
}

/** How many attached projects get a badge of their own before "…" stands in
 *  for the rest. */
const MAX_ATTACHED_BADGES = 2;

/** One badge laid over the one before it. The badge fill is a translucent
 *  tint, so an opaque base goes under it: without one the initials beneath
 *  show through and the two read as a smudge. */
function StackedBadge({ children }: { children: ReactNode }) {
  return (
    <span className="-ms-1.5 shrink-0 rounded-sm bg-background ring-1 ring-border">{children}</span>
  );
}

/**
 * A session's project badge with the projects attached to it stacked after
 * it, overlapping: two at most, and "…" past that. With nothing attached it
 * is the badge alone, no wrapper.
 */
export function ProjectBadgeStack({
  badge,
  attached,
  title,
}: {
  /** The session's own project's badge. */
  badge: ReactNode;
  /** A badge per attached project, in order. */
  attached: readonly ReactNode[];
  /** The stack's title: the project and what is attached to it. */
  title: string;
}) {
  if (attached.length === 0) return <>{badge}</>;
  const shown = attached.slice(0, MAX_ATTACHED_BADGES);
  return (
    <span title={title} className="flex shrink-0 items-center">
      {badge}
      {shown.map((node, i) => (
        <StackedBadge key={i}>{node}</StackedBadge>
      ))}
      {attached.length > MAX_ATTACHED_BADGES && (
        <StackedBadge>
          <span
            aria-hidden
            className="grid size-4 place-items-center rounded-sm bg-element-selected text-3xs font-semibold leading-none text-muted-foreground"
          >
            …
          </span>
        </StackedBadge>
      )}
    </span>
  );
}

/** A row listed under a project filter because that project is attached to
 *  it, not because the session runs there. */
export function AttachedMark() {
  return (
    <span
      title="The filtered project is attached to this session"
      className="relative ms-1.5 shrink-0 text-2xs font-normal text-muted-foreground"
    >
      attached
    </span>
  );
}

// ── Clocks ─────────────────────────────────────────────────────────────────
//
// Module-level tickers: one interval however many labels are on screen,
// running only while something listens and paused while the window is
// hidden (a hidden label has nobody to show the second to). Nothing touches
// `document` until a label subscribes.

function makeTicker(periodMs: number) {
  const listeners = new Set<() => void>();
  let now = Date.now();
  let timer: ReturnType<typeof setInterval> | null = null;
  const tick = () => {
    now = Date.now();
    for (const listener of listeners) listener();
  };
  const start = () => {
    if (timer === null && !document.hidden) timer = setInterval(tick, periodMs);
  };
  const stop = () => {
    if (timer === null) return;
    clearInterval(timer);
    timer = null;
  };
  const onVisibility = () => {
    if (document.hidden) stop();
    else {
      tick();
      start();
    }
  };
  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (listeners.size === 1) {
        now = Date.now();
        document.addEventListener("visibilitychange", onVisibility);
        start();
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          stop();
          document.removeEventListener("visibilitychange", onVisibility);
        }
      };
    },
    get: () => now,
  };
}

const secondTicker = makeTicker(1_000);
const minuteTicker = makeTicker(60_000);

/** The shared minute clock, for a label of the app's own that ages once a
 *  minute alongside `RelativeTime` (a snooze's time left). */
export function useMinuteClock(): number {
  return useSyncExternalStore(minuteTicker.subscribe, minuteTicker.get, minuteTicker.get);
}

/** "now", "5m", "3h", "2d", "4w" — a row's compact age. */
export function compactAge(iso: string | null, now: number): string | null {
  if (!iso) return null;
  const at = Date.parse(iso);
  if (Number.isNaN(at)) return null;
  const s = Math.max(0, Math.floor((now - at) / 1000));
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86_400) return `${Math.floor(s / 3600)}h`;
  if (s < 7 * 86_400) return `${Math.floor(s / 86_400)}d`;
  if (s < 365 * 86_400) return `${Math.floor(s / (7 * 86_400))}w`;
  return `${Math.floor(s / (365 * 86_400))}y`;
}

/** "45s", "7m", "1h 5m" — how long the current turn has run. */
export function formatWorkingDuration(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return m % 60 === 0 ? `${h}h` : `${h}h ${m % 60}m`;
}

/** A running turn's clock, from when it started (epoch ms), ticking each
 *  second by itself. */
export function WorkingDurationLabel({ startedAt }: { startedAt: number }) {
  const now = useSyncExternalStore(secondTicker.subscribe, secondTicker.get, secondTicker.get);
  return <span className="tabular-nums">{formatWorkingDuration(now - startedAt)}</span>;
}

/** "now", "5m", "3h" — ticking by itself once a minute. */
export function RelativeTime({ iso }: { iso: string | null }) {
  const now = useMinuteClock();
  return <>{compactAge(iso, now)}</>;
}

/**
 * The dashed ring that turns while an agent works. A continuous,
 * deliberately slow rotation — the stock 1 s `animate-spin` reads as
 * "loading" rather than "working". Reduced motion stops it. An endless
 * animation, so it is in `INFINITE_ANIMATIONS` (`session-working-ring`):
 * 36 steps keep its 3 s turn at 12 fps where a consumer caps it.
 */
export function WorkingRing({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      data-slot="session-working-ring"
      viewBox="0 0 16 16"
      className={cn(
        "size-3.5 shrink-0 animate-spin [animation-duration:3s] motion-reduce:animate-none",
        className,
      )}
    >
      <circle
        cx="8"
        cy="8"
        r="6.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2.6 2.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Lucide's `circle-dashed-check`, drawn here: it is not in every lucide a
 *  consumer pins. The arcs are lucide's own `circle-dashed`, plus its
 *  standard check, so a finished session wears the working ring, closed. */
export function CircleDashedCheck({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-3.5 shrink-0", className)}
    >
      <path d="M10.1 2.182a10 10 0 0 1 3.8 0" />
      <path d="M13.9 21.818a10 10 0 0 1-3.8 0" />
      <path d="M17.609 3.721a10 10 0 0 1 2.69 2.7" />
      <path d="M2.182 13.9a10 10 0 0 1 0-3.8" />
      <path d="M20.279 17.609a10 10 0 0 1-2.7 2.69" />
      <path d="M21.818 10.1a10 10 0 0 1 0 3.8" />
      <path d="M3.721 6.391a10 10 0 0 1 2.7-2.69" />
      <path d="M6.391 20.279a10 10 0 0 1-2.69-2.7" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
