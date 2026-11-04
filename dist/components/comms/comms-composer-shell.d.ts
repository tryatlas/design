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
 * the edit, else the reply.
 */
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
    /** The message being answered: the strip above the bar. */
    replyTo?: {
        authorName: string;
        preview: string;
    } | null;
    onCancelReply?: () => void;
    /** The composer is editing a message rather than writing one. */
    editing?: boolean;
    onCancelEdit?: () => void;
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
export declare function CommsComposerShell({ editor, attachments, toolsStart, toolsEnd, send, replyTo, onCancelReply, editing, onCancelEdit, canSend, sending, onSend, readOnly, sendLabel, className, }: CommsComposerShellProps): import("react").JSX.Element;
//# sourceMappingURL=comms-composer-shell.d.ts.map