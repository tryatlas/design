"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useLayoutEffect, useRef } from "react";
import { Brain, ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils.js";
import { useRowDiscussed, useTranscript } from "./context.js";
import { Column } from "./parts.js";
import { ICON_PX, ICON_STROKE } from "./tool-glyph.js";
import { useVisibleAnimation } from "./visible-animation.js";
// ── Thinking ───────────────────────────────────────────────────────────────
export const ThinkingRowView = memo(function ThinkingRowView({ row }) {
    const { CommentPill, onToggleExpand } = useTranscript();
    // `th:<messageId>` — the key a comment on this thought is filed under. A
    // discussed thought wears its pill; the wrapper exists only then, so an
    // undiscussed row's DOM is exactly what it was.
    const messageId = row.id.slice(3);
    const discussed = useRowDiscussed(messageId) && CommentPill !== undefined;
    const shimmer = useVisibleAnimation();
    const toggle = (_jsxs("button", { ref: row.streaming ? shimmer : undefined, type: "button", onClick: () => onToggleExpand(row.id), className: cn("flex h-[26px] items-center gap-2 text-left text-base text-[var(--muted-foreground)] hover:text-[var(--secondary-foreground)] cursor-pointer transition-colors", discussed ? "min-w-0 flex-1" : "w-full"), children: [_jsx("span", { className: "flex w-4 shrink-0 justify-center", children: _jsx(Brain, { size: ICON_PX, strokeWidth: ICON_STROKE, className: cn(row.streaming && "atlas-marker-running") }) }), _jsx("span", { className: cn("min-w-0 truncate", row.streaming && "atlas-thinking-shimmer"), children: row.headline ?? (row.streaming ? "Thinking…" : "Thought process") }), _jsx(ChevronRight, { size: ICON_PX, strokeWidth: ICON_STROKE, className: cn("shrink-0 transition-transform", row.expanded && "rotate-90") })] }));
    return (_jsxs(Column, { className: "py-[3px]", children: [discussed && CommentPill ? (_jsxs("div", { className: "flex items-center gap-2", children: [toggle, _jsx(CommentPill, { anchorId: messageId })] })) : (toggle), row.expanded && (_jsx("div", { className: "pb-3 pl-6", children: _jsx("pre", { className: "whitespace-pre-wrap break-words font-sans text-sm leading-[19px] text-[var(--muted-foreground)] select-text", children: row.text }) })), row.live && _jsx(LiveThought, { text: row.live })] }));
});
/** The live thought's box. The top-edge fade is for older lines cut off
 *  above, so it is on only while the text overflows: a thought that fits
 *  shows at full strength. Set on the element, not in state, because the
 *  text changes with every streamed token. */
function LiveThought({ text }) {
    const ref = useRef(null);
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el)
            return;
        el.toggleAttribute("data-clipped", el.scrollHeight > el.clientHeight);
    }, [text]);
    return (_jsx("div", { ref: ref, className: "atlas-live-thought pb-1 pl-6", children: _jsx("p", { className: "text-sm leading-[19px] text-[var(--muted-foreground)]", children: text }) }));
}
//# sourceMappingURL=thinking-row.js.map