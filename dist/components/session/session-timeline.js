"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SparklesIcon, UserIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "../../lib/utils.js";
import { Icon } from "../../ui/icon.js";
import { Callout } from "../ui/callout.js";
import { StatusIcon } from "../ui/status-icon.js";
import { statusIconOf, useWindow } from "./session-view-helpers.js";
import { TurnRow } from "./turn-row.js";
const HEADING = {
    queued: "Session queued",
    running: "Session running",
    waiting: "Waiting for you",
    done: "Session complete",
    failed: "Session failed",
    cancelled: "Session cancelled",
};
/** Rows that fade in on first render. */
const ENTRANCE_ROWS = 20;
/** Centre of a node from the top of its row: the rail starts and stops there. */
const NODE_CENTRE = 16;
export function SessionTimeline({ session, grow = "down", className, ...rowProps }) {
    const { turns, meta } = session;
    const { start: windowStart, end: windowEnd, sentinelRef, } = useWindow({
        count: turns.length,
        grow,
    });
    const { openToolCallIds, openToolRunIds } = rowProps;
    const held = useMemo(() => heldTurns(turns, [openToolCallIds, openToolRunIds]), [turns, openToolCallIds, openToolRunIds]);
    // Only ever widens: closing a held card must not unmount the turn under the
    // reader. A list that shrank past it (another session) starts over.
    const [reach, setReach] = useState(held);
    const stale = reach !== null && reach.last >= turns.length;
    if (held && (stale || !reach || held.first < reach.first || held.last > reach.last)) {
        setReach(stale || !reach
            ? held
            : { first: Math.min(reach.first, held.first), last: Math.max(reach.last, held.last) });
    }
    else if (!held && stale) {
        setReach(null);
    }
    const start = reach && !stale ? Math.min(windowStart, reach.first) : windowStart;
    const end = reach && !stale ? Math.max(windowEnd, reach.last + 1) : windowEnd;
    // Decided once: the rows on screen at mount. Never the ones a window adds.
    const [entering] = useState(() => {
        const first = grow === "up" ? turns.slice(-ENTRANCE_ROWS) : turns.slice(0, ENTRANCE_ROWS);
        return new Set(first.map((t) => t.key));
    });
    const visible = turns.slice(start, end);
    const lastKey = turns[turns.length - 1]?.key;
    const details = [meta.agent, meta.model, meta.branch].filter(Boolean);
    return (_jsxs("div", { "data-slot": "session-timeline", className: cn("min-w-0", className), children: [_jsx(Rail, { first: true, last: turns.length === 0, node: _jsx(HeadNode, { phase: session.phase }), children: _jsxs("div", { className: "flex min-h-8 flex-col justify-center pb-6", children: [_jsx("span", { className: "text-base font-medium text-foreground", children: HEADING[session.phase] }), meta.title && (_jsx("span", { className: "mt-0.5 text-sm text-secondary-foreground", children: meta.title })), details.length > 0 && (_jsx("span", { className: "mt-0.5 truncate font-mono text-xs text-muted-foreground", children: details.join(" · ") })), session.error && (_jsx(Callout, { tone: "error", role: "alert", className: "mt-3", children: session.error.message }))] }) }), grow === "up" && start > 0 && _jsx("div", { ref: sentinelRef, "aria-hidden": true, className: "h-px" }), visible.map((turn, i) => (_jsx("div", { className: cn(entering.has(turn.key) && "session-row-in"), style: entering.has(turn.key) ? { animationDelay: `${Math.min(i, 8) * 30}ms` } : undefined, children: _jsx(Rail, { last: turn.key === lastKey, node: _jsx(TurnNode, { agent: !turn.user }), children: _jsx(TurnRow, { turn: turn, streaming: turn.key === lastKey ? session.streaming : undefined, ...rowProps }) }) }, turn.key))), grow === "down" && end < turns.length && (_jsx("div", { ref: sentinelRef, "aria-hidden": true, className: "h-px" }))] }));
}
/** The first and last turn holding a call in any of `sets`, or `null`. */
function heldTurns(turns, sets) {
    const live = sets.filter((s) => s !== undefined && s.size > 0);
    if (live.length === 0)
        return null;
    let first = -1;
    let last = -1;
    turns.forEach((turn, i) => {
        const holds = turn.items.some((item) => item.kind === "tool" && live.some((s) => s.has(item.call.id)));
        if (!holds)
            return;
        if (first < 0)
            first = i;
        last = i;
    });
    return first < 0 ? null : { first, last };
}
/** A node in the gutter and its slice of the hairline, half-height at the ends. */
function Rail({ node, first = false, last = false, children, }) {
    return (_jsxs("div", { className: "grid grid-cols-[32px_minmax(0,1fr)] gap-3.5", children: [_jsxs("div", { className: "relative flex justify-center", children: [_jsx("span", { "aria-hidden": true, className: "absolute left-1/2 -ml-px w-px bg-border-subtle", style: {
                            top: first ? NODE_CENTRE : 0,
                            bottom: last ? `calc(100% - ${NODE_CENTRE}px)` : 0,
                        } }), node] }), _jsx("div", { className: "min-w-0 pb-4", children: children })] }));
}
/** Opaque, so the hairline behind it does not cross the glyph. */
const NODE = "relative flex size-8 shrink-0 items-center justify-center rounded-full border bg-card";
function HeadNode({ phase }) {
    return (_jsx("span", { className: cn(NODE, "border-border-strong/50"), children: _jsx(StatusIcon, { status: statusIconOf(phase) }) }));
}
/** The person's mark, or the agent's for a turn it started on its own. */
function TurnNode({ agent }) {
    return (_jsx("span", { className: cn(NODE, "border-border-strong/50 text-secondary-foreground"), children: _jsx(Icon, { icon: agent ? SparklesIcon : UserIcon, size: "md" }) }));
}
//# sourceMappingURL=session-timeline.js.map