"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import {
  AlarmClock,
  AlarmClockOff,
  Check,
  CircleAlert,
  Clock,
  GitBranch,
  MessageCircleQuestion,
  Pin,
  PinOff,
  Undo2,
} from "lucide-react";

import { cn } from "../../lib/utils.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "../../ui/dropdown-menu.tsx";
import { Hint } from "../../ui/tooltip.tsx";
import {
  AttachedMark,
  CircleDashedCheck,
  RelativeTime,
  WorkingRing,
} from "./session-row-parts.tsx";

/**
 * One session in the session sidebar, in three shapes, props only:
 *
 *  - `SessionRowCard`, the pinned and active sessions: the project on top
 *    (badge, name, pin) with the status slot at its end, the title under it,
 *    and the branch, its pull request and the agent on the third line.
 *  - `SessionRowSlim`, the Snoozed and Settled shelves: badge, title, and
 *    when it was settled or how long until it wakes.
 *  - `SessionSearchResult`, the header search's results: flat, one line, the
 *    settled ones dimmed, highlighted by the search field's arrow keys.
 *
 * The app resolves everything a row says (its status, whether it recedes,
 * its accessible name) and owns what it does; the row draws it and reports
 * presses. The project badge, the agent's mark, the pull request badge, the
 * turn clock and the hover card's body are the app's, passed in as nodes.
 *
 * The status slot swaps on hover. At rest it says what the session is doing
 * or, for a quiet one, how long ago it moved; under the pointer it gives way
 * to snooze and Settle. A Woke marker stays put: it is a button (it dismisses
 * itself). The rest of a row's actions belong on right-click (`onContextMenu`
 * on the surface), so the hover row stays two controls.
 *
 * Every row is a `Tooltip.Root` whose trigger is the row: the hover card is a
 * `SessionRowHoverCard` passed as `hoverCard`. Wrap the list in one
 * `Tooltip.Provider` so moving between rows does not wait out the delay.
 */

/** Slot heights a list virtualizes on. A card renders 63px (three lines at
 *  the type scale) with 2px above and below; a slim or search row is 36px. */
export const SESSION_ROW_CARD_HEIGHT = 67;
export const SESSION_ROW_SLIM_HEIGHT = 36;

/** What a session is doing, as the row's colours read it. */
export type SessionRowStatus = "input" | "working" | "failed" | "ready";

/** The status slot's label; `null` is a quiet row, which shows its time. */
export type SessionTopStatus = "input" | "working" | "failed" | "woke" | "done";

/** What a drop would do to the row being dragged. */
export type SessionDropVerb = "pin" | "unpin";

export const SESSION_TOP_STATUS: Record<SessionTopStatus, { label: string; className: string }> = {
  input: { label: "Needs input", className: "text-warning" },
  working: { label: "Working", className: "text-info" },
  failed: { label: "Failed", className: "text-error" },
  woke: { label: "Woke", className: "text-warning" },
  done: { label: "Done", className: "text-success" },
};

/** The fields of a session a row draws. An app's own session type can be
 *  passed as is when it has these. */
export interface SessionRowData {
  threadId: string;
  title: string;
  projectName: string;
  branch?: string | null;
  /** When the session last moved (ISO). */
  updatedAt: string | null;
  /** When it was settled (ISO); `null` while it is not. */
  settledAt: string | null;
  /** When a running snooze ends (ISO); `null` while it is not snoozed. */
  snoozedUntil: string | null;
  /** Listed under a project filter because that project is attached to it. */
  viaAttached?: boolean;
}

/** One choice in the snooze menu. */
export interface SessionSnoozePreset {
  id: string;
  label: string;
  /** When it ends, as the menu's trailing hint ("17:00", "Mon 09:00"). */
  whenLabel: string;
  /** When it ends (ISO): what `onSnooze` is given. */
  until: string;
}

/** What the row surface itself answers to; the same in every shape. */
export interface SessionRowSurfaceHandlers {
  onClick: (event: MouseEvent) => void;
  onDoubleClick: (event: MouseEvent) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onContextMenu: () => void;
}

/** What both list row shapes take. */
export interface SessionRowViewProps {
  session: SessionRowData;
  status: SessionRowStatus;
  topStatus: SessionTopStatus | null;
  /** A session already seen, or one an agent is busy with, steps back. */
  shouldRecede: boolean;
  isUnread: boolean;
  isWoke: boolean;
  /** The open session. */
  isActive: boolean;
  /** The title is a rename field. */
  isRenaming: boolean;
  isDragging: boolean;
  /** The row's accessible name: title, status, project. */
  accessibleLabel: string;
  hoverCardDisabled: boolean;
  surface: SessionRowSurfaceHandlers;
  onSettle: () => void;
  onCommitRename: (title: string) => void;
  onCancelRename: () => void;
  /** The project badge: a `ProjectBadge` or `ProjectBadgeStack`. */
  badge: ReactNode;
  /** The hover card: a `SessionRowHoverCard`. */
  hoverCard?: ReactNode;
}

/** A click on a control inside the row: handled here, not as an open. */
const stopThen = (run: () => void) => (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
  run();
};

function rowSurfaceClassName(props: {
  isActive: boolean;
  shouldRecede: boolean;
  isDragging: boolean;
}): string {
  return cn(
    "group/sidebar-row relative w-full cursor-pointer overflow-hidden rounded-md text-left select-none",
    props.isActive
      ? "bg-element-selected text-foreground"
      : props.shouldRecede
        ? "text-muted-foreground hover:bg-element-hover hover:text-foreground"
        : "bg-transparent text-foreground hover:bg-element-hover",
    props.isDragging && "bg-element-selected text-foreground shadow-lg",
  );
}

/**
 * The row's button: an empty box filling the row, under its content, and the
 * row's one Tab stop. The row's controls (snooze, Settle, the pull request
 * badge) are its siblings, not its children: inside a `role="button"` they
 * would be nested controls, and WebKit delivers an accessibility press to
 * whatever control sits at the button's centre, so pressing the row opened
 * the snooze menu instead of the session. A press on this empty box lands on
 * the box itself and bubbles to the row's click handler, as a click on the
 * row's content does.
 */
function RowPressTarget(props: {
  label: string;
  current: boolean;
  testId: string;
  onKeyDown: (event: KeyboardEvent) => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={props.label}
      aria-current={props.current || undefined}
      data-testid={props.testId}
      onKeyDown={props.onKeyDown}
      className="absolute inset-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
    />
  );
}

/** The status slot's glyph; Woke draws its own. */
export function SessionTopStatusIcon({ status }: { status: SessionTopStatus }) {
  if (status === "working") return <WorkingRing />;
  if (status === "input")
    return <MessageCircleQuestion aria-hidden className="size-3.5 shrink-0" />;
  if (status === "failed") return <CircleAlert aria-hidden className="size-3.5 shrink-0" />;
  if (status === "done") return <CircleDashedCheck />;
  return null;
}

function SnoozeMenuButton({
  open,
  onOpenChange,
  getPresets,
  onSnooze,
  onCustomSnooze,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getPresets: () => readonly SessionSnoozePreset[];
  onSnooze: (until: string) => void;
  onCustomSnooze: () => void;
}) {
  const presets = open ? getPresets() : [];
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <Hint label="Snooze session" side="top">
        <MenuPrimitive.Trigger
          render={
            <button
              type="button"
              aria-label="Snooze session"
              onClick={(event) => event.stopPropagation()}
              onDoubleClick={(event) => event.stopPropagation()}
              className="inline-flex h-full cursor-pointer items-center gap-0.5 rounded-md bg-transparent px-1.5 text-xs text-muted-foreground hover:text-foreground"
            />
          }
        >
          <Clock aria-hidden className="size-3" />
        </MenuPrimitive.Trigger>
      </Hint>
      <DropdownMenuContent side="bottom" align="end">
        {presets.map((preset) => (
          <DropdownMenuItem
            key={preset.id}
            onClick={(event) => {
              event.stopPropagation();
              onSnooze(preset.until);
            }}
          >
            {preset.label}
            <DropdownMenuShortcut>{preset.whenLabel}</DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onCustomSnooze();
          }}
        >
          Custom…
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** The title, or its rename field. The field commits on Enter or blur and
 *  gives up on Escape. */
function RowTitle({
  title,
  className,
  isRenaming,
  onCommit,
  onCancel,
}: {
  title: string;
  className: string;
  isRenaming: boolean;
  onCommit: (title: string) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(title);
  const committed = useRef(false);
  useEffect(() => {
    if (!isRenaming) return;
    committed.current = false;
    setDraft(title);
  }, [isRenaming, title]);
  if (!isRenaming) {
    return (
      <span aria-hidden dir="auto" className={className}>
        {title}
      </span>
    );
  }
  return (
    <input
      autoFocus
      value={draft}
      dir="auto"
      aria-label="Session title"
      onChange={(event) => setDraft(event.target.value)}
      onFocus={(event) => event.currentTarget.select()}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.nativeEvent.isComposing || event.keyCode === 229) return;
        if (event.key === "Enter") {
          event.preventDefault();
          committed.current = true;
          onCommit(draft);
        } else if (event.key === "Escape") {
          event.preventDefault();
          committed.current = true;
          onCancel();
        }
      }}
      onBlur={() => {
        if (!committed.current) onCommit(draft);
      }}
      onClick={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      className="min-w-0 flex-1 rounded-sm border border-border bg-panel-input px-1 text-sm font-medium text-foreground outline-none focus:border-border-strong"
    />
  );
}

export interface SessionRowCardProps extends SessionRowViewProps {
  isPinned: boolean;
  /** Pixels the row is moved by a drag in progress (its own, or a sibling
   *  making room); `0` at rest. */
  dragOffset: number;
  dropVerb: SessionDropVerb | null;
  /** The settle shortcut's label, named in the open row's Settle tooltip. */
  settleShortcut: string | null;
  snoozeMenuOpen: boolean;
  onSnoozeMenuOpenChange: (open: boolean) => void;
  /** The snooze menu's choices; called only while the menu is open, so they
   *  are reckoned from the moment it opened. */
  getSnoozePresets: () => readonly SessionSnoozePreset[];
  /** A press that may become a drag. */
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onSnooze: (until: string) => void;
  /** "Custom…": the app asks for a time and snoozes until it. */
  onCustomSnooze: () => void;
  onUnpin: () => void;
  onAcknowledgeWoke: () => void;
  /** After "Working": how long the turn has run (`WorkingDurationLabel`). */
  workingDuration?: ReactNode;
  /** The third line's pull request badge. */
  pullRequest?: ReactNode;
  /** The agent's mark at the third line's end, 12px. */
  agentIcon?: ReactNode;
}

/** A pinned or active session. */
export function SessionRowCard(props: SessionRowCardProps) {
  const { session, status, topStatus, shouldRecede, isRenaming, snoozeMenuOpen } = props;
  const isWokeStatus = topStatus === "woke";

  const dragStyle: CSSProperties | undefined =
    props.dragOffset !== 0 || props.isDragging
      ? {
          transform: `translateY(${props.dragOffset}px)`,
          transition: props.isDragging ? undefined : "transform 150ms ease-out",
        }
      : undefined;

  const dragDestination = props.dropVerb ? (
    <span
      role="status"
      className="pointer-events-none ml-auto inline-flex h-5 shrink-0 items-center gap-1 rounded-sm border border-primary/40 bg-primary/10 px-1.5 text-2xs font-medium text-primary"
    >
      {props.dropVerb === "pin" ? (
        <Pin aria-hidden className="size-3" />
      ) : (
        <PinOff aria-hidden className="size-3" />
      )}
      {props.dropVerb === "pin" ? "Pin" : "Unpin"}
    </span>
  ) : null;

  const wokeButton = (
    <Hint label="Dismiss Woke notification" side="top">
      <button
        type="button"
        aria-label="Dismiss Woke notification"
        onClick={stopThen(props.onAcknowledgeWoke)}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1 rounded-sm text-xs font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
          SESSION_TOP_STATUS.woke.className,
        )}
      >
        <AlarmClock aria-hidden className="size-3.5 shrink-0" />
        <span role="status">Woke</span>
      </button>
    </Hint>
  );

  const showPin = props.isPinned && !props.isDragging;
  const pinIndicator = showPin ? (
    <Hint label="Unpin session" side="top">
      <button
        type="button"
        aria-label="Unpin session"
        onClick={stopThen(props.onUnpin)}
        className="group/unpin inline-flex cursor-pointer items-center rounded-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <Pin
          aria-hidden
          className="size-3 shrink-0 group-hover/unpin:hidden group-focus-visible/unpin:hidden"
        />
        <PinOff
          aria-hidden
          className="hidden size-3 shrink-0 group-hover/unpin:block group-focus-visible/unpin:block"
        />
      </button>
    </Hint>
  ) : null;

  return (
    <div
      role="listitem"
      data-session-row={session.threadId}
      style={dragStyle}
      className={cn("py-0.5", props.isDragging && "relative z-drag")}
    >
      <TooltipPrimitive.Root disabled={props.hoverCardDisabled}>
        <TooltipPrimitive.Trigger
          render={
            // The pointer's surface, not a control: the row's button is the
            // press target under the content (`RowPressTarget`).
            <div
              className={rowSurfaceClassName(props)}
              onClick={props.surface.onClick}
              onDoubleClick={props.surface.onDoubleClick}
              onContextMenu={props.surface.onContextMenu}
              onPointerDown={props.onPointerDown}
            />
          }
        >
          <RowPressTarget
            label={props.accessibleLabel}
            current={props.isActive}
            testId="sidebar-row-card"
            onKeyDown={props.surface.onKeyDown}
          />
          {isRenaming ? null : <span className="sr-only">{session.title}</span>}
          <div className="relative h-19.5 px-2.5 py-2">
            <div className="flex h-5 min-w-0 items-center gap-1.5">
              {props.badge}
              {/* Left of the status slot, the pin would slide when hover swaps
                  the label for the wider row controls. */}
              {pinIndicator}
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-xs text-secondary-foreground",
                  shouldRecede ? "font-normal" : "font-medium",
                )}
              >
                {session.projectName}
                {session.viaAttached && <AttachedMark />}
              </span>
              {props.isDragging ? (
                dragDestination
              ) : (
                <span
                  className={cn(
                    "relative ml-auto flex h-5 min-w-8 shrink-0 items-stretch justify-end text-xs",
                    // Keyboard focus on a control in the slot moves the status
                    // aside, as hovering the row does.
                    "[&:has(:focus-visible)>[data-yields-to-focus]]:absolute [&:has(:focus-visible)>[data-yields-to-focus]]:right-0 [&:has(:focus-visible)>[data-yields-to-focus]]:opacity-0",
                  )}
                >
                  <span
                    data-yields-to-focus={isWokeStatus ? undefined : ""}
                    className={cn(
                      isWokeStatus
                        ? "pointer-events-auto"
                        : "pointer-events-none group-hover/sidebar-row:absolute group-hover/sidebar-row:right-0 group-hover/sidebar-row:opacity-0",
                      "flex items-center self-center justify-self-end tabular-nums text-secondary-foreground transition-opacity",
                      snoozeMenuOpen && "pointer-events-none absolute right-0 opacity-0",
                    )}
                  >
                    {topStatus ? (
                      isWokeStatus ? (
                        wokeButton
                      ) : (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 font-medium",
                            SESSION_TOP_STATUS[topStatus].className,
                          )}
                        >
                          <SessionTopStatusIcon status={topStatus} />
                          {/* The label alone is the live region: a role="status"
                              wrapper around the ticking duration would make
                              screen readers announce every second. */}
                          <span role="status">{SESSION_TOP_STATUS[topStatus].label}</span>
                          {topStatus === "working" ? (
                            <span aria-hidden>{props.workingDuration}</span>
                          ) : null}
                        </span>
                      )
                    ) : (
                      <RelativeTime iso={session.updatedAt} />
                    )}
                  </span>
                  <span
                    className={cn(
                      // focus-visible, not focus-within: a mouse click leaves
                      // the Settle button focused, and a plain focus-within
                      // would keep the controls pinned over the status label
                      // once the pointer moves away. Transparent at rest, not
                      // `pointer-events-none`: WebKit drops the press action
                      // of an element that has it.
                      "absolute inset-y-0 right-0 flex items-stretch opacity-0 transition-opacity has-[:focus-visible]:static has-[:focus-visible]:opacity-100 group-hover/sidebar-row:static group-hover/sidebar-row:opacity-100",
                      snoozeMenuOpen && "static opacity-100",
                    )}
                  >
                    <SnoozeMenuButton
                      open={snoozeMenuOpen}
                      onOpenChange={props.onSnoozeMenuOpenChange}
                      getPresets={props.getSnoozePresets}
                      onSnooze={props.onSnooze}
                      onCustomSnooze={props.onCustomSnooze}
                    />
                    <Hint
                      label={
                        props.isActive && props.settleShortcut
                          ? `Settle session ${props.settleShortcut}`
                          : "Settle session"
                      }
                      side="top"
                    >
                      <button
                        type="button"
                        aria-label="Settle session"
                        onClick={stopThen(props.onSettle)}
                        className="-mr-1 inline-flex cursor-pointer items-center gap-1 rounded-md bg-transparent px-1.5 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Check aria-hidden className="size-3.5" />
                        Settle
                      </button>
                    </Hint>
                  </span>
                </span>
              )}
            </div>
            <div className="mt-1 flex min-w-0">
              <RowTitle
                title={session.title}
                isRenaming={isRenaming}
                onCommit={props.onCommitRename}
                onCancel={props.onCancelRename}
                className={cn(
                  "min-w-0 flex-1 truncate text-start text-sm transition-opacity motion-reduce:transition-none",
                  shouldRecede ? "font-normal" : "font-medium",
                  shouldRecede
                    ? "text-secondary-foreground"
                    : props.isUnread || props.isWoke || status === "input"
                      ? "text-foreground"
                      : status === "failed"
                        ? "text-foreground/95"
                        : "text-foreground/90",
                )}
              />
            </div>
            <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-secondary-foreground">
              {session.branch ? (
                <>
                  <GitBranch aria-hidden className="size-3 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate text-muted-foreground">
                    {session.branch}
                  </span>
                </>
              ) : (
                <span className="flex-1" />
              )}
              {props.pullRequest}
              <span
                aria-hidden
                className="pointer-events-none ml-auto inline-flex shrink-0 items-center gap-1 opacity-60"
              >
                {props.agentIcon}
              </span>
            </div>
          </div>
        </TooltipPrimitive.Trigger>
        {props.hoverCard}
      </TooltipPrimitive.Root>
    </div>
  );
}

export interface SessionRowSlimProps extends SessionRowViewProps {
  onWake: () => void;
  onUnsettle: () => void;
  /** A snoozed row's time left ("45m", "3h"), ageing on `useMinuteClock`. */
  snoozeRemaining?: ReactNode;
}

/** A shelf's session. Under the pointer the time gives way to the one
 *  control the shelf offers: Wake, Un-settle, or Settle. */
export function SessionRowSlim(props: SessionRowSlimProps) {
  const { session, status, shouldRecede, isRenaming } = props;
  const settled = session.settledAt !== null;
  const snoozed = session.snoozedUntil !== null;
  return (
    <div role="listitem" data-session-row={session.threadId}>
      <TooltipPrimitive.Root disabled={props.hoverCardDisabled}>
        <TooltipPrimitive.Trigger
          render={
            // The pointer's surface; the button is `RowPressTarget`, under
            // the content (see there). The content is `relative` to sit
            // above it.
            <div
              className={cn(rowSurfaceClassName(props), "flex h-9 items-center gap-2.5 px-2.5")}
              onClick={props.surface.onClick}
              onDoubleClick={props.surface.onDoubleClick}
              onContextMenu={props.surface.onContextMenu}
            />
          }
        >
          <RowPressTarget
            label={props.accessibleLabel}
            current={props.isActive}
            testId="sidebar-row-slim"
            onKeyDown={props.surface.onKeyDown}
          />
          {isRenaming ? null : <span className="sr-only">{session.title}</span>}
          <span
            className={cn(
              "relative flex shrink-0 items-center gap-1 transition-opacity",
              (!props.isActive || settled || snoozed) &&
                "opacity-40 grayscale group-focus-within/sidebar-row:opacity-100 group-focus-within/sidebar-row:grayscale-0 group-hover/sidebar-row:opacity-100 group-hover/sidebar-row:grayscale-0",
            )}
          >
            {props.badge}
          </span>
          <RowTitle
            title={session.title}
            isRenaming={isRenaming}
            onCommit={props.onCommitRename}
            onCancel={props.onCancelRename}
            className={cn(
              "relative min-w-0 flex-1 truncate text-start text-sm transition-opacity group-focus-within/sidebar-row:text-foreground group-hover/sidebar-row:text-foreground motion-reduce:transition-none",
              shouldRecede ? "font-normal" : "font-medium",
              shouldRecede
                ? "text-secondary-foreground/70"
                : props.isActive || props.isWoke || status === "input"
                  ? "text-foreground"
                  : props.isUnread
                    ? "text-muted-foreground"
                    : "text-secondary-foreground/70",
            )}
          />
          {session.viaAttached && <AttachedMark />}
          <span className="relative ml-auto flex h-6 min-w-8 shrink-0 items-center justify-end">
            {snoozed ? (
              <span className="inline-flex items-center justify-end gap-1 text-xs tabular-nums text-info transition-opacity group-hover/sidebar-row:opacity-0">
                <AlarmClock aria-hidden className="size-3 shrink-0" />
                {props.snoozeRemaining}
              </span>
            ) : (
              <span className="inline-flex justify-end text-xs tabular-nums text-secondary-foreground transition-opacity group-hover/sidebar-row:opacity-0">
                <RelativeTime iso={settled ? session.settledAt : session.updatedAt} />
              </span>
            )}
            <span className="absolute inset-y-0 right-0 -mr-1 flex items-stretch opacity-0 transition-opacity has-[:focus-visible]:opacity-100 group-hover/sidebar-row:opacity-100">
              {snoozed ? (
                <Hint label="Wake session" side="top">
                  <button
                    type="button"
                    aria-label="Wake session"
                    onClick={stopThen(props.onWake)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-transparent px-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <AlarmClockOff aria-hidden className="size-3.5" />
                  </button>
                </Hint>
              ) : settled ? (
                <Hint label="Un-settle session" side="top">
                  <button
                    type="button"
                    aria-label="Un-settle session"
                    onClick={stopThen(props.onUnsettle)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-transparent px-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Undo2 aria-hidden className="mb-px size-3.5" />
                  </button>
                </Hint>
              ) : (
                <Hint label="Settle session" side="top">
                  <button
                    type="button"
                    aria-label="Settle session"
                    onClick={stopThen(props.onSettle)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-transparent px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Check aria-hidden className="size-3" />
                  </button>
                </Hint>
              )}
            </span>
          </span>
        </TooltipPrimitive.Trigger>
        {props.hoverCard}
      </TooltipPrimitive.Root>
    </div>
  );
}

export interface SessionSearchResultProps {
  session: Pick<SessionRowData, "threadId" | "title" | "settledAt" | "updatedAt">;
  /** The option's DOM id, `sessionSearchResultId(index)`: the search field's
   *  `aria-activedescendant` points at it. */
  resultId: string;
  /** The search field's arrow keys are on it. */
  isHighlighted: boolean;
  isActive: boolean;
  accessibleLabel: string;
  hoverCardDisabled: boolean;
  badge: ReactNode;
  hoverCard?: ReactNode;
  onHighlight: () => void;
  onSelect: () => void;
  onContextMenu: () => void;
}

/** A row in the header search's results: an option of the results listbox,
 *  highlighted by the search field rather than focused. */
export function SessionSearchResult(props: SessionSearchResultProps) {
  const { session } = props;
  const isSettled = session.settledAt !== null;
  return (
    <li role="presentation" className="list-none">
      <TooltipPrimitive.Root disabled={props.hoverCardDisabled}>
        <TooltipPrimitive.Trigger
          render={
            <button
              id={props.resultId}
              data-session-row={session.threadId}
              type="button"
              role="option"
              tabIndex={-1}
              aria-selected={props.isHighlighted}
              aria-current={props.isActive || undefined}
              aria-label={props.accessibleLabel}
              onMouseMove={props.onHighlight}
              onClick={props.onSelect}
              onContextMenu={props.onContextMenu}
              className={cn(
                "group/sidebar-row flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1 text-left text-sm outline-none",
                props.isHighlighted || props.isActive
                  ? "bg-element-selected text-foreground"
                  : "text-muted-foreground hover:bg-element-hover hover:text-foreground",
              )}
            />
          }
        >
          <span
            className={cn(
              "flex shrink-0 transition-opacity",
              isSettled &&
                !props.isActive &&
                !props.isHighlighted &&
                "opacity-40 grayscale group-hover/sidebar-row:opacity-100 group-hover/sidebar-row:grayscale-0",
            )}
          >
            {props.badge}
          </span>
          <span
            className={cn(
              "min-w-0 flex-1 truncate",
              isSettled
                ? "font-normal text-secondary-foreground/70 group-hover/sidebar-row:text-foreground"
                : "font-medium text-foreground",
              (props.isHighlighted || props.isActive) && "text-foreground",
            )}
          >
            {session.title}
          </span>
          <span className="w-8 shrink-0 text-right text-xs tabular-nums text-disabled">
            <RelativeTime iso={session.updatedAt} />
          </span>
        </TooltipPrimitive.Trigger>
        {props.hoverCard}
      </TooltipPrimitive.Root>
    </li>
  );
}

/** The card a row shows on hover, beside it: the frame, with the app's lines
 *  as `children`. Pass it as a row's `hoverCard`; mount the lines' reads
 *  inside `children` so they cost nothing for rows merely on screen. */
export function SessionRowHoverCard({ children }: { children: ReactNode }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        side="right"
        align="start"
        sideOffset={4}
        // Hidden while its row is clipped out of the list's view, rather
        // than left pinned to the list's edge.
        className="isolate z-tooltip data-anchor-hidden:invisible"
      >
        <TooltipPrimitive.Popup
          className={cn(
            "max-w-80 rounded-lg border border-border-subtle px-2 text-left whitespace-normal",
            "glass-hud backdrop-blur-glass bg-gradient-to-b from-popover/85 to-card/90",
            "origin-[var(--transform-origin)] animate-scale-in",
          )}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}
