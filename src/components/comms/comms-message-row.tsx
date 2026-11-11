"use client";

import {
  CopyIcon,
  CornerDownRightIcon,
  EllipsisIcon,
  LinkIcon,
  PencilIcon,
  PinIcon,
  PinOffIcon,
  SmilePlusIcon,
  Trash2Icon,
  WebhookIcon,
} from "lucide-react";
import { memo, useCallback, useState } from "react";
import type { FocusEvent, ReactNode } from "react";

import { cn } from "../../lib/utils.ts";
import { Badge } from "../../ui/badge.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu.tsx";
import { HintGroup, HintItem } from "../../ui/hint-group.tsx";
import { IconButton } from "../../ui/icon-button.tsx";
import { Icon } from "../../ui/icon.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover.tsx";
import { PersonAvatar } from "../patterns/person-avatar.tsx";
import { StatusDot } from "../ui/status-dot.tsx";
import { formatClock, formatDayLabel } from "./comms-view-helpers.ts";
import type { CommsAuthor, CommsMessageView, CommsReaction } from "./comms-view.ts";

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

export const DEFAULT_COMMS_MESSAGE_ROW_LABELS: CommsMessageRowLabels = {
  messageDeleted: "Message deleted",
  edited: "edited",
  sending: "sending…",
  failed: "failed to send",
  retry: "Retry",
  originalDeleted: "original message deleted",
  unknownAuthor: "Unknown",
  jumpToMessage: "Jump to message",
  pinned: "Pinned",
  app: "App",
  via: (webhook) => `via ${webhook}`,
  postedBy: (webhook) => `Posted by the “${webhook}” webhook`,
  reactors: (reaction) => `${reaction.count} ${reaction.count === 1 ? "reaction" : "reactions"}`,
  react: "React",
  reply: "Reply",
  more: "More",
  copyText: "Copy text",
  copyLink: "Copy link",
  pin: "Pin for everyone",
  unpin: "Unpin for everyone",
  edit: "Edit",
  delete: "Delete",
};

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

/** The avatar gutter, shared by a head row and every continuation. */
const GUTTER = "w-9";

function MessageRow({
  message,
  head,
  showAuthor = true,
  body,
  attachments,
  references,
  avatar,
  authorName,
  editing = false,
  reactionEmoji,
  can,
  onReact,
  onReply,
  onEdit,
  onDelete,
  onTogglePin,
  onCopyText,
  onCopyLink,
  onJumpToReply,
  onRetry,
  labels: labelOverrides,
  className,
}: CommsMessageRowProps) {
  const labels = labelOverrides
    ? { ...DEFAULT_COMMS_MESSAGE_ROW_LABELS, ...labelOverrides }
    : DEFAULT_COMMS_MESSAGE_ROW_LABELS;
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  // A menu moves the pointer and focus into a portal outside this row, so the
  // open flag lives here, above the toolbar that would otherwise unmount.
  const [menuOpen, setMenuOpen] = useState(false);
  const deleted = message.deleted === true;
  const author = message.author;
  const clock = formatClock(message.at);

  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback((e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
  }, []);

  return (
    <div
      data-slot="comms-message-row"
      data-message={message.id}
      data-head={head || undefined}
      data-editing={editing || undefined}
      className={cn(
        "group/msg relative flex gap-2 rounded px-1 py-px transition-colors hover:bg-element-hover data-flash:bg-warning-muted",
        head && "mt-3 first:mt-0",
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div className={cn("shrink-0 pt-0.5", GUTTER)}>
        {head ? (
          (avatar ?? <DefaultAvatar author={author} />)
        ) : (
          // A continuation is never an empty gutter on hover: its own time
          // shows where the avatar would be.
          <span className="hidden justify-end pt-0.75 pr-0.5 text-2xs leading-none text-disabled tabular-nums group-hover/msg:flex">
            {clock}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1 pb-1">
        {message.replyTo && (
          <ReplyLine reply={message.replyTo} labels={labels} onJump={onJumpToReply} />
        )}

        {head && (
          <AuthorLine
            author={author}
            at={message.at}
            clock={clock}
            showAuthor={showAuthor}
            authorName={authorName}
            labels={labels}
          />
        )}

        {deleted ? (
          // The body is gone from the server: a tombstone, not a hide.
          <div className="text-base text-disabled italic">{labels.messageDeleted}</div>
        ) : (
          <>
            <div>
              {/* Sending dims the body one step down the text ladder, not by
                  opacity, which took it (and the "sending…" line) under 4.5:1. */}
              <div
                className={cn(
                  "min-w-0 text-base",
                  message.send === "sending"
                    ? "text-muted-foreground"
                    : "text-secondary-foreground",
                )}
              >
                {body}
              </div>
              {attachments && <div className="mt-1.5 flex flex-col gap-1.5">{attachments}</div>}
              {references && <div className="mt-1.5 flex flex-col gap-1.5">{references}</div>}
              <MetaLine message={message} labels={labels} onRetry={onRetry} />
            </div>
            <Reactions
              reactions={message.reactions}
              labels={labels}
              onReact={can.react ? onReact : undefined}
            />
          </>
        )}
      </div>

      {!deleted && (hovered || focused || menuOpen) && (
        <Toolbar
          pinned={message.pinned === true}
          reactionEmoji={reactionEmoji}
          can={can}
          labels={labels}
          onOpenChange={setMenuOpen}
          onReact={onReact}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePin={onTogglePin}
          onCopyText={onCopyText}
          onCopyLink={onCopyLink}
        />
      )}
    </div>
  );
}

/**
 * One team-chat message. Memoised by identity: callers must pass stable
 * callbacks, and keep `can`, `labels`, `reactionEmoji` and the slots stable
 * too (hoist them, or `useMemo` them), or every row re-renders.
 */
export const CommsMessageRow = memo(MessageRow);

function DefaultAvatar({ author }: { author: CommsAuthor }) {
  if (author.kind === "integration") {
    // A rounded square, not a circle, so it never reads as a person; no
    // presence dot, because an integration is not somewhere.
    return (
      <span
        role="img"
        aria-label={author.name}
        className="flex size-control-lg items-center justify-center overflow-hidden rounded-md bg-muted text-secondary-foreground"
      >
        {author.image ? (
          <img src={author.image} alt="" draggable={false} className="size-full object-cover" />
        ) : (
          <Icon icon={WebhookIcon} size="lg" />
        )}
      </span>
    );
  }
  return (
    <span className="relative inline-flex shrink-0">
      <PersonAvatar name={author.person.name} image={author.person.image ?? undefined} size="lg" />
      {author.online !== undefined && (
        <StatusDot
          tone={author.online ? "success" : "subtle"}
          size="md"
          cutout="background"
          label={author.online ? "Online" : "Offline"}
          className="absolute -right-px -bottom-px"
        />
      )}
    </span>
  );
}

function AuthorLine({
  author,
  at,
  clock,
  showAuthor,
  authorName,
  labels,
}: {
  author: CommsAuthor;
  at: number;
  clock: string;
  showAuthor: boolean;
  authorName?: ReactNode;
  labels: CommsMessageRowLabels;
}) {
  const time = (
    <time
      dateTime={new Date(at).toISOString()}
      title={new Date(at).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
      className="shrink-0 text-2xs text-disabled tabular-nums"
    >
      {clock}
    </time>
  );
  if (author.kind === "integration") {
    // ADR-0020: always the badge, and always the webhook's real name beside
    // a borrowed one, so a webhook can never pass for a person.
    return (
      <div
        className="flex min-w-0 items-baseline gap-1.5"
        title={labels.postedBy(author.via ?? author.name)}
      >
        <span className="truncate text-sm font-semibold text-foreground">{author.name}</span>
        <Badge variant="outline" size="sm" className="self-center tracking-wider uppercase">
          {labels.app}
        </Badge>
        {author.via && (
          <span className="min-w-0 truncate text-2xs text-muted-foreground">
            {labels.via(author.via)}
          </span>
        )}
        {time}
      </div>
    );
  }
  return (
    <div className="flex min-w-0 items-baseline gap-1.5">
      {showAuthor && (
        <span className="min-w-0 truncate text-sm font-semibold text-foreground">
          {authorName ?? author.person.name}
        </span>
      )}
      {time}
    </div>
  );
}

/** Discord's one-line quote: who, and the first line of what. */
function ReplyLine({
  reply,
  labels,
  onJump,
}: {
  reply: NonNullable<CommsMessageView["replyTo"]>;
  labels: CommsMessageRowLabels;
  onJump?: (id: string) => void;
}) {
  // A deleted parent renders as a stub, since a reply must never appear to
  // point at nothing; a merely paged-out one still jumps.
  const deleted = reply.state === "deleted";
  const live = !deleted && onJump !== undefined;
  return (
    <button
      type="button"
      data-slot="comms-reply-line"
      data-state={reply.state}
      disabled={!live}
      onClick={live ? () => onJump(reply.id) : undefined}
      title={live ? labels.jumpToMessage : undefined}
      className={cn(
        "group/reply flex w-full min-w-0 items-center gap-1 pb-0.5 text-left text-xs text-muted-foreground",
        live && "cursor-pointer",
      )}
    >
      <Icon icon={CornerDownRightIcon} size="xs" className="shrink-0 opacity-50" />
      {!deleted && (
        <span
          className={cn(
            "shrink-0 font-medium text-secondary-foreground",
            live && "group-hover/reply:underline",
          )}
        >
          {reply.authorName ?? labels.unknownAuthor}
        </span>
      )}
      <span className="min-w-0 truncate opacity-80">
        {deleted ? (
          <span className="italic">{labels.originalDeleted}</span>
        ) : reply.state === "missing" ? (
          "…"
        ) : (
          reply.preview
        )}
      </span>
    </button>
  );
}

function MetaLine({
  message,
  labels,
  onRetry,
}: {
  message: CommsMessageView;
  labels: CommsMessageRowLabels;
  onRetry?: () => void;
}) {
  const sending = message.send === "sending";
  const failed = message.send === "failed";
  if (!message.editedAt && !message.pinned && !sending && !failed) return null;
  return (
    <div className="mt-0.5 flex items-center gap-1.5 text-2xs text-disabled">
      {message.pinned && (
        <span role="img" aria-label={labels.pinned} title={labels.pinned} className="inline-flex">
          <Icon icon={PinIcon} size="xs" />
        </span>
      )}
      {message.editedAt && <span className="italic">{labels.edited}</span>}
      {sending && <span>{labels.sending}</span>}
      {failed && <span className="text-error">{labels.failed}</span>}
      {failed && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer font-medium text-secondary-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
        >
          {labels.retry}
        </button>
      )}
    </div>
  );
}

/**
 * The chips, in normal flow under the message. Without `onReact` (the person
 * may not react) the chips still show who reacted but do nothing.
 */
function Reactions({
  reactions,
  labels,
  onReact,
}: {
  reactions: CommsReaction[];
  labels: CommsMessageRowLabels;
  onReact?: (emoji: string, on: boolean) => void;
}) {
  if (reactions.length === 0) return null;
  return (
    <div className="mt-1 flex flex-wrap items-center gap-1">
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          type="button"
          data-slot="comms-reaction"
          aria-pressed={reaction.mine}
          disabled={!onReact}
          title={labels.reactors(reaction)}
          onClick={onReact && (() => onReact(reaction.emoji, !reaction.mine))}
          className={cn(
            "flex h-[21px] items-center gap-1 rounded-full border px-1.5 text-xs leading-none transition-colors",
            onReact && "cursor-pointer",
            reaction.mine
              ? "border-success/60 bg-success/15 text-foreground"
              : cn(
                  "border-border bg-card text-secondary-foreground",
                  onReact && "hover:bg-element-hover",
                ),
          )}
        >
          <span>{reaction.emoji}</span>
          <span className="tabular-nums">{reaction.count}</span>
        </button>
      ))}
    </div>
  );
}

function Toolbar({
  pinned,
  reactionEmoji,
  can,
  labels,
  onOpenChange,
  onReact,
  onReply,
  onEdit,
  onDelete,
  onTogglePin,
  onCopyText,
  onCopyLink,
}: {
  pinned: boolean;
  reactionEmoji: readonly string[];
  can: CommsMessageRowPermissions;
  labels: CommsMessageRowLabels;
  onOpenChange: (open: boolean) => void;
  onReact?: (emoji: string, on: boolean) => void;
  onReply?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePin?: () => void;
  onCopyText?: () => void;
  onCopyLink?: () => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const setPicker = (open: boolean) => {
    setPickerOpen(open);
    onOpenChange(open || moreOpen);
  };
  const setMore = (open: boolean) => {
    setMoreOpen(open);
    onOpenChange(open || pickerOpen);
  };

  const canReact = can.react && onReact && reactionEmoji.length > 0;
  const canReply = can.reply && onReply;
  const pin = can.pin && onTogglePin;
  const edit = can.edit && onEdit;
  const remove = can.delete && onDelete;
  const hasMenu = onCopyText || onCopyLink || pin || edit || remove;
  if (!canReact && !canReply && !hasMenu) return null;

  return (
    <HintGroup side="top">
      <div
        data-slot="comms-message-toolbar"
        className="absolute -top-2.5 right-2 z-10 flex items-center gap-px rounded-md border border-border bg-popover p-0.5 shadow-md"
      >
        {canReact && (
          <Popover open={pickerOpen} onOpenChange={setPicker}>
            <HintItem label={labels.react}>
              <PopoverTrigger
                render={<IconButton size="sm" icon={SmilePlusIcon} label={labels.react} />}
              />
            </HintItem>
            <PopoverContent side="top" align="end" sideOffset={6} className="w-auto p-1.5">
              <div className="grid grid-cols-7 gap-0.5">
                {/* Built from the allowlist, so no button here can be refused. */}
                {reactionEmoji.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      onReact(emoji, true);
                      setPicker(false);
                    }}
                    className="flex size-7 cursor-pointer items-center justify-center rounded text-md transition-colors hover:bg-element-hover"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {canReply && (
          <HintItem label={labels.reply}>
            <IconButton
              size="sm"
              icon={CornerDownRightIcon}
              label={labels.reply}
              onClick={onReply}
            />
          </HintItem>
        )}

        {hasMenu && (
          <DropdownMenu open={moreOpen} onOpenChange={setMore}>
            <HintItem label={labels.more}>
              <DropdownMenuTrigger
                render={<IconButton size="sm" icon={EllipsisIcon} label={labels.more} />}
              />
            </HintItem>
            <DropdownMenuContent side="top" align="end" sideOffset={6}>
              {onCopyText && (
                <DropdownMenuItem onClick={onCopyText}>
                  <CopyIcon /> {labels.copyText}
                </DropdownMenuItem>
              )}
              {onCopyLink && (
                <DropdownMenuItem onClick={onCopyLink}>
                  <LinkIcon /> {labels.copyLink}
                </DropdownMenuItem>
              )}
              {/* Pins are shared, not personal: anyone's pin is everyone's. */}
              {pin && (
                <DropdownMenuItem onClick={onTogglePin}>
                  {pinned ? <PinOffIcon /> : <PinIcon />}
                  {pinned ? labels.unpin : labels.pin}
                </DropdownMenuItem>
              )}
              {(onCopyText || onCopyLink || pin) && (edit || remove) && <DropdownMenuSeparator />}
              {edit && (
                <DropdownMenuItem onClick={onEdit}>
                  <PencilIcon /> {labels.edit}
                </DropdownMenuItem>
              )}
              {remove && (
                <DropdownMenuItem variant="destructive" onClick={onDelete}>
                  <Trash2Icon /> {labels.delete}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </HintGroup>
  );
}

export interface CommsDayDividerProps {
  /** Any time on the day. */
  at: number;
  /** Today, for "Today" and "Yesterday". */
  now: number;
  className?: string;
}

/** The centred hairline between two days of a transcript. */
export function CommsDayDivider({ at, now, className }: CommsDayDividerProps) {
  return (
    <div
      data-slot="comms-day-divider"
      role="separator"
      aria-label={formatDayLabel(at, now)}
      className={cn("flex items-center gap-2 px-3 py-3", className)}
    >
      <span aria-hidden className="h-px flex-1 bg-border-subtle" />
      <span aria-hidden className="text-2xs font-medium tracking-wide text-disabled uppercase">
        {formatDayLabel(at, now)}
      </span>
      <span aria-hidden className="h-px flex-1 bg-border-subtle" />
    </div>
  );
}

export interface CommsUnreadLineProps {
  label?: string;
  className?: string;
}

/** The line above the first message the person has not read. */
export function CommsUnreadLine({ label = "New", className }: CommsUnreadLineProps) {
  return (
    <div
      data-slot="comms-unread-line"
      role="separator"
      aria-label={label}
      className={cn("flex items-center gap-2 px-3 py-1 text-error", className)}
    >
      <span aria-hidden className="h-px flex-1 bg-current opacity-60" />
      <span aria-hidden className="text-2xs font-semibold tracking-wide uppercase">
        {label}
      </span>
    </div>
  );
}
