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
import { type ReactNode, type RefObject } from "react";
export interface CalendarDay {
    id: string;
    /** The bright part, e.g. "October 13". */
    date: string;
    /** The quiet part after the slash, e.g. "Today" or "Monday". */
    day: string;
    /** Right-aligned summary of the day — totals, a face stack. */
    meta?: ReactNode;
}
/** One line of the flattened list: a day's header, or a row under it. */
export type CalendarItem<T> = ({
    kind: "day";
    key: string;
} & CalendarDay) | {
    kind: "row";
    key: string;
    dayId: string;
    data: T;
};
export declare function TimelineCalendar<T>({ items, root, renderRow, className, }: {
    items: CalendarItem<T>[];
    /** The scroll container. In this shell the window never scrolls, a panel
     *  does, and a virtualizer measuring the viewport would never fire. */
    root: RefObject<HTMLElement | null>;
    renderRow: (data: T) => ReactNode;
    className?: string;
}): import("react").JSX.Element | null;
//# sourceMappingURL=timeline-calendar.d.ts.map