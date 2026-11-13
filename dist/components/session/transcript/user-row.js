"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useLayoutEffect, useRef, useState } from "react";
import { Paperclip } from "lucide-react";
import { cn } from "../../../lib/utils.js";
import { useTranscript } from "./context.js";
import { userRowMessageId } from "./model.js";
import { Column } from "./parts.js";
/** Lines a user prompt shows before clamping behind "Show more". */
export const USER_MAX_LINES = 12;
/** Line height (px) of a user bubble, and the unit its clamp is measured in.
 *  Must agree with `.prose-session-user` (`session.css`): the clamp is a
 *  `max-height`, so a stylesheet-only change would silently cut a partial
 *  line. */
export const USER_LINE_HEIGHT = 22;
// ── User ───────────────────────────────────────────────────────────────────
export const UserRowView = memo(function UserRowView({ row, priority, justSent = false, canRetry = false, }) {
    const { Markdown, Images, RemoteAuthor, UserActions, onToggleExpand } = useTranscript();
    const clampRef = useRef(null);
    const { height: clampHeight, overflows } = useWholeLineClamp(clampRef, !row.expanded);
    const messageId = userRowMessageId(row.id);
    return (_jsx(Column, { className: "flex justify-end pt-6 pb-7", children: _jsxs("div", { className: "relative flex min-w-0 max-w-[80%] flex-col items-end", children: [Images && _jsx(Images, { images: row.attachments, className: "mb-2 justify-end" }), _jsx("div", { "data-comment-anchor": messageId, className: cn(
                    // Apple-squircle read: one big continuous radius (no clipped
                    // corner), a touch more padding — iMessage-adjacent geometry.
                    // A fixed 20px, NOT `rounded-full`: this bubble grows to many
                    // lines, and a radius of half its height turns it into an ellipse
                    // whose curve cuts off the first and last line at the corners.
                    // ratchet-allow: 20px sits above the `rounded-*` scale (xl = 12px), and
                    // a full radius clips multi-line bubbles.
                    "min-w-0 max-w-full rounded-[20px] bg-primary-muted px-4 py-2.5 select-text", 
                    // Entrance only for THE message sent just now (id-scoped).
                    justSent && "atlas-bubble-in"), children: _jsx("div", { ref: clampRef, style: row.expanded ? undefined : { maxHeight: clampHeight, overflow: "hidden" }, children: _jsx(Markdown, { source: row.text, priority: priority, trustedPaths: row.trustedPaths, className: "prose-session-user" }) }) }), row.contextBlocks > 0 && (_jsxs("button", { type: "button", className: "mt-1 flex items-center gap-1 text-2xs text-muted-foreground hover:text-secondary-foreground cursor-pointer transition-colors", title: "Context attached with @-mentions", children: [_jsx(Paperclip, { size: 10 }), row.contextBlocks, " attached"] })), RemoteAuthor && row.remoteAuthor && (_jsx(RemoteAuthor, { id: row.remoteAuthorId, fallback: row.remoteAuthor })), overflows && _jsx(ExpandToggle, { row: row, onToggleExpand: onToggleExpand }), UserActions && (_jsx(UserActions, { row: row, messageId: messageId, canRetry: canRetry, toggleAbove: overflows }))] }) }));
});
/** The clamp budget: `userMaxLines` lines of bubble text. */
const USER_CLAMP_PX = USER_MAX_LINES * USER_LINE_HEIGHT;
/**
 * The collapsed bubble's `max-height`, snapped down to the bottom of the last
 * line that fits whole inside `USER_CLAMP_PX`.
 *
 * The budget alone is only exact for one unbroken paragraph. Paragraph gaps,
 * list spacing and a fence's own line height all knock later lines off the
 * 22px grid, so a fixed cut lands mid-glyph on most real prompts. Measured,
 * not predicted: only the block that straddles the cut is read line by line,
 * and a prompt short enough to fit costs one `scrollHeight` read.
 *
 * Also reports whether the prompt overflows the budget at all, which is what
 * decides the "Show more" toggle. That used to be a character-count guess, and
 * a 300-character prompt that wraps to four lines got a toggle that did
 * nothing. The markdown root's `scrollHeight` is its natural height whether or
 * not the wrapper is clamping it, so the answer holds while expanded too.
 *
 * Re-measured on resize of the markdown root, which covers both a width change
 * (the lines rewrap) and the raw-source placeholder swapping to parsed HTML.
 */
function useWholeLineClamp(ref, active) {
    const [height, setHeight] = useState(USER_CLAMP_PX);
    const [overflows, setOverflows] = useState(false);
    useLayoutEffect(() => {
        const root = ref.current?.firstElementChild;
        if (!(root instanceof HTMLElement))
            return;
        const measure = () => {
            const over = root.scrollHeight > USER_CLAMP_PX;
            setOverflows(over);
            if (!active)
                return;
            if (!over) {
                setHeight(USER_CLAMP_PX);
                return;
            }
            const base = root.getBoundingClientRect().top;
            let fit = 0;
            for (const child of Array.from(root.children)) {
                const box = child.getBoundingClientRect();
                if (box.top - base >= USER_CLAMP_PX)
                    break;
                if (box.bottom - base <= USER_CLAMP_PX) {
                    fit = box.bottom - base;
                    continue;
                }
                // The block the cut falls inside: keep its last whole line.
                const range = document.createRange();
                range.selectNodeContents(child);
                for (const line of Array.from(range.getClientRects())) {
                    const bottom = line.bottom - base;
                    if (bottom <= USER_CLAMP_PX && bottom > fit)
                        fit = bottom;
                }
                break;
            }
            setHeight(fit > 0 ? Math.ceil(fit) : USER_CLAMP_PX);
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(root);
        return () => ro.disconnect();
    }, [ref, active]);
    return { height, overflows };
}
/**
 * "Show more" / "Show less". The row renders it only when the prompt measurably
 * overflows the clamp (`useWholeLineClamp`).
 *
 * In flow and always visible, unlike the action bar beneath it. That is
 * deliberate: this one is not an action on the message, it is the only way to
 * know the bubble is truncated at all. Hiding it until hover would mean a
 * clamped prompt looks like a complete one.
 */
function ExpandToggle({ row, onToggleExpand, }) {
    return (_jsx("button", { type: "button", onClick: () => onToggleExpand(row.id), className: "mt-0.5 h-control-2xs text-2xs text-muted-foreground hover:text-secondary-foreground cursor-pointer transition-colors", children: row.expanded ? "Show less" : "Show more" }));
}
//# sourceMappingURL=user-row.js.map