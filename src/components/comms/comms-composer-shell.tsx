"use client";

import { ArrowUpIcon, CornerDownRightIcon, PencilIcon, XIcon } from "lucide-react";
import { useState } from "react";
import type { FocusEvent, KeyboardEvent, ReactNode } from "react";

import { cn } from "../../lib/utils.ts";
import { iconButtonVariants } from "../../ui/icon-button-variants.ts";
import { IconButton } from "../../ui/icon-button.tsx";
import { Icon } from "../../ui/icon.tsx";
import { Hint } from "../../ui/tooltip.tsx";
import { Pill } from "../ui/pill.tsx";
import { Spinner } from "../ui/spinner.tsx";

/**
 * The team-chat composer's frame: desktop's one bar, without the editor.
 *
 * One glass-rimmed capsule is the field: tools on the left, the app's editor,
 * then the right-hand tools and Send, the side controls pinned to the last
 * line as the text grows. A reply or an edit tucks a strip into the top of
 * the bar, behind it, so the two read as one object. Attachments sit inside
 * the bar above the text. At rest the bar is 84% of the column, centred; in
 * use (focused, or holding a draft, files, a reply or an edit) it widens to
 * 89.5%, never the full width, so it never shrinks under something being
 * written.
 *
 * The editor is a slot (desktop's Tiptap field, web's textarea), and it owns
 * Enter. The shell only listens for an Escape nobody handled, which cancels
 * the edit, else the reply (`escapeToCancel={false}` when the app's editor
 * routes Escape itself).
 *
 * The rest of desktop's bar is slots too: `formatRow` (the formatting
 * toggles, ruled off under the attachments), `popup` (the mention picker, in
 * flow above the bar so the editor keeps focus), `dropActive` (the drag-over
 * ring and its label), `invalid` (an over-limit draft's red edge), and
 * `renderSend` (draw Send yourself, with the shell's state).
 */

/** What `renderSend` gets: the shell's own Send wiring. */
export interface CommsComposerSendState {
  canSend: boolean;
  sending: boolean;
  label: string;
  onSend: () => void;
}

export interface CommsComposerShellProps {
  /** The text field. It handles Enter. */
  editor: ReactNode;
  /** Chips for files on their way up, above the text. */
  attachments?: ReactNode;
  /** Left of the editor: attach. */
  toolsStart?: ReactNode;
  /** Right of the editor, before Send: emoji, mention, formatting. */
  toolsEnd?: ReactNode;
  /** Replaces the Send button (web's microphone, a "Save edit"). */
  send?: ReactNode;
  /**
   * Draws Send from the shell's state, for an app that styles its own button
   * but keeps the wiring. Returning `null` draws no Send. `send` wins when both are given.
   */
  renderSend?: (state: CommsComposerSendState) => ReactNode;
  /** A row under the attachments, ruled off from the text: the formatting toggles. Widens the bar while shown. */
  formatRow?: ReactNode;
  /**
   * In flow at the top of the bar's width box, for a picker that must not
   * take focus from the editor (mentions). Position it yourself, such as
   * `absolute bottom-full`; the box is `relative`.
   */
  popup?: ReactNode;
  /** Files are being dragged over: a primary ring and `dropLabel` across the bar. */
  dropActive?: boolean;
  /** What the drop overlay says. */
  dropLabel?: ReactNode;
  /** The draft cannot be sent as it is (over the length limit): the bar's edge turns red. */
  invalid?: boolean;
  /** The message being answered: the strip above the bar. */
  replyTo?: { authorName: string; preview: string } | null;
  /**
   * Said in the strip when `replyTo.preview` is empty (the answered message
   * was deleted, or the app has no text for it), so the strip never ends on
   * a bare "Name · ".
   */
  replyEmptyLabel?: string;
  onCancelReply?: () => void;
  /** The composer is editing a message rather than writing one. */
  editing?: boolean;
  onCancelEdit?: () => void;
  /** While editing, the strip's text: the message being edited, as a reply shows the one answered. */
  editPreview?: string | null;
  /** Escape cancels the edit, else the reply. Off when the editor handles Escape itself. */
  escapeToCancel?: boolean;
  /** Send is live. */
  canSend: boolean;
  /** Send shows a spinner (uploads still going). */
  sending?: boolean;
  onSend: () => void;
  /** Instead of the bar, a line saying why nothing can be written here. */
  readOnly?: string | null;
  /** Send's name and tooltip: "Save edit", "Waiting for uploads…". */
  sendLabel?: string;
  className?: string;
}

export function CommsComposerShell({
  editor,
  attachments,
  toolsStart,
  toolsEnd,
  send,
  renderSend,
  formatRow,
  popup,
  dropActive = false,
  dropLabel = "Drop files to attach",
  invalid = false,
  replyTo,
  replyEmptyLabel = "Message deleted",
  onCancelReply,
  editing = false,
  onCancelEdit,
  editPreview,
  escapeToCancel = true,
  canSend,
  sending = false,
  onSend,
  readOnly,
  sendLabel = "Send",
  className,
}: CommsComposerShellProps) {
  const [focused, setFocused] = useState(false);
  const replying = !editing && Boolean(replyTo);
  const expanded =
    focused || canSend || Boolean(attachments) || Boolean(formatRow) || replying || editing;

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Escape" || e.defaultPrevented) return;
    if (editing && onCancelEdit) {
      e.preventDefault();
      onCancelEdit();
    } else if (replying && onCancelReply) {
      e.preventDefault();
      onCancelReply();
    }
  };
  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
  };

  return (
    <div
      data-slot="comms-composer"
      data-editing={editing || undefined}
      className={cn("relative shrink-0 px-2 pt-1 pb-4", className)}
      onFocus={() => setFocused(true)}
      onBlur={onBlur}
      onKeyDown={readOnly || !escapeToCancel ? undefined : onKeyDown}
    >
      <div
        className={cn(
          // The widen on focus snaps. The composer is focused a hundred times
          // a day, and `width` is a layout property: tweening it re-laid out
          // the thread above on every frame.
          "relative mx-auto min-w-[min(100%,24rem)]",
          expanded && !readOnly ? "w-[89.5%]" : "w-[84%]",
        )}
      >
        {readOnly ? (
          <p className="flex min-h-[46px] items-center justify-center rounded-composer border border-border-subtle px-4 text-center text-sm text-muted-foreground">
            {readOnly}
          </p>
        ) : (
          <>
            {popup}
            {(editing || replying) && (
              <div
                data-slot="comms-composer-intent"
                className="relative z-0 mx-2 -mb-4 flex animate-fade-in items-center gap-1.5 rounded-t-2xl bg-popover px-3 pt-1.5 pb-5"
              >
                <Icon
                  icon={editing ? PencilIcon : CornerDownRightIcon}
                  size="xs"
                  className="shrink-0 text-muted-foreground"
                />
                <span className="shrink-0 text-2xs font-medium tracking-wide text-muted-foreground uppercase">
                  {editing ? "Editing" : "Replying to"}
                </span>
                <span className="min-w-0 flex-1 truncate text-xs text-secondary-foreground">
                  {editing
                    ? editPreview
                    : replyTo &&
                      (replyTo.preview.trim() ? (
                        `${replyTo.authorName} · ${replyTo.preview}`
                      ) : (
                        <>
                          {replyTo.authorName} ·{" "}
                          <span
                            data-slot="comms-composer-reply-empty"
                            className="text-muted-foreground italic"
                          >
                            {replyEmptyLabel}
                          </span>
                        </>
                      ))}
                </span>
                <Hint label={editing ? "Cancel edit" : "Cancel reply"} side="top">
                  <IconButton
                    size="xs"
                    icon={XIcon}
                    label={editing ? "Cancel edit" : "Cancel reply"}
                    onClick={editing ? onCancelEdit : onCancelReply}
                  />
                </Hint>
              </div>
            )}

            <div
              data-drop-active={dropActive || undefined}
              data-invalid={invalid || undefined}
              className={cn(
                "relative z-10 glass-rim rounded-composer",
                // A drop outranks an over-limit edge: it is what the hand is doing now.
                // `!`: `glass-rim` sets the whole border (transparent, painted by
                // its gradient) and its own box-shadow, and both win over a plain
                // `border-*` colour or `ring-*`; without it neither shows. The
                // ring replaces the rim's inset highlight while a drop is over.
                dropActive ? "border-primary! ring-2! ring-primary/40" : invalid && "border-error!",
              )}
            >
              {dropActive && (
                <div
                  data-slot="comms-composer-drop"
                  className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-composer bg-primary/8 backdrop-blur-[1px]"
                >
                  <Pill size="sm" surface="raised">
                    {dropLabel}
                  </Pill>
                </div>
              )}
              {attachments && <div className="flex flex-wrap gap-1.5 px-4 pt-3">{attachments}</div>}
              {formatRow && (
                <div
                  data-slot="comms-composer-format"
                  className="flex flex-wrap items-center gap-0.5 border-b border-border-subtle px-4 pt-1.5 pb-1"
                >
                  {formatRow}
                </div>
              )}
              {/* The side controls sit in 44px rows pinned to the bottom, so
                  they stay on the last line as the text grows. Literal px:
                  the interface scale is a zoom, and rem would drop the line
                  off-centre. */}
              <div className="flex items-end gap-1 px-[8px]">
                {toolsStart && (
                  <div className="flex h-[44px] shrink-0 items-center gap-0.5">{toolsStart}</div>
                )}
                <div className="min-h-[44px] min-w-0 flex-1 py-[5px]">{editor}</div>
                <div className="flex h-[44px] shrink-0 items-center gap-0.5">
                  {toolsEnd}
                  {/* `renderSend` owns the slot outright: returning null draws no Send. */}
                  {send ??
                    (renderSend ? (
                      renderSend({ canSend, sending, label: sendLabel, onSend })
                    ) : (
                      <Hint label={sendLabel} side="top">
                        <button
                          type="button"
                          data-slot="comms-send"
                          aria-label={sendLabel}
                          disabled={!canSend}
                          onClick={onSend}
                          className={cn(
                            iconButtonVariants({ size: "lg", shape: "round" }),
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            canSend && "text-foreground",
                          )}
                        >
                          {sending ? (
                            <Spinner size="md" label="" className="text-current" />
                          ) : (
                            <Icon icon={ArrowUpIcon} size="lg" />
                          )}
                        </button>
                      </Hint>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
