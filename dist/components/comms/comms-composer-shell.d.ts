import type { ReactNode } from "react";
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
    replyTo?: {
        authorName: string;
        preview: string;
    } | null;
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
export declare function CommsComposerShell({ editor, attachments, toolsStart, toolsEnd, send, renderSend, formatRow, popup, dropActive, dropLabel, invalid, replyTo, replyEmptyLabel, onCancelReply, editing, onCancelEdit, editPreview, escapeToCancel, canSend, sending, onSend, readOnly, sendLabel, className, }: CommsComposerShellProps): import("react").JSX.Element;
//# sourceMappingURL=comms-composer-shell.d.ts.map