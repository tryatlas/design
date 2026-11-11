"use client";

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
 * The semantics come back without boxes: the mounted items are grouped by
 * day into `display: contents` wrappers, a `<section>` named for the day
 * holding its `<h2>` and a `role="list"` of its rows, each row a `listitem`
 * that knows its place in the whole day (`aria-posinset` / `aria-setsize`).
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

import {
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "../../lib/utils.ts";

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
export type CalendarItem<T> =
  | ({ kind: "day"; key: string } & CalendarDay)
  | { kind: "row"; key: string; dayId: string; data: T };

/** Header height; the sticky header and each day's header share it. */
const HEADER = "h-12";

/** Starting guesses, corrected by measurement as items mount. A day header
 *  after the first also carries the gap that separates it from the day above. */
const FIRST_DAY_SIZE = 48;
const DAY_SIZE = 88;
const ROW_SIZE = 86;

export function TimelineCalendar<T>({
  items,
  root,
  renderRow,
  flush = false,
  endSpace = true,
  className,
}: {
  items: CalendarItem<T>[];
  /** The scroll container. In this shell the window never scrolls, a panel
   *  does, and a virtualizer measuring the viewport would never fire. */
  root: RefObject<HTMLElement | null>;
  renderRow: (data: T) => ReactNode;
  /**
   * Where the dates sit. By default they are inset 8px (`px-2`), in line with
   * the text of a row whose fill sits inside the hairlines with its own
   * `px-2` — desktop's `SessionRow`, and the recipe to copy. `flush` puts
   * them on the column's edge, for rows whose text is there (a row whose fill
   * overhangs the column with `-mx-2 px-2`).
   */
  flush?: boolean;
  /**
   * Room after the last row so the last day can scroll up under the sticky
   * header and become its date. Without it a short final day never reaches
   * the top, and the header keeps naming the day above. Sized from the
   * scroller: just enough for the last day's heading to reach the date, and
   * none when the last day is already a viewport long.
   *
   * `true` sizes it as if the list ends the scroller. When something follows
   * the list inside the scroller (a column's bottom padding, a note, a
   * load-more sentinel), that content scrolls too, so the last day overshoots
   * the date and leaves an empty column under the wrong one. `"measure"`
   * counts whatever the scroller holds after the calendar and leaves only the
   * rest: the end stops with the last day under the date.
   */
  endSpace?: boolean | "measure";
  className?: string;
}) {
  // The scroller is a ref owned by the board, so it is null on this
  // component's first render. One flip once it exists gets the virtualizer
  // measuring instead of silently sizing against nothing.
  const [scrollerReady, setScrollerReady] = useState(false);
  useEffect(() => {
    if (root.current) setScrollerReady(true);
  }, [root]);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => root.current,
    estimateSize: (i) =>
      items[i]?.kind === "day" ? (i === 0 ? FIRST_DAY_SIZE : DAY_SIZE) : ROW_SIZE,
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
    const byKey = new Map<string, string>();
    let currentDay: string | null = null;
    for (const item of items) {
      if (item.kind === "day") currentDay = item.id;
      if (currentDay) byKey.set(item.key, currentDay);
    }
    return byKey;
  }, [items]);

  const days = useMemo(
    () =>
      new Map(
        items
          .filter((i): i is Extract<CalendarItem<T>, { kind: "day" }> => i.kind === "day")
          .map((d) => [d.id, d]),
      ),
    [items],
  );

  /** Each row's place in its day, for `aria-posinset` / `aria-setsize`: only
   *  the rows near the viewport exist, so assistive tech is told the rest. */
  const placeOfRow = useMemo(() => {
    const byKey = new Map<string, { pos: number; size: number }>();
    const perDay = new Map<string, string[]>();
    for (const item of items) {
      if (item.kind !== "row") continue;
      const day = dayOfItem.get(item.key) ?? item.dayId;
      const keys = perDay.get(day);
      if (keys) keys.push(item.key);
      else perDay.set(day, [item.key]);
    }
    for (const keys of perDay.values())
      keys.forEach((key, i) => byKey.set(key, { pos: i + 1, size: keys.length }));
    return byKey;
  }, [items, dayOfItem]);

  // Where the list starts inside the scroller (the column's top padding),
  // and the sticky header's height. Item offsets are relative to the list,
  // the scroll offset to the scroller. Both are measured, not taken from the
  // classes: the spacing scale follows the density setting.
  const list = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLDivElement>(null);
  // State, not a ref: the end space is drawn from it, so a new measurement
  // has to re-render (before paint, from a layout effect) rather than wait
  // for the next scroll.
  const [geometry, setGeometry] = useState({ listTop: 0, header: 0 });
  useLayoutEffect(() => {
    const el = list.current;
    const scroller = root.current;
    if (!el || !scroller) return;
    const next = {
      listTop:
        el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop,
      header: header.current?.offsetHeight ?? 0,
    };
    setGeometry((prev) =>
      prev.listTop === next.listTop && prev.header === next.header ? prev : next,
    );
    // `scrollerReady`: on the first commit the scroller's ref is not attached
    // yet (a parent's ref lands after its children's layout effects), so this
    // measured nothing and the header counted as 0px until the list changed.
  }, [root, items, scrollerReady]);

  // With `endSpace="measure"`, the height of what the scroller holds after
  // the calendar, which scrolls as part of the end. Measured to the bottom of
  // the scroller's content, so it counts padding and margins as well as
  // siblings. Before the end space makes the content overflow, that bottom
  // also takes in a stretched column's free space; each pass removes it and
  // the next measurement is smaller, so it settles in a pass or two, before
  // paint (a layout effect), and stays put once the content overflows.
  const self = useRef<HTMLDivElement>(null);
  const [after, setAfter] = useState(0);
  const measureAfter = endSpace === "measure";
  const scrollerHeight = virtualizer.scrollRect?.height;

  /** The last day's header item, whose end the end space is measured from. */
  const lastDay = useMemo(() => {
    for (let i = items.length - 1; i >= 0; i--) if (items[i]?.kind === "day") return i;
    return -1;
  }, [items]);

  // The day of the item under the sticky header's bottom edge, the one being
  // read. Not the first item the virtualizer has mounted: that one is up to
  // `overscan` items above the viewport, so the date named a day already
  // scrolled away and changed ~900px late. On a board day of dozens of rows
  // that hid inside the day; the inbox's few-per-day entries showed it.
  const line = (virtualizer.scrollOffset ?? 0) + geometry.header - geometry.listTop;
  const reading = virtualRows.find((v) => v.end > line) ?? virtualRows[0];
  const readingKey = reading?.key as string | undefined;
  const currentId = (readingKey ? dayOfItem.get(readingKey) : undefined) ?? [...days.keys()][0];
  const current = currentId ? days.get(currentId) : undefined;

  // The scroller must be able to go far enough for the last day's own heading
  // to slide fully under the sticky one, as every other day's does: its rows
  // plus this space fill the viewport below the header. A fixed 80vh overshot
  // a scroller shorter than the window and let the last day scroll clean off
  // the top; this is exactly enough, and nothing once the last day is long.
  const lastDayEnd = virtualizer.measurementsCache[lastDay]?.end ?? 0;
  const endHeight = endSpace
    ? Math.max(
        0,
        Math.ceil(
          (virtualizer.scrollRect?.height ?? 0) -
            geometry.header -
            (virtualizer.getTotalSize() - lastDayEnd) -
            (measureAfter ? after : 0),
        ),
      )
    : 0;

  // Re-measured when the end space itself changes (the settling pass above),
  // when the list or the scroller's height changes, and not on scroll.
  const measureEnd = () => {
    const el = self.current;
    const scroller = root.current;
    if (!el || !scroller) return;
    const bottom =
      el.getBoundingClientRect().bottom -
      scroller.getBoundingClientRect().top -
      scroller.clientTop +
      scroller.scrollTop;
    const next = Math.max(0, Math.round(scroller.scrollHeight - bottom));
    setAfter((prev) => (prev === next ? prev : next));
  };
  useLayoutEffect(() => {
    if (measureAfter) measureEnd();
    // `measureEnd` reads refs and sets state only, so it is not a dep.
  }, [measureAfter, root, items, scrollerReady, scrollerHeight, endHeight]);
  // And when what follows changes size on its own: a note rewrapping in a
  // narrower column, a load-more sentinel mounting. The calendar's parent
  // and the scroller's content box both grow with it.
  useEffect(() => {
    const el = self.current;
    const scroller = root.current;
    if (!measureAfter || !el || !scroller) return;
    const observer = new ResizeObserver(() => measureEnd());
    for (const box of new Set([el.parentElement, scroller.firstElementChild]))
      if (box) observer.observe(box);
    return () => observer.disconnect();
  }, [measureAfter, root, scrollerReady, items.length === 0]);

  if (items.length === 0 || !current) return null;

  // The mounted items, cut into runs by day. Each run is its day's
  // `<section>` (named, as the unvirtualized calendar's were) holding the
  // day's heading, if mounted, and a list of its mounted rows. The wrappers
  // are `display: contents`, so they add semantics and no boxes: every item
  // still positions against the list below, where the virtualizer put it.
  const runs: { dayId: string; items: typeof virtualRows }[] = [];
  for (const v of virtualRows) {
    const item = items[v.index];
    if (!item) continue;
    const dayId = item.kind === "day" ? item.id : (dayOfItem.get(item.key) ?? item.dayId);
    const run = runs.at(-1);
    if (run?.dayId === dayId) run.items.push(v);
    else runs.push({ dayId, items: [v] });
  }

  const place = (v: (typeof virtualRows)[number], child: ReactNode, props: object = {}) => (
    <div
      key={v.key}
      data-index={v.index}
      ref={virtualizer.measureElement}
      className="absolute inset-x-0 top-0"
      style={{ transform: `translateY(${v.start}px)` }}
      {...props}
    >
      {child}
    </div>
  );

  return (
    <div ref={self} data-slot="timeline-calendar" className={className}>
      {/* The backing bleeds past each side, so nothing scrolling under the
          date shows at its edges. A plain div, not a <header>: it repeats a
          heading that is already in the list, so it is no landmark, and its
          date is hidden from assistive tech, which reads the day headings. */}
      <div
        ref={header}
        className={cn(
          HEADER,
          "sticky top-0 z-panel flex items-end border-b border-border pb-2.5",
          !flush && "px-2",
          "before:absolute before:-inset-x-4 before:inset-y-0 before:-z-10 before:bg-background",
        )}
      >
        {/* Keyed, with no exit: the key change unmounts the old date and
            mounts the new one, which fades in. Presence would keep the
            OUTGOING date alive for its exit, and a fast scroll changes the
            day faster than an exit completes — so they stacked, and "Today"
            sat in the header next to the day you had actually scrolled to
            and never left. A fade only: the date changes tens of times a
            visit, and a sideways slide claims a direction that is wrong
            when scrolling up. */}
        <div
          key={current.id}
          className="flex flex-1 animate-fade-in items-end justify-between gap-3"
        >
          <span aria-hidden="true" className="text-lg tracking-tight">
            <span className="font-medium text-foreground">{current.date}</span>
            <span className="text-muted-foreground"> / {current.day}</span>
          </span>
          {current.meta}
        </div>
      </div>

      {/* `isolate`: rows raise their own hover background, and this keeps
          those layers inside the list, under the sticky date. */}
      <div
        ref={list}
        className="isolate relative -mt-12"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {runs.map((run) => {
          const day = days.get(run.dayId);
          const heading = run.items[0] && items[run.items[0].index]?.kind === "day";
          const rows = heading ? run.items.slice(1) : run.items;
          return (
            <section
              key={run.dayId}
              aria-label={day ? `${day.date}, ${day.day}` : undefined}
              className="contents"
            >
              {heading &&
                place(
                  run.items[0]!,
                  <DayHeader
                    day={days.get(run.dayId)!}
                    first={run.items[0]!.index === 0}
                    flush={flush}
                  />,
                  { "data-day": run.dayId },
                )}
              {rows.length > 0 && (
                <div role="list" className="contents">
                  {rows.map((v) => {
                    const item = items[v.index];
                    if (item?.kind !== "row") return null;
                    const where = placeOfRow.get(item.key);
                    return place(
                      v,
                      // `py-1`: a selected or hovered row's fill sits inside
                      // the hairlines rather than touching them.
                      <div className="border-b border-border-subtle py-1">
                        {renderRow(item.data)}
                      </div>,
                      {
                        role: "listitem",
                        "aria-posinset": where?.pos,
                        "aria-setsize": where?.size,
                      },
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
      {endSpace && (
        <div aria-hidden="true" data-slot="timeline-calendar-end" style={{ height: endHeight }} />
      )}
    </div>
  );
}

/** A day's own header, in the flow of the list. The first sits under the
 *  sticky header that is pulled over it; the rest carry the gap that
 *  separates them from the day above. Memoized: the calendar re-renders on
 *  every scroll frame, and a day's item is the same object until the list
 *  itself changes. */
const DayHeader = memo(function DayHeader({
  day,
  first,
  flush,
}: {
  day: CalendarDay;
  first: boolean;
  flush: boolean;
}) {
  return (
    <div className={cn(!first && "pt-10")}>
      <h2
        // `px-2` unless `flush`: the date lines up with the rows' text.
        className={cn(
          HEADER,
          "flex items-end justify-between gap-3 border-b border-border pb-2.5",
          !flush && "px-2",
        )}
      >
        <span className="text-lg tracking-tight">
          <span className="font-medium text-foreground">{day.date}</span>
          <span className="text-muted-foreground">&nbsp;/ {day.day}</span>
        </span>
        {day.meta}
      </h2>
    </div>
  );
});
