"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The timeline calendar: the board grouped by day under one sticky date that
 * changes as you scroll into the next day.
 *
 * **Virtualized**, because the board holds up to five hundred Sessions and a
 * row is three lines, an avatar and two marks. Rendering all of them cost 4.5
 * seconds on mount and left a 45,000px-tall layer for the compositor to
 * rasterise — which is what the blank bands during a fast scroll were. Only
 * the rows near the viewport exist at any moment.
 *
 * Days are items in the same flat list as the rows rather than sections
 * wrapping them. A virtualizer measures one sequence; nesting a list per day
 * would mean one virtualizer per day, each wanting its own scroll element.
 *
 * Over that list sits one sticky header naming the day you are reading. It is
 * pulled up over the first day's own header (`-mt-12`, the header's height)
 * so at rest there is one date on screen, not two, and the date slides in
 * when it changes — that movement is what tells you the day changed under a
 * list that is otherwise scrolling smoothly.
 *
 * Desktop's, ported as it is. Not in the root entry: it needs the optional
 * `@tanstack/react-virtual` peer, so it is imported on its own —
 * `import { TimelineCalendar } from "@tryatlas/design/timeline-calendar"` —
 * and a consumer that never draws one never needs the peer.
 */
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState, } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { motion } from "motion/react";
import { cn } from "../../lib/utils.js";
import { EASE_PANEL } from "../../lib/motion.js";
/** Header height; the sticky header and each day's header share it. */
const HEADER = "h-12";
/** Starting guesses, corrected by measurement as items mount. A day header
 *  after the first also carries the gap that separates it from the day above. */
const FIRST_DAY_SIZE = 48;
const DAY_SIZE = 88;
const ROW_SIZE = 86;
export function TimelineCalendar({ items, root, renderRow, className, }) {
    // The scroller is a ref owned by the board, so it is null on this
    // component's first render. One flip once it exists gets the virtualizer
    // measuring instead of silently sizing against nothing.
    const [, setScrollerReady] = useState(false);
    useEffect(() => {
        if (root.current)
            setScrollerReady(true);
    }, [root]);
    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => root.current,
        estimateSize: (i) => items[i]?.kind === "day" ? (i === 0 ? FIRST_DAY_SIZE : DAY_SIZE) : ROW_SIZE,
        getItemKey: (i) => items[i]?.key ?? i,
        overscan: 10,
        // A viewport's worth before the scroller has been measured. Without it
        // the first paint has a measured height of zero, so the virtualizer picks
        // no rows and the board flashes empty before its own content.
        initialRect: { width: 0, height: 900 },
    });
    const virtualRows = virtualizer.getVirtualItems();
    /** Which day each item belongs to, so the topmost visible one names the
     *  header. Reading it from the list is exact, where measuring scroll
     *  position against day offsets is a second source of truth that can
     *  disagree with what is on screen. */
    const dayOfItem = useMemo(() => {
        const byKey = new Map();
        let currentDay = null;
        for (const item of items) {
            if (item.kind === "day")
                currentDay = item.id;
            if (currentDay)
                byKey.set(item.key, currentDay);
        }
        return byKey;
    }, [items]);
    const days = useMemo(() => new Map(items
        .filter((i) => i.kind === "day")
        .map((d) => [d.id, d])), [items]);
    // Where the list starts inside the scroller (the column's top padding),
    // and the sticky header's height. Item offsets are relative to the list,
    // the scroll offset to the scroller. Both are measured, not taken from the
    // classes: the spacing scale follows the density setting.
    const list = useRef(null);
    const header = useRef(null);
    const geometry = useRef({ listTop: 0, header: 0 });
    useLayoutEffect(() => {
        const el = list.current;
        const scroller = root.current;
        if (!el || !scroller)
            return;
        geometry.current = {
            listTop: el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop,
            header: header.current?.offsetHeight ?? 0,
        };
    }, [root, items]);
    // The day of the item under the sticky header's bottom edge, the one being
    // read. Not the first item the virtualizer has mounted: that one is up to
    // `overscan` items above the viewport, so the date named a day already
    // scrolled away and changed ~900px late. On a board day of dozens of rows
    // that hid inside the day; the inbox's few-per-day entries showed it.
    const line = (virtualizer.scrollOffset ?? 0) + geometry.current.header - geometry.current.listTop;
    const reading = virtualRows.find((v) => v.end > line) ?? virtualRows[0];
    const readingKey = reading?.key;
    const currentId = (readingKey ? dayOfItem.get(readingKey) : undefined) ?? [...days.keys()][0];
    const current = currentId ? days.get(currentId) : undefined;
    if (items.length === 0 || !current)
        return null;
    return (_jsxs("div", { "data-slot": "timeline-calendar", className: className, children: [_jsx("header", { ref: header, className: cn(HEADER, "sticky top-0 z-panel flex items-end border-b border-border px-2 pb-2.5", "before:absolute before:-inset-x-4 before:inset-y-0 before:-z-10 before:bg-background"), children: _jsxs(motion.div, { initial: { x: -6, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { duration: 0.22, ease: EASE_PANEL }, className: "flex flex-1 items-end justify-between gap-3", children: [_jsxs("span", { className: "text-lg tracking-tight", children: [_jsx("span", { className: "font-medium text-foreground", children: current.date }), _jsxs("span", { className: "text-muted-foreground", children: [" / ", current.day] })] }), current.meta] }, current.id) }), _jsx("div", { ref: list, className: "isolate relative -mt-12", style: { height: virtualizer.getTotalSize() }, children: virtualRows.map((v) => {
                    const item = items[v.index];
                    if (!item)
                        return null;
                    return (_jsx("div", { "data-index": v.index, "data-day": item.kind === "day" ? item.id : undefined, ref: virtualizer.measureElement, className: "absolute inset-x-0 top-0", style: { transform: `translateY(${v.start}px)` }, children: item.kind === "day" ? (_jsx(DayHeader, { day: item, first: v.index === 0 })) : (_jsx("div", { className: "border-b border-border-subtle py-1", children: renderRow(item.data) })) }, v.key));
                }) })] }));
}
/** A day's own header, in the flow of the list. The first sits under the
 *  sticky header that is pulled over it; the rest carry the gap that
 *  separates them from the day above. Memoized: the calendar re-renders on
 *  every scroll frame, and a day's item is the same object until the list
 *  itself changes. */
const DayHeader = memo(function DayHeader({ day, first }) {
    return (_jsx("div", { className: cn(!first && "pt-10"), children: _jsxs("h2", { 
            // `px-2`: the date lines up with the rows' text, which sits inside
            // their fill.
            className: cn(HEADER, "flex items-end justify-between gap-3 border-b border-border px-2 pb-2.5"), children: [_jsxs("span", { className: "text-lg tracking-tight", children: [_jsx("span", { className: "font-medium text-foreground", children: day.date }), _jsxs("span", { className: "text-muted-foreground", children: ["\u00A0/ ", day.day] })] }), day.meta] }) }));
});
//# sourceMappingURL=timeline-calendar.js.map