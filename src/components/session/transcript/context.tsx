"use client";

import { createContext, useContext, type ComponentType, type ReactNode } from "react";

import type { MarkerRow, SubagentRow, TranscriptImage, TurnFooterRow, UserRow } from "./model.ts";

/**
 * What a transcript's rows need from the app around them, handed in once.
 *
 * The rows are props-only: they never read an app's store or call its
 * backend. Everything an app owns (how markdown is parsed, the actions under a
 * message, comment pills, the changed-files card, what clicking a tool line
 * opens) arrives here, as components and callbacks, through one context
 * rather than as props threaded through every row. That keeps each row's
 * `memo` comparing only its own data.
 *
 * **Keep the value stable.** Every component and callback should be defined at
 * module level or memoised for the transcript's lifetime: a new value
 * re-renders every row, and the two `use…Discussed` hooks are called as hooks,
 * so one must not appear or disappear between renders.
 */

/** Props for the app's markdown renderer. */
export interface TranscriptMarkdownProps {
  source: string;
  /** Position in the thread: a renderer that parses lazily does the newest
   *  first. */
  priority: number;
  /** The live streaming tail: only this one changes per frame. */
  streaming?: boolean;
  /** Set on the markdown root: `prose-session-user` for a prompt bubble. A
   *  response passes none, and the renderer's root is `.prose-session`. */
  className?: string;
  /** The outside paths a prompt attached (`UserRow.trustedPaths`). */
  trustedPaths?: readonly string[];
}

/** The hover actions under a prompt. */
export interface TranscriptUserActionsProps {
  row: UserRow;
  /** The message id behind the row (`userRowMessageId(row.id)`). */
  messageId: string;
  canRetry: boolean;
  /** A "Show more" toggle sits above the actions. */
  toggleAbove: boolean;
}

/** The hover actions under a settled response. */
export interface TranscriptResponseActionsProps {
  messageId: string;
  text: string;
  timestamp: string;
  canBranch: boolean;
  showTimestamp: boolean;
  /** Placement override, from the turn footer row. */
  className?: string;
}

export interface TranscriptImagesProps {
  images: readonly TranscriptImage[];
  className?: string;
}

export interface TranscriptRemoteAuthorProps {
  id: string | null;
  fallback: string;
}

/** A comment pill beside one discussed row. */
export interface TranscriptCommentPillProps {
  anchorId: string;
}

/** The aggregate pill beside a folded block whose calls are discussed. */
export interface TranscriptGroupCommentPillProps {
  anchorIds: readonly string[];
  onOpen: () => void;
}

export interface TranscriptChangedFilesProps {
  row: TurnFooterRow;
}

export interface TranscriptContextValue {
  /** Renders every prompt and response body. */
  Markdown: ComponentType<TranscriptMarkdownProps>;
  UserActions?: ComponentType<TranscriptUserActionsProps>;
  ResponseActions?: ComponentType<TranscriptResponseActionsProps>;
  /** Image tiles above a prompt. Absent, a prompt's images are not drawn. */
  Images?: ComponentType<TranscriptImagesProps>;
  /** Who sent a prompt from elsewhere (`UserRow.remoteAuthor`). */
  RemoteAuthor?: ComponentType<TranscriptRemoteAuthorProps>;
  CommentPill?: ComponentType<TranscriptCommentPillProps>;
  GroupCommentPill?: ComponentType<TranscriptGroupCommentPillProps>;
  /** The card at the end of a turn that edited files. */
  ChangedFiles?: ComponentType<TranscriptChangedFilesProps>;
  /** Whether a row's anchor has a visible comment thread. Called as a hook. */
  useRowDiscussed?: (anchorId: string) => boolean;
  /** Whether any of a block's calls is discussed. Called as a hook. */
  useGroupDiscussed?: (anchorIds: readonly string[]) => boolean;
  /** A response header's clock. Defaults to the locale's hour and minute. */
  formatTime?: (timestamp: string) => string;

  /** Open or close a prompt bubble's clamp, or a thinking row. */
  onToggleExpand: (rowId: string) => void;
  /** Open or close a folded block, or a turn's work header. */
  onToggleGroup: (rowId: string) => void;
  /** A tool line with something to open (`MarkerRow.opens`). */
  onOpenMarker?: (row: MarkerRow) => void;
  /** A delegated child. */
  onOpenSubagent?: (row: SubagentRow) => void;
  /** An interrupted latest turn's Retry. */
  onRetry?: () => void;
  /** An interrupted latest turn's Continue. */
  onContinue?: () => void;
}

const TranscriptContext = createContext<TranscriptContextValue | null>(null);

export function TranscriptProvider({
  value,
  children,
}: {
  value: TranscriptContextValue;
  children: ReactNode;
}) {
  return <TranscriptContext.Provider value={value}>{children}</TranscriptContext.Provider>;
}

/** The transcript's context. Throws outside a `TranscriptProvider`. */
export function useTranscript(): TranscriptContextValue {
  const value = useContext(TranscriptContext);
  if (!value) throw new Error("A transcript row rendered outside <TranscriptProvider>.");
  return value;
}

const notDiscussed = (): boolean => false;

/** `useRowDiscussed`, or never discussed when the app has no comments. */
export function useRowDiscussed(anchorId: string): boolean {
  const use = useTranscript().useRowDiscussed ?? notDiscussed;
  return use(anchorId);
}

/** `useGroupDiscussed`, or never discussed when the app has no comments. */
export function useGroupDiscussed(anchorIds: readonly string[]): boolean {
  const use = useTranscript().useGroupDiscussed ?? notDiscussed;
  return use(anchorIds);
}
