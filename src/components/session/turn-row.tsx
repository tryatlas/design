"use client";

import {
  BrainIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  CircleIcon,
  GitCommitHorizontalIcon,
  PaperclipIcon,
} from "lucide-react";
import { Fragment, memo, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import type { Options } from "react-markdown";

import { cn } from "../../lib/utils.ts";
import { Icon } from "../../ui/icon.tsx";
import { Callout } from "../ui/callout.tsx";
import { DiffStat } from "../ui/code-block.tsx";
import { Spinner } from "../ui/spinner.tsx";
import { formatBytes, useWindow } from "./session-view-helpers.ts";
import type {
  AgentItem,
  AttachmentView,
  BodyLoad,
  CheckpointView,
  CommentAnchor,
  DiffData,
  PlanItem,
  StreamingState,
  ToolCallView,
  TurnView,
} from "./session-view.ts";
import { StreamingMarkdown } from "./streaming-markdown.tsx";
import { TOOL_KIND_ICON, ToolCallCard } from "./tool-call-card.tsx";
import type { ToolCallCardProps } from "./tool-call-card.tsx";

/**
 * One turn of a session: the prompt, what the agent did, the commits it made
 * and how it ended. Desktop's transcript turn, as a props-only view.
 *
 * The prompt is a right-aligned bubble, clamped to twelve whole lines behind
 * "Show more". The agent's work reads down the page in order: prose, a folded
 * "Thought process", runs of tool calls (a run longer than three folds behind
 * one counted line), the plan as a checklist. Checkpoints come last, as cards:
 * a commit is a boundary in the session, observed after the work that made
 * it. A failed turn ends on an error callout; an expired sign-in says so and
 * carries the app's action (`errorAction`), since the row cannot route.
 *
 * Nothing here reads a store or fetches. Comments come in through
 * `commentSlot`, anchored to the prompt, each answer, call and checkpoint.
 *
 * Memoised: keep the callbacks and `rehypePlugins` stable and pass the same
 * `turn` object while it is unchanged, and a streaming frame re-renders only
 * the turn that is streaming.
 */

type RehypePlugins = Options["rehypePlugins"];

export interface TurnRowProps {
  turn: TurnView;
  /** The session's streaming state, passed to the last turn only. */
  streaming?: StreamingState;
  /** The app's comment control, beside each anchorable thing. */
  commentSlot?: (anchor: CommentAnchor) => ReactNode;
  /** Renders prose. Defaults to `StreamingMarkdown`. */
  renderMarkdown?: (source: string, streaming: boolean) => ReactNode;
  /** For the default `renderMarkdown`, e.g. `[rehypeHighlight]`. */
  rehypePlugins?: RehypePlugins;
  /** A truncated payload's "Load full …". */
  onLoadPayload?: (callId: string, part: "input" | "output") => void;
  renderDiff?: (diff: DiffData) => ReactNode;
  /** Inside a failed turn's callout: what the person can do (sign in again). */
  errorAction?: ReactNode;
  /** Under the prompt and under each agent item (each call, in a run), outside any disclosure. */
  renderItemFooter?: (item: AgentItem | { kind: "user"; id: string }) => ReactNode;
  /**
   * Under each checkpoint card: `renderItemFooter`'s counterpart for commits
   * (a separate prop, so existing `renderItemFooter` handlers keep their type).
   */
  renderCheckpointFooter?: (checkpoint: CheckpointView) => ReactNode;
  /** Tool calls held open; a run holding one unfolds. Pair with `onOpenToolCallIdsChange`. */
  openToolCallIds?: ReadonlySet<string>;
  /** A card was toggled: the next set, with its id added or removed. */
  onOpenToolCallIdsChange?: (next: ReadonlySet<string>) => void;
  /** The thinking disclosure's label. Defaults to "Thinking…" while it streams, else "Thought process". */
  thinkingLabel?: (state: { streaming: boolean }) => ReactNode;
  /** How an opened thought renders: as plain text (the default) or as markdown. */
  thinkingBody?: "markdown" | "text";
  /** Makes each prompt image and file a button that opens it. */
  onOpenAttachment?: (attachment: AttachmentView, index: number) => void;
  /** Passed to each `ToolCallCard`: Copy on each text payload. */
  onCopyPayload?: ToolCallCardProps["onCopy"];
  /**
   * A truncated prompt's or answer's "Read the rest": asks the app for the
   * whole body by the item's id. The item's `load` shows the fetch in flight
   * and a failure (clicking again retries). Unset, a truncated body says
   * "Truncated".
   */
  onLoadBody?: (id: string) => void;
  /**
   * Folded runs held open, by call id: a run of more than three calls is open
   * while it holds any of these. Unset, each run folds itself (and unfolds
   * when `openToolCallIds` starts to hold one of its calls). Set, the host
   * decides alone; pair it with `onOpenToolRunIdsChange`, or the runs cannot
   * be toggled.
   */
  openToolRunIds?: ReadonlySet<string>;
  /** A run was toggled: unfolding adds its first call's id, folding removes all of its ids. */
  onOpenToolRunIdsChange?: (next: ReadonlySet<string>) => void;
  /**
   * A tool call to keep drawn, by id: drawn even past its run's window, and an
   * uncontrolled folded run holding it unfolds. `SessionTimeline` passes its
   * own `revealItemId` to the turn that holds it.
   */
  revealItemId?: string;
  /**
   * Clamps each long answer to 340px behind "Show more", fading out under
   * the button: desktop's session-detail clamp. An answer only a little over
   * (up to 400px) shows whole, and one still streaming is never clamped.
   */
  clampResponses?: boolean;
  /**
   * What a folded run's line says after its count. `kinds` (the default):
   * "3 edited · 4 read · 2 ran". `files`, desktop's session-detail line: the
   * distinct files it modified and read, then the lines its edits added and
   * removed (`+40 −12`, from each edit's `diffs`). A failed edit counts for
   * nothing, and a run that modified and read nothing (only commands, say)
   * shows its count alone, as desktop's does.
   */
  toolRunSummary?: "kinds" | "files";
  className?: string;
}

/** "17s", "1m 29s", "1h 3m": a turn's work, in whole seconds (desktop's `formatWorked`). */
function formatWorked(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

/** A run of more tool calls than this folds behind one line. */
const FOLD_OVER = 3;

type Block =
  | { kind: "item"; item: Exclude<AgentItem, { kind: "tool" }> }
  | { kind: "tools"; key: string; calls: ToolCallView[] };

/** Consecutive tool items become one run. */
function blocksOf(items: AgentItem[]): Block[] {
  const blocks: Block[] = [];
  for (const item of items) {
    if (item.kind === "tool") {
      const last = blocks[blocks.length - 1];
      if (last?.kind === "tools") last.calls.push(item.call);
      else blocks.push({ kind: "tools", key: `tools:${item.call.id}`, calls: [item.call] });
    } else {
      blocks.push({ kind: "item", item });
    }
  }
  return blocks;
}

export const TurnRow = memo(function TurnRow({
  turn,
  streaming,
  commentSlot,
  renderMarkdown,
  rehypePlugins,
  onLoadPayload,
  renderDiff,
  errorAction,
  renderItemFooter,
  renderCheckpointFooter,
  openToolCallIds,
  onOpenToolCallIdsChange,
  thinkingLabel,
  thinkingBody = "text",
  onOpenAttachment,
  onCopyPayload,
  onLoadBody,
  openToolRunIds,
  onOpenToolRunIdsChange,
  revealItemId,
  clampResponses = false,
  toolRunSummary = "kinds",
  className,
}: TurnRowProps) {
  const blocks = useMemo(() => blocksOf(turn.items), [turn.items]);
  const markdown =
    renderMarkdown ??
    ((source: string, live: boolean) => (
      <StreamingMarkdown source={source} streaming={live} rehypePlugins={rehypePlugins} />
    ));
  // The prompt is the same markdown one step up the type scale.
  const userMarkdown = renderMarkdown
    ? (source: string) => <div className="prose-session-user">{renderMarkdown(source, false)}</div>
    : (source: string) => (
        <StreamingMarkdown
          source={source}
          rehypePlugins={rehypePlugins}
          className="prose-session-user"
        />
      );
  const outcome = turn.outcome;
  const live = !outcome && streaming !== undefined;
  // The first answer carries the model line; the ones after it are the same voice.
  const firstText = turn.items.find((i) => i.kind === "text");

  return (
    <div
      data-slot="turn-row"
      data-turn-key={turn.key}
      className={cn("flex min-w-0 flex-col", className)}
    >
      {turn.user && (
        <UserMessage
          user={turn.user}
          commentSlot={commentSlot}
          markdown={userMarkdown}
          footer={renderItemFooter?.({ kind: "user", id: turn.user.id })}
          onOpenAttachment={onOpenAttachment}
          onLoadBody={onLoadBody}
        />
      )}

      {turn.durationMs !== undefined && outcome && (
        <div className="mb-1 flex h-6 items-center border-b border-border-subtle pb-2 text-base text-muted-foreground">
          <span>
            {outcome?.kind === "cancelled" ? "Stopped after" : "Worked for"}{" "}
            <span className="tabular-nums">{formatWorked(turn.durationMs)}</span>
          </span>
        </div>
      )}

      {blocks.map((block) =>
        block.kind === "tools" ? (
          <ToolRun
            key={block.key}
            calls={block.calls}
            onLoadPayload={onLoadPayload}
            renderDiff={renderDiff}
            commentSlot={commentSlot}
            renderItemFooter={renderItemFooter}
            openIds={openToolCallIds}
            onOpenIdsChange={onOpenToolCallIdsChange}
            onCopy={onCopyPayload}
            openRunIds={openToolRunIds}
            onOpenRunIdsChange={onOpenToolRunIdsChange}
            revealId={revealItemId}
            summary={toolRunSummary}
          />
        ) : (
          <Fragment key={block.item.id}>
            {block.item.kind === "text" ? (
              <TextItem
                item={block.item}
                header={block.item === firstText}
                live={streaming?.itemId === block.item.id}
                markdown={markdown}
                commentSlot={commentSlot}
                onLoadBody={onLoadBody}
                clamp={clampResponses}
              />
            ) : block.item.kind === "thinking" ? (
              <ThinkingItem
                id={block.item.id}
                text={block.item.text}
                live={streaming?.itemId === block.item.id}
                label={thinkingLabel}
                body={thinkingBody}
                markdown={markdown}
                commentSlot={commentSlot}
              />
            ) : (
              <PlanList items={block.item.items} className="py-2" />
            )}
            {renderItemFooter?.(block.item)}
          </Fragment>
        ),
      )}

      {live && streaming?.retry && (
        <p className="py-1 text-sm text-muted-foreground">
          Retrying ({streaming.retry.attempt}/{streaming.retry.maxAttempts})
        </p>
      )}
      {live && streaming?.compacting && (
        <p className="py-1 text-sm text-muted-foreground">Compacting context</p>
      )}

      {turn.checkpoints?.map((checkpoint) => (
        <Fragment key={checkpoint.id}>
          <Checkpoint checkpoint={checkpoint} commentSlot={commentSlot} />
          {renderCheckpointFooter?.(checkpoint)}
        </Fragment>
      ))}

      {outcome?.kind === "failed" && (
        <Callout
          tone="error"
          role="alert"
          className="mt-2"
          action={outcome.error?.kind === "auth" ? errorAction : undefined}
        >
          {outcome.error?.kind === "auth" ? (
            <>
              <p className="font-medium">Sign in again to continue</p>
              <p className="mt-0.5">{outcome.error.message}</p>
            </>
          ) : (
            (outcome.error?.message ?? "The turn failed.")
          )}
        </Callout>
      )}
      {outcome?.kind === "cancelled" && (
        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-px w-4 bg-border-strong" aria-hidden />
          Cancelled
        </p>
      )}
    </div>
  );
});

// ── The prompt ───────────────────────────────────────────────────────────────

/** Lines a prompt shows before "Show more", and their height in the bubble. */
const USER_MAX_LINES = 12;
const USER_LINE_HEIGHT = 22;
const USER_CLAMP_PX = USER_MAX_LINES * USER_LINE_HEIGHT;

function UserMessage({
  user,
  commentSlot,
  markdown,
  footer,
  onOpenAttachment,
  onLoadBody,
}: {
  user: NonNullable<TurnView["user"]>;
  commentSlot?: (anchor: CommentAnchor) => ReactNode;
  markdown: (source: string) => ReactNode;
  footer?: ReactNode;
  onOpenAttachment?: (attachment: AttachmentView, index: number) => void;
  onLoadBody?: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const clampRef = useRef<HTMLDivElement>(null);
  const { height, overflows } = useWholeLineClamp(clampRef, !expanded);
  // Each keeps its index in `user.attachments`, which is what `onOpenAttachment` reports.
  const indexed = (user.attachments ?? []).map((attachment, index) => ({ attachment, index }));
  const images = indexed.filter((a) => a.attachment.kind === "image");
  const files = indexed.filter((a) => a.attachment.kind === "file");

  return (
    // The generous space below is what separates one exchange from the next.
    <div className="flex justify-end gap-2 pt-2 pb-6">
      {commentSlot && (
        <div className="shrink-0 self-start">{commentSlot({ kind: "message", id: user.id })}</div>
      )}
      <div className="flex max-w-4/5 min-w-0 flex-col items-end">
        {images.length > 0 && (
          <div className="mb-2 flex flex-wrap justify-end gap-1.5">
            {images.map(({ attachment: image, index }) => {
              const img = (
                <img
                  src={image.src}
                  alt={image.name ?? ""}
                  className="size-16 rounded-lg border border-border-subtle bg-card object-cover"
                />
              );
              return onOpenAttachment ? (
                <button
                  key={index}
                  type="button"
                  aria-label={`Open ${image.name ?? "attachment"}`}
                  onClick={() => onOpenAttachment(image, index)}
                  className="cursor-pointer rounded-lg transition-opacity hover:opacity-85"
                >
                  {img}
                </button>
              ) : (
                <Fragment key={index}>{img}</Fragment>
              );
            })}
          </div>
        )}
        <div
          data-comment-anchor={user.id}
          className={cn(
            // One continuous radius, above the `rounded-*` scale: a bubble
            // grows to many lines, and `rounded-full` turns that into an
            // ellipse whose curve cuts off the first and last line.
            // ratchet-allow: 20px sits above the radius scale (xl is 12px) and a full radius clips multi-line bubbles
            "max-w-full min-w-0 rounded-[20px] bg-primary-muted px-4 py-2.5 select-text",
          )}
        >
          {/* The clamp is inside the padding, so the budget is whole line boxes. */}
          <div
            ref={clampRef}
            style={expanded ? undefined : { maxHeight: height, overflow: "hidden" }}
          >
            {markdown(user.text)}
          </div>
        </div>
        {files.length > 0 && (
          <div className="mt-1.5 flex flex-wrap justify-end gap-1.5">
            {files.map(({ attachment: file, index }) => (
              <FileChip
                key={index}
                file={file}
                onOpen={onOpenAttachment && (() => onOpenAttachment(file, index))}
              />
            ))}
          </div>
        )}
        {(overflows || user.truncated) && (
          <div className="mt-0.5 flex items-center gap-2 text-2xs text-muted-foreground">
            {user.truncated &&
              (onLoadBody ? (
                <ReadRest id={user.id} bytes={user.bytes} load={user.load} onLoad={onLoadBody} />
              ) : (
                <span>Truncated</span>
              ))}
            {overflows && (
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setExpanded((v) => !v)}
                className="h-4.5 cursor-pointer transition-colors hover:text-secondary-foreground"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        )}
        {footer}
      </div>
    </div>
  );
}

function FileChip({ file, onOpen }: { file: AttachmentView; onOpen?: () => void }) {
  const chip = cn(
    "flex h-6 max-w-60 items-center gap-1.5 rounded-md border border-border-subtle bg-card px-2 text-xs text-secondary-foreground",
    onOpen && "cursor-pointer transition-colors hover:bg-element-hover",
  );
  const Tag = onOpen ? "button" : "span";
  return (
    <Tag
      {...(onOpen
        ? {
            type: "button" as const,
            onClick: onOpen,
          }
        : {})}
      className={chip}
    >
      <Icon icon={PaperclipIcon} size="xs" className="text-muted-foreground" />
      {/* "Open" for a screen reader, while the name still contains the
          visible text, so speech input ("click sidebar-spec.pdf") finds it. */}
      {onOpen && <span className="sr-only">Open </span>}
      <span className="min-w-0 truncate">{file.name ?? "Attachment"}</span>
      {file.bytes !== undefined && (
        <span className="shrink-0 text-muted-foreground tabular-nums">
          {formatBytes(file.bytes)}
        </span>
      )}
    </Tag>
  );
}

/**
 * The collapsed bubble's `max-height`, snapped down to the bottom of the last
 * line that fits whole inside the budget. A fixed cut is only exact for one
 * unbroken paragraph; paragraph gaps and fences knock later lines off the grid,
 * so only the block the cut falls in is read line by line. Also reports
 * whether the prompt overflows at all, which decides "Show more".
 */
function useWholeLineClamp(
  ref: RefObject<HTMLDivElement | null>,
  active: boolean,
): { height: number; overflows: boolean } {
  const [height, setHeight] = useState(USER_CLAMP_PX);
  const [overflows, setOverflows] = useState(false);
  useLayoutEffect(() => {
    // The markdown root: its children are the blocks the cut falls between.
    let root = ref.current?.firstElementChild;
    if (root && !root.matches(".prose-session") && root.firstElementChild) {
      root = root.firstElementChild;
    }
    if (!(root instanceof HTMLElement)) return;
    const measure = () => {
      const over = root.scrollHeight > USER_CLAMP_PX;
      setOverflows(over);
      if (!active) return;
      if (!over) {
        setHeight(USER_CLAMP_PX);
        return;
      }
      const base = root.getBoundingClientRect().top;
      let fit = 0;
      for (const child of Array.from(root.children)) {
        const box = child.getBoundingClientRect();
        if (box.top - base >= USER_CLAMP_PX) break;
        if (box.bottom - base <= USER_CLAMP_PX) {
          fit = box.bottom - base;
          continue;
        }
        const range = document.createRange();
        range.selectNodeContents(child);
        for (const line of Array.from(range.getClientRects())) {
          const bottom = line.bottom - base;
          if (bottom <= USER_CLAMP_PX && bottom > fit) fit = bottom;
        }
        break;
      }
      setHeight(fit > 0 ? Math.ceil(fit) : USER_CLAMP_PX);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [ref, active]);
  return { height, overflows };
}

/**
 * A truncated body's "Read the rest": web's reader button, in the quiet type
 * of the prompt's "Show more". The app fetches; `load` is how that is going.
 */
function ReadRest({
  id,
  bytes,
  load,
  onLoad,
}: {
  id: string;
  bytes?: number;
  load?: BodyLoad;
  onLoad: (id: string) => void;
}) {
  const loading = load === "loading";
  return (
    <button
      type="button"
      data-slot="read-the-rest"
      data-load={load}
      // Not `disabled`: that would drop keyboard focus while the body loads.
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={() => {
        if (!loading) onLoad(id);
      }}
      className="flex h-4.5 cursor-pointer items-center gap-1 transition-colors hover:text-secondary-foreground aria-disabled:cursor-default aria-disabled:hover:text-current"
    >
      {loading && <Spinner size="xs" label="" />}
      {load === "failed"
        ? "Couldn't load the rest, retry"
        : `Read the rest${bytes !== undefined ? ` · ${formatBytes(bytes)}` : ""}`}
    </button>
  );
}

// ── Agent items ──────────────────────────────────────────────────────────────

function time(iso: string | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function TextItem({
  item,
  header,
  live,
  markdown,
  commentSlot,
  onLoadBody,
  clamp,
}: {
  item: Extract<AgentItem, { kind: "text" }>;
  header: boolean;
  live: boolean;
  markdown: (source: string, streaming: boolean) => ReactNode;
  commentSlot?: (anchor: CommentAnchor) => ReactNode;
  onLoadBody?: (id: string) => void;
  clamp: boolean;
}) {
  const at = time(item.at);
  return (
    <div className="flex min-w-0 gap-2 py-2" data-comment-anchor={item.id}>
      <div className="min-w-0 flex-1">
        {/* Provenance in one left-aligned line: the model, then the time. */}
        {header && (item.model || at) && (
          <div className="flex h-5.5 items-center gap-1.5 font-mono text-2xs text-muted-foreground">
            {item.model && <span className="min-w-0 truncate">{item.model}</span>}
            {item.model && at && (
              <span aria-hidden className="text-disabled">
                ·
              </span>
            )}
            {at && <span className="shrink-0">{at}</span>}
          </div>
        )}
        {clamp && !live ? (
          <ResponseClamp>{markdown(item.text, live)}</ResponseClamp>
        ) : (
          markdown(item.text, live)
        )}
        {item.truncated &&
          (onLoadBody ? (
            <div className="mt-1 flex text-2xs text-muted-foreground">
              <ReadRest id={item.id} bytes={item.bytes} load={item.load} onLoad={onLoadBody} />
            </div>
          ) : (
            <p className="mt-1 text-2xs text-disabled">Truncated</p>
          ))}
      </div>
      {commentSlot && (
        <div className="shrink-0 self-start">{commentSlot({ kind: "message", id: item.id })}</div>
      )}
    </div>
  );
}

/** An answer's clamped height, and how far past it an answer may run before it clamps. */
const RESPONSE_CLAMP_PX = 340;
const RESPONSE_CLAMP_SLACK_PX = 60;

/**
 * Desktop's session-detail clamp: past 400px, an answer shows its first 340
 * and fades out (a mask, so it fades into whatever surface it sits on) under
 * a pill that hangs half over the edge. Expanded, the pill sits below as
 * "Show less". The slack keeps an answer only a little over from being cut by
 * a sliver. Measured on every resize, since a body that loads later grows.
 */
function ResponseClamp({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [expanded, setExpanded] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      // Zero is "not laid out yet", not "empty": it must not close an open clamp.
      if (el.scrollHeight === 0) return;
      setOverflows(el.scrollHeight > RESPONSE_CLAMP_PX + RESPONSE_CLAMP_SLACK_PX);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const clamped = overflows && !expanded;
  return (
    <div data-slot="response-clamp" className={cn("relative", clamped && "pb-3.5")}>
      <div
        ref={ref}
        className={cn(clamped && "mask-b-from-[calc(100%-4rem)] overflow-hidden")}
        style={clamped ? { maxHeight: RESPONSE_CLAMP_PX } : undefined}
      >
        {children}
      </div>
      {overflows && (
        <div
          className={cn("flex justify-center", expanded ? "mt-2" : "absolute inset-x-0 bottom-0")}
        >
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
            className="flex h-7 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm text-secondary-foreground shadow-md transition-colors hover:border-border-strong hover:text-foreground"
          >
            <Icon
              icon={ChevronDownIcon}
              size="xs"
              className={cn("transition-transform duration-fast", expanded && "rotate-180")}
            />
            {expanded ? "Show less" : "Show more"}
          </button>
        </div>
      )}
    </div>
  );
}

function ThinkingItem({
  id,
  text,
  live,
  label,
  body,
  markdown,
  commentSlot,
}: {
  id: string;
  text: string;
  live: boolean;
  label?: (state: { streaming: boolean }) => ReactNode;
  body: "markdown" | "text";
  markdown: (source: string, streaming: boolean) => ReactNode;
  commentSlot?: (anchor: CommentAnchor) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-0.5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-6.5 min-w-0 flex-1 cursor-pointer items-center gap-2 text-left text-base text-muted-foreground transition-colors hover:text-secondary-foreground"
        >
          <span className="flex w-4 shrink-0 justify-center">
            <Icon icon={BrainIcon} size="md" />
          </span>
          <span className="min-w-0 truncate">
            {label ? label({ streaming: live }) : live ? "Thinking…" : "Thought process"}
          </span>
          <Icon
            icon={ChevronRightIcon}
            size="md"
            className={cn("transition-transform duration-fast", open && "rotate-90")}
          />
        </button>
        {commentSlot && <div className="shrink-0">{commentSlot({ kind: "message", id })}</div>}
      </div>
      {open && (
        <div className="pb-3 pl-6">
          {body === "markdown" ? (
            <div className="text-muted-foreground">{markdown(text, live)}</div>
          ) : (
            <pre className="font-sans text-sm leading-relaxed break-words whitespace-pre-wrap text-muted-foreground select-text">
              {text}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

/** "3 edited · 4 read · 2 ran" — what a folded run did. */
function summarise(calls: ToolCallView[]): string {
  const count = (...kinds: ToolCallView["kind"][]) =>
    calls.filter((c) => kinds.includes(c.kind)).length;
  const parts: string[] = [];
  const edited = count("edit", "delete", "move");
  if (edited) parts.push(`${edited} edited`);
  if (count("read")) parts.push(`${count("read")} read`);
  if (count("execute")) parts.push(`${count("execute")} ran`);
  if (count("search")) parts.push(`${count("search")} searched`);
  const other = calls.length - edited - count("read", "execute", "search");
  if (other > 0) parts.push(`${other} other`);
  return parts.join(" · ");
}

/**
 * "2 modified · 3 read", and the lines the edits added and removed: what a
 * folded run did to the tree (desktop's session-detail `CallStat`).
 */
function summariseFiles(calls: ToolCallView[]): {
  text: string;
  added: number;
  removed: number;
} {
  const modified = new Set<string>();
  const read = new Set<string>();
  let added = 0;
  let removed = 0;
  for (const call of calls) {
    if (call.status === "failed") continue;
    if (call.kind === "edit") {
      for (const path of call.paths ?? []) modified.add(path);
      for (const diff of call.diffs ?? []) {
        modified.add(diff.path);
        added += diff.insertions ?? 0;
        removed += diff.deletions ?? 0;
      }
    } else if (call.kind === "read") {
      for (const path of call.paths ?? []) read.add(path);
    }
  }
  const parts: string[] = [];
  if (modified.size) parts.push(`${modified.size} modified`);
  if (read.size) parts.push(`${read.size} read`);
  return { text: parts.join(" · "), added, removed };
}

/** What a run passes down to its calls. */
interface CallsProps {
  calls: ToolCallView[];
  onLoadPayload?: (callId: string, part: "input" | "output") => void;
  renderDiff?: (diff: DiffData) => ReactNode;
  commentSlot?: (anchor: CommentAnchor) => ReactNode;
  renderItemFooter?: TurnRowProps["renderItemFooter"];
  openIds?: ReadonlySet<string>;
  onOpenIdsChange?: (next: ReadonlySet<string>) => void;
  onCopy?: ToolCallCardProps["onCopy"];
  openRunIds?: ReadonlySet<string>;
  onOpenRunIdsChange?: (next: ReadonlySet<string>) => void;
  /** A call to keep drawn (`revealItemId`). */
  revealId?: string;
}

function ToolRun({
  openRunIds,
  onOpenRunIdsChange,
  summary: summaryKind = "kinds",
  ...props
}: CallsProps & { summary?: "kinds" | "files" }) {
  const { calls, openIds } = props;
  const foldable = calls.length > FOLD_OVER;
  // A run holding a call the host opened or revealed unfolds, on mount or when
  // it starts to hold it; folding it again afterwards is the person's call.
  const { revealId } = props;
  const held = calls.some((c) => openIds?.has(c.id) || c.id === revealId);
  const [open, setOpen] = useState(!foldable || held);
  const [wasHeld, setWasHeld] = useState(held);
  if (held !== wasHeld) {
    setWasHeld(held);
    if (held) setOpen(true);
  }
  // Controlled: the host's set alone decides, and a toggle reports the next set.
  const shown = !foldable || (openRunIds ? calls.some((c) => openRunIds.has(c.id)) : open);
  const toggle = () => {
    if (!openRunIds) return setOpen((v) => !v);
    const ids = new Set(openRunIds);
    if (shown) for (const c of calls) ids.delete(c.id);
    else ids.add(calls[0]!.id);
    onOpenRunIdsChange?.(ids);
  };
  const running = calls.find((c) => c.status === "running");
  const failed = calls.some((c) => c.status === "failed");
  const summary = useMemo(
    () =>
      summaryKind === "files"
        ? summariseFiles(calls)
        : { text: summarise(calls), added: 0, removed: 0 },
    [calls, summaryKind],
  );

  return (
    <div className="py-1">
      {foldable && (
        <button
          type="button"
          aria-expanded={shown}
          onClick={toggle}
          className="group/run flex h-6.5 w-full min-w-0 cursor-pointer items-center gap-2 text-left text-base text-muted-foreground transition-colors hover:text-secondary-foreground"
        >
          <span className="flex w-4 shrink-0 justify-center">
            {running ? (
              <Spinner size="sm" label="" />
            ) : (
              <Icon
                icon={TOOL_KIND_ICON[calls[0]!.kind]}
                size="md"
                className={cn(failed && "text-error")}
              />
            )}
          </span>
          {/* While a call runs the line names it; settled, it counts. */}
          <span className="min-w-0 truncate">
            {running ? (running.title ?? running.name) : `${calls.length} tool calls`}
          </span>
          {!running && summary.text && (
            <span className="min-w-0 truncate font-mono text-xs text-disabled">{summary.text}</span>
          )}
          {!running && summary.added + summary.removed > 0 && (
            <DiffStat
              added={summary.added}
              removed={summary.removed}
              className="shrink-0 font-mono text-xs"
            />
          )}
          <Icon
            icon={ChevronRightIcon}
            size="md"
            className={cn(
              "ml-auto shrink-0 transition-[transform,opacity] duration-fast",
              shown
                ? "rotate-90 opacity-100"
                : "opacity-0 group-hover/run:opacity-100 group-focus-visible/run:opacity-100",
            )}
          />
        </button>
      )}
      {shown && <ToolCalls {...props} className={cn(foldable && "mt-1")} />}
    </div>
  );
}

/** A run's calls in one bordered box; past 80, windowed. */
function ToolCalls({
  calls,
  onLoadPayload,
  renderDiff,
  commentSlot,
  renderItemFooter,
  openIds,
  onOpenIdsChange,
  onCopy,
  revealId,
  className,
}: CallsProps & { className?: string }) {
  const { end: windowEnd, sentinelRef } = useWindow({ count: calls.length, grow: "down" });
  // A held or revealed call past the window is still drawn, so the host can scroll to it.
  let end = windowEnd;
  if (openIds || revealId !== undefined) {
    for (let i = calls.length - 1; i >= end; i--) {
      const id = calls[i]!.id;
      if (openIds?.has(id) || id === revealId) {
        end = i + 1;
        break;
      }
    }
  }
  return (
    <div
      className={cn(
        "divide-y divide-border-subtle overflow-hidden rounded-md border border-border",
        className,
      )}
    >
      {calls.slice(0, end).map((call) => {
        const card = (
          <ToolCallCard
            key={call.id}
            call={call}
            open={openIds ? openIds.has(call.id) : undefined}
            onOpenChange={
              openIds &&
              ((next) => {
                const ids = new Set(openIds);
                if (next) ids.add(call.id);
                else ids.delete(call.id);
                onOpenIdsChange?.(ids);
              })
            }
            onCopy={onCopy}
            onLoadPayload={onLoadPayload && ((part) => onLoadPayload(call.id, part))}
            renderDiff={renderDiff}
            commentSlot={commentSlot}
          />
        );
        // Wrapped whenever there is a footer renderer, so a footer that comes
        // and goes never remounts the card (and its open or Copy state).
        return renderItemFooter ? (
          <div key={call.id}>
            {card}
            {renderItemFooter({ kind: "tool", call })}
          </div>
        ) : (
          card
        );
      })}
      {end < calls.length && <div ref={sentinelRef} aria-hidden className="h-px" />}
    </div>
  );
}

const PLAN_ICON = {
  completed: CircleCheckIcon,
  in_progress: CircleDashedIcon,
  pending: CircleIcon,
} as const;

/** The agent's plan as a checklist: done is struck through, the current step turns. */
function PlanList({ items, className }: { items: PlanItem[]; className?: string }) {
  return (
    <ul data-slot="plan-list" className={cn("space-y-1", className)}>
      {items.map((item, i) => (
        <li
          key={i}
          data-status={item.status}
          className={cn(
            "flex min-h-5.5 items-start gap-2 text-base",
            item.status === "completed" && "text-muted-foreground line-through",
            item.status === "in_progress" && "text-foreground",
            item.status === "pending" && "text-secondary-foreground",
          )}
        >
          <span className="flex h-5.5 w-4 shrink-0 items-center justify-center">
            {item.status === "in_progress" ? (
              <Spinner size="md" label="In progress" className="text-foreground" />
            ) : (
              <Icon icon={PLAN_ICON[item.status]} size="md" className="text-muted-foreground" />
            )}
          </span>
          <span className="min-w-0 leading-5.5">{item.content}</span>
        </li>
      ))}
    </ul>
  );
}

// ── Checkpoints ──────────────────────────────────────────────────────────────

const FILES_SHOWN = 12;

/**
 * A commit, as a card: desktop's session checkpoint. An orphaned one says so
 * outright and hides its branch, since the branch no longer holds it.
 */
function Checkpoint({
  checkpoint,
  commentSlot,
}: {
  checkpoint: CheckpointView;
  commentSlot?: (anchor: CommentAnchor) => ReactNode;
}) {
  const orphaned = checkpoint.linkState === "orphaned";
  const files = checkpoint.files ?? [];
  const known = checkpoint.insertions !== undefined || checkpoint.deletions !== undefined;
  return (
    <div
      data-slot="checkpoint"
      data-link-state={checkpoint.linkState}
      className={cn(
        "mt-2.5 overflow-hidden rounded-md border",
        orphaned ? "border-dashed border-border-strong" : "border-border bg-card",
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-border-subtle bg-card px-3 py-2 last:border-b-0">
        <Icon icon={GitCommitHorizontalIcon} size="sm" className="text-muted-foreground" />
        {checkpoint.commitSha && (
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            {checkpoint.commitSha.slice(0, 7)}
          </span>
        )}
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-sm",
            orphaned ? "text-secondary-foreground" : "text-foreground",
          )}
        >
          {checkpoint.subject ?? (
            <span className="text-muted-foreground">
              {orphaned ? "Commit no longer reachable" : "Checkpoint"}
            </span>
          )}
        </span>
        {orphaned && (
          <span
            className="shrink-0 rounded-full bg-warning-muted px-2 py-px font-mono text-2xs text-warning"
            title="This commit is no longer in history: rewritten or squashed. The session record is kept."
          >
            Orphaned
          </span>
        )}
        {known && (
          <DiffStat
            added={checkpoint.insertions ?? 0}
            removed={checkpoint.deletions ?? 0}
            className="shrink-0 font-mono text-xs"
          />
        )}
        {commentSlot?.({ kind: "checkpoint", id: checkpoint.id })}
      </div>
      {files.length > 0 && (
        <ul className="px-3 py-2">
          {files.slice(0, FILES_SHOWN).map((file) => (
            <li
              key={file}
              className="truncate font-mono text-xs leading-[1.75] text-muted-foreground"
            >
              {file}
            </li>
          ))}
          {files.length > FILES_SHOWN && (
            <li className="font-mono text-xs leading-[1.75] text-disabled">
              +{files.length - FILES_SHOWN} more
            </li>
          )}
        </ul>
      )}
      {checkpoint.branch && !orphaned && (
        <p className="border-t border-border-subtle px-3 py-1.5 font-mono text-xs text-disabled">
          {checkpoint.branch}
        </p>
      )}
    </div>
  );
}
