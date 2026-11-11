"use client";

import * as React from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  CircleCheckIcon,
  CircleXIcon,
  CopyIcon,
  FolderIcon,
  RotateCwIcon,
} from "lucide-react";
import { cn } from "../../lib/utils.ts";
import { HintGroup, HintItem } from "../../ui/hint-group.tsx";
import { IconButton } from "../../ui/icon-button.tsx";
import { Icon } from "../../ui/icon.tsx";
import { Spinner } from "../ui/spinner.tsx";
import {
  formatDuration,
  highlightRanges,
  segmentClassName,
  type TerminalLine,
  type TerminalLinkKind,
  type TerminalSegment,
} from "./code-surface.ts";

const COPIED_MS = 1200;

/**
 * Text with every match of `query` in a `<mark data-term-match>`. A find bar
 * stepping through matches walks `[data-term-match]` in the DOM and sets
 * `data-active` on the current one, which takes the active match colour.
 */
function Highlighted({ text, query }: { text: string; query?: string }) {
  const ranges = query ? highlightRanges(text, query) : [];
  if (ranges.length === 0) return text;
  const out: React.ReactNode[] = [];
  let at = 0;
  for (const [start, end] of ranges) {
    if (start > at) out.push(text.slice(at, start));
    out.push(
      <mark
        key={start}
        data-term-match
        className="rounded-sm bg-search-match-background text-inherit data-active:bg-search-match-active-background"
      >
        {text.slice(start, end)}
      </mark>,
    );
    at = end;
  }
  if (at < text.length) out.push(text.slice(at));
  return out;
}

// ── TerminalBlock ────────────────────────────────────────────────────────────

export interface TerminalBlockProps {
  /** The command line. Empty: a headerless block (output before the first prompt). */
  command?: string;
  running: boolean;
  /** `null`/unset reads as success. */
  exitCode?: number | null;
  durationMs?: number;
  /** Where it ran; the header shows the last folder. */
  cwd?: string;
  /** After the command: "large output", say. */
  badges?: React.ReactNode;
  /** Above the output: "earlier output hidden…". Hidden while collapsed. */
  notice?: React.ReactNode;
  /** Under the output, and shown even when collapsed: a password prompt. */
  footer?: React.ReactNode;
  /** Copy the block's full output. The button confirms for a moment. */
  onCopy?: () => void;
  onRerun?: () => void;
  /** Controlled collapse; leave unset for the block to keep its own. */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Marks matches in the command line, as `TerminalOutput`'s `highlight` does in the output. */
  commandHighlight?: string;
  /** The output: a `TerminalOutput`. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * One command and its output: desktop's block terminal card
 * (`block-terminal.tsx`'s `BlockCard`), with nothing of the PTY in it, so a
 * web session page can show a tool call's terminal output the same way.
 *
 * A finished block skips layout and paint while off screen
 * (`content-visibility: auto`); a running one never does, since its height
 * changes on every flush and the placeholder size would fight the scroll pin.
 */
export function TerminalBlock({
  command = "",
  running,
  exitCode,
  durationMs,
  cwd,
  badges,
  notice,
  footer,
  onCopy,
  onRerun,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  commandHighlight,
  children,
  className,
}: TerminalBlockProps) {
  const outputId = React.useId();
  const [ownCollapsed, setOwnCollapsed] = React.useState(defaultCollapsed);
  const collapsed = collapsedProp ?? ownCollapsed;
  const setCollapsed = (next: boolean) => {
    if (collapsedProp === undefined) setOwnCollapsed(next);
    onCollapsedChange?.(next);
  };

  const [copies, setCopies] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const copyTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(copyTimer.current), []);

  const failed = !running && exitCode != null && exitCode !== 0;
  const hasHeader = command !== "";
  // The shell's preamble before its first prompt: nothing to show yet.
  if (!hasHeader && children == null && footer == null) return null;

  const cwdName = cwd ? cwd.split("/").filter(Boolean).pop() : undefined;
  const copy = () => {
    onCopy?.();
    setCopied(true);
    setCopies((n) => n + 1);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), COPIED_MS);
  };

  return (
    <div
      data-slot="terminal-block"
      data-state={running ? "running" : failed ? "failed" : "succeeded"}
      className={cn("group overflow-hidden rounded-md border border-border bg-card", className)}
      style={
        running ? undefined : { contentVisibility: "auto", containIntrinsicSize: "auto 200px" }
      }
    >
      {hasHeader && (
        <div className="flex h-control-md items-center gap-2 border-b border-border-subtle px-2.5 text-sm">
          {running ? (
            <Spinner size="sm" label="" className="text-primary" />
          ) : failed ? (
            <Icon
              icon={CircleXIcon}
              size="sm"
              className="shrink-0 text-error"
              role="img"
              aria-label="Failed"
            />
          ) : (
            <Icon
              icon={CircleCheckIcon}
              size="sm"
              className="shrink-0 text-success"
              role="img"
              aria-label="Succeeded"
            />
          )}
          <button
            type="button"
            aria-expanded={!collapsed}
            aria-controls={outputId}
            title={command}
            onClick={() => setCollapsed(!collapsed)}
            className="min-w-0 cursor-pointer truncate rounded-sm text-left font-mono text-foreground transition-opacity duration-fast hover:opacity-80"
          >
            <Highlighted text={command} query={commandHighlight} />
          </button>
          {badges}
          <div className="ml-auto flex shrink-0 items-center gap-2 text-2xs text-muted-foreground">
            <HintGroup>
              <div className="flex items-center gap-0.5 opacity-0 transition-opacity duration-fast group-focus-within:opacity-100 group-hover:opacity-100">
                {onCopy && (
                  <HintItem label={copied ? "Copied" : "Copy output"} reshowKey={copies}>
                    <IconButton
                      size="xs"
                      icon={copied ? CheckIcon : CopyIcon}
                      label={copied ? "Copied" : "Copy output"}
                      onClick={copy}
                    />
                  </HintItem>
                )}
                {onRerun && (
                  <HintItem label="Rerun">
                    <IconButton size="xs" icon={RotateCwIcon} label="Rerun" onClick={onRerun} />
                  </HintItem>
                )}
                <HintItem label={collapsed ? "Expand" : "Collapse"}>
                  <IconButton
                    size="xs"
                    icon={ChevronDownIcon}
                    label={collapsed ? "Expand" : "Collapse"}
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                      "[&_svg]:transition-transform [&_svg]:duration-fast",
                      collapsed && "[&_svg]:-rotate-90",
                    )}
                  />
                </HintItem>
              </div>
            </HintGroup>
            {cwdName && (
              <span className="flex items-center gap-1" title={cwd}>
                <Icon icon={FolderIcon} size="xs" />
                {cwdName}
              </span>
            )}
            {!running && durationMs != null && (
              <span className="tabular-nums">{formatDuration(durationMs)}</span>
            )}
            {failed && <span className="text-error">exit {exitCode}</span>}
          </div>
        </div>
      )}
      <div id={outputId} hidden={collapsed && hasHeader}>
        {notice != null && (
          <div className="px-3 pt-2 text-2xs text-muted-foreground italic">{notice}</div>
        )}
        {children}
      </div>
      {footer}
    </div>
  );
}

// ── TerminalOutput ───────────────────────────────────────────────────────────

export interface TerminalOutputProps {
  /** Lines of styled segments. Wins over `text` when both are given. */
  lines?: readonly TerminalLine[];
  /** Plain text, split on newlines. No ANSI parsing: hand styled runs to `lines`. */
  text?: string;
  /** Marks every case-insensitive match, per segment. */
  highlight?: string;
  /** Runs once per line identity (linkify, say). Must be referentially stable. */
  prepareSegments?: (segments: readonly TerminalSegment[]) => readonly TerminalSegment[];
  /** ⌘/Ctrl-click on a link segment. Must be referentially stable. Unset: links are plain text. */
  onLinkActivate?: (target: string, kind: TerminalLinkKind) => void;
  className?: string;
}

interface TerminalOutputLineProps {
  line: TerminalLine;
  highlight?: string;
  prepareSegments?: TerminalOutputProps["prepareSegments"];
  onLinkActivate?: TerminalOutputProps["onLinkActivate"];
}

const LINK_TITLE: Record<TerminalLinkKind, string> = {
  url: "⌘-click to open in browser",
  path: "⌘-click to open",
};

function isLink(segment: TerminalSegment): segment is TerminalSegment & { kind: TerminalLinkKind } {
  return segment.kind === "url" || segment.kind === "path";
}

/**
 * One output line. Memoised on the line object, so a line emulator that keeps
 * committed lines' identity across flushes re-renders only its hot rows.
 */
export const TerminalOutputLine = React.memo(function TerminalOutputLine({
  line,
  highlight,
  prepareSegments,
  onLinkActivate,
}: TerminalOutputLineProps) {
  const segments = React.useMemo(
    () => prepareSegments?.(line.segments) ?? line.segments,
    [line.segments, prepareSegments],
  );
  // An empty line still needs its height.
  if (segments.every((s) => s.text === "")) return <div>{"​"}</div>;
  return (
    <div>
      {segments.map((segment, i) => {
        const link = onLinkActivate && isLink(segment) ? segment : null;
        const className = segmentClassName(link ? segment : { ...segment, kind: "text" });
        return (
          <span
            key={i}
            style={segment.style}
            className={className}
            title={link ? LINK_TITLE[link.kind] : undefined}
            // A link is a real control for the keyboard as well: Tab reaches
            // it and Enter opens it. The pointer still needs ⌘/Ctrl, so a
            // plain click keeps selecting output text.
            role={link ? "link" : undefined}
            tabIndex={link ? 0 : undefined}
            onClick={
              link
                ? (e) => {
                    if (e.metaKey || e.ctrlKey)
                      onLinkActivate!(link.target ?? link.text, link.kind);
                  }
                : undefined
            }
            onKeyDown={
              link
                ? (e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onLinkActivate!(link.target ?? link.text, link.kind);
                    }
                  }
                : undefined
            }
          >
            <Highlighted text={segment.text} query={highlight} />
          </span>
        );
      })}
    </div>
  );
});

const NO_LINES: readonly TerminalLine[] = [];

/**
 * A command's output, as desktop's block terminal draws it: monospaced,
 * wrapping, selectable, one element per line.
 *
 * Line identity drives the memo: give each line a stable `id`, keep a
 * committed line's object unchanged, and keep `prepareSegments` and
 * `onLinkActivate` referentially stable, or every line re-renders on every
 * update. A segment's `style` passes through untouched, so `var(--…)` colours
 * follow the theme.
 */
export function TerminalOutput({
  lines,
  text,
  highlight,
  prepareSegments,
  onLinkActivate,
  className,
}: TerminalOutputProps) {
  const fromText = React.useMemo(
    () =>
      lines || text === undefined
        ? NO_LINES
        : text.split("\n").map((line): TerminalLine => ({ segments: [{ text: line }] })),
    [lines, text],
  );
  const shown = lines ?? fromText;
  return (
    <div
      data-slot="terminal-output"
      className={cn(
        "px-3 py-2 font-mono text-sm leading-[1.4] break-words whitespace-pre-wrap text-secondary-foreground select-text",
        className,
      )}
    >
      {shown.map((line, i) => (
        <TerminalOutputLine
          key={line.id ?? i}
          line={line}
          highlight={highlight}
          prepareSegments={prepareSegments}
          onLinkActivate={onLinkActivate}
        />
      ))}
    </div>
  );
}
