import type { ReactNode } from "react";
import type { CommsConversationRowView } from "./comms-view.ts";
/**
 * One conversation in the team-chat list: desktop's channel and direct rows,
 * as one props-only view.
 *
 * Every row leads with a fixed-width icon slot (a channel's `#` or lock, a
 * DM's face with its presence dot, a group's glyph), so labels start at the
 * same x whatever the row is. The label lifts to the foreground and medium
 * weight while there is something unread, and to the foreground while
 * selected.
 *
 * The count is a keycap, the `Kbd` look: a mention and a plain count are told
 * apart by the cap (9+ against 99+) and by `data-tone`, not by a saturated
 * fill that would fight the avatar and the name.
 */
export interface CommsConversationRowProps {
    conversation: CommsConversationRowView;
    /** The open conversation: `aria-current`, and the active fill. */
    selected?: boolean;
    onSelect: (id: string) => void;
    /** Replaces the default glyph or face in the icon slot. */
    icon?: ReactNode;
    /** After the label, before the badge: a group's member count, a spinner. */
    trailing?: ReactNode;
    /** Not selectable: no hover, no `onSelect`, disabled ink. */
    disabled?: boolean;
    className?: string;
}
export declare function CommsConversationRow({ conversation, selected, onSelect, icon, trailing, disabled, className, }: CommsConversationRowProps): import("react").JSX.Element;
//# sourceMappingURL=comms-conversation-row.d.ts.map