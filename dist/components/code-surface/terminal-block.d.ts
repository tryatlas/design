import * as React from "react";
import { type TerminalLine, type TerminalLinkKind, type TerminalSegment } from "./code-surface.ts";
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
export declare function TerminalBlock({ command, running, exitCode, durationMs, cwd, badges, notice, footer, onCopy, onRerun, collapsed: collapsedProp, defaultCollapsed, onCollapsedChange, commandHighlight, children, className, }: TerminalBlockProps): React.JSX.Element | null;
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
/**
 * One output line. Memoised on the line object, so a line emulator that keeps
 * committed lines' identity across flushes re-renders only its hot rows.
 */
export declare const TerminalOutputLine: React.MemoExoticComponent<({ line, highlight, prepareSegments, onLinkActivate, }: TerminalOutputLineProps) => React.JSX.Element>;
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
export declare function TerminalOutput({ lines, text, highlight, prepareSegments, onLinkActivate, className, }: TerminalOutputProps): React.JSX.Element;
export {};
//# sourceMappingURL=terminal-block.d.ts.map