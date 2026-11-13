import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import {
  SessionRowCard,
  SessionRowSlim,
  type SessionDropVerb,
} from "../../../src/components/session-sidebar/session-row.tsx";
import { contrastExempt } from "../../lib/a11y.ts";
import { ProjectBadgeStack } from "../../../src/components/session-sidebar/session-row-parts.tsx";
import {
  SessionSidebarPinDropZone,
  SessionSidebarSectionLabel,
} from "../../../src/components/session-sidebar/session-sidebar-list.tsx";
import {
  SESSIONS,
  SETTLED,
  SNOOZED,
  SNOOZE_PRESETS,
  agentIcon,
  badgeFor,
  workingDuration,
  type FixtureSession,
} from "./fixtures.tsx";

const noop = () => {};

function Card({
  s,
  active = false,
  renaming = false,
  dragging = false,
  dropVerb = null,
  onSettle = noop,
}: {
  s: FixtureSession;
  active?: boolean;
  renaming?: boolean;
  dragging?: boolean;
  dropVerb?: SessionDropVerb | null;
  onSettle?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <SessionRowCard
      session={s}
      status={s.status}
      topStatus={s.topStatus}
      shouldRecede={!active && (s.status === "working" || (s.topStatus === null && !s.woke))}
      isUnread={s.unread}
      isWoke={s.woke}
      isActive={active}
      isRenaming={renaming}
      isDragging={dragging}
      accessibleLabel={`${s.title}, ${s.projectName}`}
      hoverCardDisabled
      surface={{ onClick: noop, onDoubleClick: noop, onKeyDown: noop, onContextMenu: noop }}
      onSettle={onSettle}
      onCommitRename={noop}
      onCancelRename={noop}
      badge={badgeFor(s.project)}
      isPinned={s.pinned}
      dragOffset={0}
      dropVerb={dropVerb}
      settleShortcut="⌘⇧S"
      snoozeMenuOpen={menuOpen}
      onSnoozeMenuOpenChange={setMenuOpen}
      getSnoozePresets={() => SNOOZE_PRESETS}
      onPointerDown={noop}
      onSnooze={noop}
      onCustomSnooze={noop}
      onUnpin={noop}
      onAcknowledgeWoke={noop}
      workingDuration={workingDuration(s)}
      agentIcon={agentIcon(s.agent)}
    />
  );
}

function Slim({ s }: { s: FixtureSession }) {
  return (
    <SessionRowSlim
      session={s}
      status={s.status}
      topStatus={s.topStatus}
      shouldRecede
      isUnread={false}
      isWoke={false}
      isActive={false}
      isRenaming={false}
      isDragging={false}
      accessibleLabel={`${s.title}, ${s.projectName}`}
      hoverCardDisabled
      surface={{ onClick: noop, onDoubleClick: noop, onKeyDown: noop, onContextMenu: noop }}
      onSettle={noop}
      onCommitRename={noop}
      onCancelRename={noop}
      badge={badgeFor(s.project)}
      onWake={noop}
      onUnsettle={noop}
      snoozeRemaining={s.snoozedUntil ? "3h" : null}
    />
  );
}

const meta = {
  title: "Shell/SessionSidebar/Rows",
  component: SessionRowCard,
  decorators: [
    (Story) => (
      <TooltipPrimitive.Provider delay={150} closeDelay={0} timeout={400}>
        <div className="w-[244px] bg-sidebar px-2 py-1.5 text-foreground">
          <Story />
        </div>
      </TooltipPrimitive.Provider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "A session in the sidebar. The card (pinned and active) carries the project, a status slot that gives way to snooze and Settle under the pointer, the title, and the branch with the agent's mark; the slim row is a shelf's. The app resolves the status; the row draws it.",
      },
    },
  },
} satisfies Meta<typeof SessionRowCard>;

export default meta;
type Story = StoryObj;

const byId = (id: string) => SESSIONS.find((s) => s.threadId === id)!;

/** Every status the slot can show, the open session first. */
export const Statuses: Story = {
  render: () => (
    <div role="list" aria-label="Sessions" className="flex flex-col">
      <Card s={byId("t-working")} active />
      <Card s={byId("t-pinned")} />
      <Card s={byId("t-input")} />
      <Card s={byId("t-done")} />
      <Card s={byId("t-failed")} />
      <Card s={byId("t-woke")} />
      <Card s={byId("t-quiet")} />
    </div>
  ),
};

export const LongTitle: Story = {
  render: () => (
    <div role="list" aria-label="Sessions" className="flex flex-col">
      <Card s={byId("t-long")} />
    </div>
  ),
};

export const Renaming: Story = {
  render: () => (
    <div role="list" aria-label="Sessions" className="flex flex-col">
      <Card s={byId("t-quiet")} renaming />
    </div>
  ),
};

/** Mid-drag: the row lifts and says what a drop would do; the pinned block
 *  offers a drop zone, and the boundary below lights up. */
export const Dragging: Story = {
  render: () => (
    <div className="flex flex-col gap-1">
      <div role="list" aria-label="Pinned sessions" className="flex flex-col">
        <SessionSidebarPinDropZone over />
      </div>
      <div role="list" aria-label="Sessions" className="flex flex-col">
        <Card s={byId("t-quiet")} dragging dropVerb="pin" />
      </div>
      <SessionSidebarSectionLabel tone="accent">Drop to unpin</SessionSidebarSectionLabel>
    </div>
  ),
};

/** A project with others attached: the badges stack, two and "…". */
export const AttachedProjects: Story = {
  render: () => {
    const s = byId("t-quiet");
    return (
      <div role="list" aria-label="Sessions" className="flex flex-col">
        <SessionRowCard
          session={{ ...s, viaAttached: true }}
          status="ready"
          topStatus={null}
          shouldRecede={false}
          isUnread={false}
          isWoke={false}
          isActive={false}
          isRenaming={false}
          isDragging={false}
          accessibleLabel={s.title}
          hoverCardDisabled
          surface={{ onClick: noop, onDoubleClick: noop, onKeyDown: noop, onContextMenu: noop }}
          onSettle={noop}
          onCommitRename={noop}
          onCancelRename={noop}
          badge={
            <ProjectBadgeStack
              badge={badgeFor("docs")}
              attached={[badgeFor("atlas"), badgeFor("server"), badgeFor("design")]}
              title="docs-atlas, with atlas, server, design attached"
            />
          }
          isPinned={false}
          dragOffset={0}
          dropVerb={null}
          settleShortcut={null}
          snoozeMenuOpen={false}
          onSnoozeMenuOpenChange={noop}
          getSnoozePresets={() => SNOOZE_PRESETS}
          onPointerDown={noop}
          onSnooze={noop}
          onCustomSnooze={noop}
          onUnpin={noop}
          onAcknowledgeWoke={noop}
        />
      </div>
    );
  },
};

/** The shelves' rows: a snoozed one counting down, the settled ones with
 *  their age. Their badges recede with them. */
export const ShelfRows: Story = {
  parameters: contrastExempt("decorative"),
  render: () => (
    <div role="list" aria-label="Sessions" className="flex flex-col">
      {[...SNOOZED, ...SETTLED].map((s) => (
        <Slim key={s.threadId} s={s} />
      ))}
    </div>
  ),
};

/** Settle is a sibling of the row's press target, not inside it: pressing it
 *  settles, and does not open the session. */
export const SettleFromHover: Story = {
  render: function Render() {
    const [settled, setSettled] = useState(false);
    const onSettle = fn(() => setSettled(true));
    return settled ? (
      <p className="px-2 text-xs text-muted-foreground">Settled.</p>
    ) : (
      <div role="list" aria-label="Sessions" className="flex flex-col">
        <Card s={byId("t-quiet")} onSettle={onSettle} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole("button", { name: /Tidy the README voice/ }));
    await userEvent.click(canvas.getByRole("button", { name: "Settle session" }));
    await expect(canvas.getByText("Settled.")).toBeVisible();
  },
};
