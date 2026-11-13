import {
  Bell,
  BookOpen,
  BrainIcon,
  ChartColumn,
  GitBranch,
  History,
  Inbox,
  MessagesSquare,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

import { ClaudeCodeMark, CodexMark } from "../../../src/components/ui/brand-marks.tsx";
import {
  ProjectBadge,
  WorkingDurationLabel,
} from "../../../src/components/session-sidebar/session-row-parts.tsx";
import type {
  SessionRowData,
  SessionRowStatus,
  SessionSnoozePreset,
  SessionTopStatus,
} from "../../../src/components/session-sidebar/session-row.tsx";
import { SessionSidebarDestination } from "../../../src/components/session-sidebar/session-sidebar.tsx";

/**
 * Fixture data for the session sidebar stories: a handful of projects and
 * sessions in every state a row can be in, and the destinations desktop
 * fills the sidebar with. Times are relative to when the story loads, so the
 * ages read the same every day.
 */

const MINUTE = 60_000;
const ago = (minutes: number) => new Date(Date.now() - minutes * MINUTE).toISOString();
const ahead = (minutes: number) => new Date(Date.now() + minutes * MINUTE).toISOString();

export const PROJECTS = {
  atlas: { name: "atlas", monogram: "AT", color: "var(--hue-blue)" },
  server: { name: "server", monogram: "SE", color: "var(--hue-green)" },
  design: { name: "design", monogram: "DE", color: "var(--hue-purple)" },
  docs: { name: "docs-atlas", monogram: "DO", color: "var(--hue-orange)" },
} as const;

export type ProjectKey = keyof typeof PROJECTS;

export function badgeFor(project: ProjectKey, className?: string) {
  const p = PROJECTS[project];
  return <ProjectBadge monogram={p.monogram} color={p.color} className={className} />;
}

/** One fixture session: what a row draws, plus how the app would resolve it. */
export interface FixtureSession extends SessionRowData {
  project: ProjectKey;
  agent: "claude" | "codex";
  status: SessionRowStatus;
  topStatus: SessionTopStatus | null;
  unread: boolean;
  woke: boolean;
  pinned: boolean;
  /** For "Working": when the turn started (epoch ms). */
  turnStartedAt?: number;
}

function session(
  threadId: string,
  title: string,
  project: ProjectKey,
  rest: Partial<FixtureSession> = {},
): FixtureSession {
  return {
    threadId,
    title,
    project,
    projectName: PROJECTS[project].name,
    branch: null,
    updatedAt: ago(30),
    settledAt: null,
    snoozedUntil: null,
    agent: "claude",
    status: "ready",
    topStatus: null,
    unread: false,
    woke: false,
    pinned: false,
    ...rest,
  };
}

export const LONG_TITLE =
  "Move the sidebar's presentation into the design package so the web app can draw the same one over its own data";

export const SESSIONS: FixtureSession[] = [
  session("t-pinned", "Release checklist for 0.5", "atlas", {
    pinned: true,
    branch: "release/0.5",
    updatedAt: ago(4 * 60),
  }),
  session("t-input", "Wire the inbox poll into the org switcher", "server", {
    status: "input",
    topStatus: "input",
    branch: "uzayer/inbox-poll",
    updatedAt: ago(2),
    agent: "codex",
  }),
  session("t-working", "Port the timeline's work log", "atlas", {
    status: "working",
    topStatus: "working",
    branch: "uzayer/work-log",
    updatedAt: ago(1),
    turnStartedAt: Date.now() - 95_000,
  }),
  session("t-done", "Fix the diff hunk header contrast", "design", {
    topStatus: "done",
    unread: true,
    branch: "fix/hunk-contrast",
    updatedAt: ago(12),
  }),
  session("t-failed", "Regenerate the session-delta bindings", "atlas", {
    status: "failed",
    topStatus: "failed",
    updatedAt: ago(40),
  }),
  session("t-woke", "Follow up on the Linux glibc floor", "docs", {
    topStatus: "woke",
    woke: true,
    updatedAt: ago(3 * 60),
  }),
  session("t-long", LONG_TITLE, "design", {
    branch: "uzayermasud/session-sidebar-with-a-very-long-branch-name",
    updatedAt: ago(2 * 24 * 60),
    agent: "codex",
  }),
  session("t-quiet", "Tidy the README voice", "docs", { updatedAt: ago(9 * 24 * 60) }),
];

export const SNOOZED: FixtureSession[] = [
  session("t-snoozed", "Benchmark the virtualised list at 5k rows", "atlas", {
    snoozedUntil: ahead(3 * 60),
    updatedAt: ago(26 * 60),
  }),
];

export const SETTLED: FixtureSession[] = [
  session("t-settled-1", "Clear the last colour-contrast failures", "atlas", {
    settledAt: ago(5 * 60),
  }),
  session("t-settled-2", "Drop the colour-contrast allowlist", "server", {
    settledAt: ago(3 * 24 * 60),
  }),
];

/** Many sessions, for the scroller: the fixtures again under new ids. */
export function manySessions(count: number): FixtureSession[] {
  return Array.from({ length: count }, (_, i) => {
    const base = SESSIONS[i % SESSIONS.length]!;
    return {
      ...base,
      threadId: `${base.threadId}-${i}`,
      title: `${base.title} (${i + 1})`,
      pinned: false,
    };
  });
}

export function agentIcon(agent: FixtureSession["agent"]): ReactNode {
  return agent === "codex" ? (
    <CodexMark className="size-3" />
  ) : (
    <ClaudeCodeMark className="size-3" />
  );
}

export function workingDuration(s: FixtureSession): ReactNode {
  return s.turnStartedAt ? <WorkingDurationLabel startedAt={s.turnStartedAt} /> : null;
}

export const SNOOZE_PRESETS: readonly SessionSnoozePreset[] = [
  { id: "hour", label: "In 1 hour", whenLabel: "18:30", until: ahead(60) },
  { id: "three-hours", label: "In 3 hours", whenLabel: "20:30", until: ahead(180) },
  { id: "tomorrow", label: "Tomorrow", whenLabel: "09:00", until: ahead(15 * 60) },
];

/** The labelled destinations desktop puts under the picker. */
export function Destinations({ active = "inbox" }: { active?: string }) {
  return (
    <>
      <SessionSidebarDestination icon={Inbox} label="Inbox" active={active === "inbox"} dot />
      <SessionSidebarDestination
        icon={MessagesSquare}
        label="Team chat"
        active={active === "team-chat"}
      />
      <SessionSidebarDestination icon={History} label="Timeline" active={active === "timeline"} />
      <SessionSidebarDestination icon={Sparkles} label="Agent" active={active === "agent"} />
    </>
  );
}

/** The footer dock's icons, and the bell for its trailing capsule. */
export function DockItems() {
  return (
    <>
      <SessionSidebarDestination icon={BrainIcon} label="Memory" iconOnly round />
      <SessionSidebarDestination icon={BookOpen} label="Knowledge" iconOnly round />
      <SessionSidebarDestination icon={GitBranch} label="Source control" iconOnly round />
      <SessionSidebarDestination icon={ChartColumn} label="Usage" iconOnly round />
    </>
  );
}

export function NotificationsBell() {
  return <SessionSidebarDestination icon={Bell} label="Notifications" iconOnly round dot />;
}
