import type { ReactNode } from "react";
import type { CommsMessageView, CommsReaction } from "./comms-view.ts";
/**
 * One team-chat message, linear (the Discord and Slack shape):
 *
 *     [avatar]  Name · 12:04
 *               body, full width
 *               attachments, references
 *               reaction chips
 *
 * Desktop's message row, as a props-only view. A `head` row opens a run with
 * the avatar and the author line; a continuation drops both and shows its
 * time in the gutter on hover. Text, attachments and references are slots:
 * each app renders its own markdown, mentions and media.
 *
 * The hover toolbar (React, Reply, More) mounts only while the pointer is
 * over the row, focus is inside it, or one of its menus is open: three popup
 * roots per row across a whole transcript is a dozen idle fibers a message.
 * The row itself takes no `tabIndex` (desktop's hint navigation would label
 * every message); focus reaches it through its own controls.
 *
 * Motion is colour and opacity only. Rows sit under desktop's vibrant grain,
 * where WKWebView mis-composites a row promoted to its own layer.
 *
 * Memoised: pass stable callbacks, stable `can` / `labels` / `reactionEmoji`
 * and slots, and the same `message` object while it is unchanged, and a
 * reaction elsewhere re-renders nothing here.
 */
/** Every string the row draws. */
export interface CommsMessageRowLabels {
    messageDeleted: string;
    edited: string;
    sending: string;
    failed: string;
    retry: string;
    originalDeleted: string;
    /** The parent of a reply the app could not name. */
    unknownAuthor: string;
    jumpToMessage: string;
    pinned: string;
    /** The integration badge. */
    app: string;
    /** Beside an integration that posted under another name. */
    via: (webhook: string) => string;
    /** An integration's author line, on hover. */
    postedBy: (webhook: string) => string;
    /** A reaction chip's tooltip: who reacted, when the app knows their names. */
    reactors: (reaction: CommsReaction) => string;
    react: string;
    reply: string;
    more: string;
    copyText: string;
    copyLink: string;
    pin: string;
    unpin: string;
    edit: string;
    delete: string;
}
export declare const DEFAULT_COMMS_MESSAGE_ROW_LABELS: CommsMessageRowLabels;
/** What the person may do to this message. Anything absent is not offered. */
export interface CommsMessageRowPermissions {
    react?: boolean;
    reply?: boolean;
    /** The author only: an admin can delete but never rewrite. */
    edit?: boolean;
    delete?: boolean;
    pin?: boolean;
}
export interface CommsMessageRowProps {
    message: CommsMessageView;
    /** Opens a run: the avatar and the author line. */
    head: boolean;
    /** Name a person on a head row. A 1:1 DM can drop it; an integration is always named. */
    showAuthor?: boolean;
    /** The rendered text. */
    body: ReactNode;
    attachments?: ReactNode;
    /** Session and code references, under the attachments. */
    references?: ReactNode;
    /** Replaces the default face on a head row. */
    avatar?: ReactNode;
    /** A person's name, as the app draws it (a person-card trigger). Ignored for an integration. */
    authorName?: ReactNode;
    /** The composer is editing this message. */
    editing?: boolean;
    /** The emoji the picker offers, exactly as the server allows them. */
    reactionEmoji: readonly string[];
    can: CommsMessageRowPermissions;
    onReact?: (emoji: string, on: boolean) => void;
    onReply?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onTogglePin?: () => void;
    onCopyText?: () => void;
    onCopyLink?: () => void;
    /** The quote line's jump; for a `missing` parent it pages the parent in. */
    onJumpToReply?: (id: string) => void;
    /** Offered beside "failed to send". */
    onRetry?: () => void;
    labels?: Partial<CommsMessageRowLabels>;
    className?: string;
}
declare function MessageRow({ message, head, showAuthor, body, attachments, references, avatar, authorName, editing, reactionEmoji, can, onReact, onReply, onEdit, onDelete, onTogglePin, onCopyText, onCopyLink, onJumpToReply, onRetry, labels: labelOverrides, className, }: CommsMessageRowProps): import("react").JSX.Element;
/**
 * One team-chat message. Memoised by identity: callers must pass stable
 * callbacks, and keep `can`, `labels`, `reactionEmoji` and the slots stable
 * too (hoist them, or `useMemo` them), or every row re-renders.
 */
export declare const CommsMessageRow: import("react").MemoExoticComponent<typeof MessageRow>;
export interface CommsDayDividerProps {
    /** Any time on the day. */
    at: number;
    /** Today, for "Today" and "Yesterday". */
    now: number;
    className?: string;
}
/** The centred hairline between two days of a transcript. */
export declare function CommsDayDivider({ at, now, className }: CommsDayDividerProps): import("react").JSX.Element;
export interface CommsUnreadLineProps {
    label?: string;
    className?: string;
}
/** The line above the first message the person has not read. */
export declare function CommsUnreadLine({ label, className }: CommsUnreadLineProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=comms-message-row.d.ts.map