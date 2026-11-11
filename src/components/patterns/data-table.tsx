"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "lucide-react";

import { cn } from "../../lib/utils.ts";
import { Icon } from "../../ui/icon.tsx";
import { ScrollFade, useScrollEdges } from "../../ui/scroll-fade.tsx";

/**
 * The data table, without a table-library
 * dependency — a mock with a dozen rows needs sort-by-column and a search
 * box, and both are twenty lines of state.
 *
 * Shape, after desktop's usage tables: a `card` with an `element-selected`
 * hairline; a toolbar band; a sticky header row of eyebrows; rows divided by
 * `border-subtle` hairlines; and a footer band. Rows highlight on hover and
 * take the `element-selected` wash when chosen. Right-aligned cells are
 * tabular. The body fades at an edge only while there is more past it.
 *
 * Sorting is local by default: a header click sorts `rows` by the column's
 * `sortValue`. A table whose data is sorted on the server controls it
 * instead: pass `sort` and `onSortChange` to own the state, and
 * `manualSorting` so the table draws `rows` in the order given. Under
 * `manualSorting`, a column with no `sortValue` opts in with `sortable`.
 */

export type Column<T> = {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  /** Enables the sort toggle. Return a comparable value. */
  sortValue?: (row: T) => string | number;
  /** Enables the sort toggle without a `sortValue`. Only under
   *  `manualSorting`, where the rows arrive sorted. */
  sortable?: boolean;
  align?: "left" | "right";
  className?: string;
};

/** The column a table is sorted by, or `null` for the order given. */
export type DataTableSort = { id: string; dir: "asc" | "desc" } | null;

/** A header click: ascending, then descending, then unsorted. */
function nextSort(current: DataTableSort, id: string): DataTableSort {
  if (current?.id !== id) return { id, dir: "asc" };
  return current.dir === "asc" ? { id, dir: "desc" } : null;
}

function DataTable<T>({
  rows,
  columns,
  rowId,
  selectedId,
  onRowClick,
  toolbar,
  footer,
  empty,
  sort: sortProp,
  onSortChange,
  manualSorting = false,
  className,
}: {
  rows: Array<T>;
  columns: Array<Column<T>>;
  rowId: (row: T) => string;
  selectedId?: string;
  onRowClick?: (row: T) => void;
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
  /** What the body says when there are no rows (a filter that matched
   *  nothing, a period with no sessions). Without it the body is blank. */
  empty?: React.ReactNode;
  /** The sort, controlled. Leave it out and the table keeps its own. */
  sort?: DataTableSort;
  /** Called with the next sort on a header click, controlled or not. */
  onSortChange?: (next: DataTableSort) => void;
  /** `rows` arrive already sorted (on the server): draw them as given. */
  manualSorting?: boolean;
  className?: string;
}) {
  const [localSort, setLocalSort] = useState<DataTableSort>(null);
  const sort = sortProp !== undefined ? sortProp : localSort;
  const scroller = useRef<HTMLDivElement>(null);
  const edges = useScrollEdges(scroller, [rows]);

  const sorted = useMemo(() => {
    if (!sort || manualSorting) return rows;
    const col = columns.find((c) => c.id === sort.id);
    if (!col?.sortValue) return rows;
    const get = col.sortValue;
    return [...rows].sort((a, b) => {
      const av = get(a);
      const bv = get(b);
      const r = av < bv ? -1 : av > bv ? 1 : 0;
      return sort.dir === "asc" ? r : -r;
    });
  }, [rows, columns, sort, manualSorting]);

  function toggle(id: string) {
    const next = nextSort(sort, id);
    if (sortProp === undefined) setLocalSort(next);
    onSortChange?.(next);
  }

  return (
    <div
      data-slot="data-table"
      className={cn(
        // A container, so columns can hide by the TABLE's width rather than
        // the viewport's — the dock and the interface scale both change one
        // without the other.
        "@container flex min-h-0 flex-col overflow-hidden rounded-lg border border-element-selected bg-card",
        // The scroller's keyboard focus rings the whole card, as InputGroup
        // does: drawn on the scroller, the sticky header and the card's clip
        // would hide most of it.
        "has-[[data-slot=data-table-scroller]:focus-visible]:outline-2 has-[[data-slot=data-table-scroller]:focus-visible]:outline-offset-1 has-[[data-slot=data-table-scroller]:focus-visible]:outline-ring has-[[data-slot=data-table-scroller]:focus-visible]:outline-solid",
        className,
      )}
    >
      {toolbar && (
        <div className="flex h-9 shrink-0 items-center gap-2 border-b border-element-selected px-2">
          {toolbar}
        </div>
      )}

      {/* Both axes: when the fixed columns outgrow the container the table
          scrolls sideways (scrollbars are hidden, so it reads as a pan)
          rather than clipping under the ring. */}
      <div className="relative flex min-h-0 flex-1 flex-col">
        {/* Focusable, so a keyboard can scroll it. */}
        <div
          ref={scroller}
          data-slot="data-table-scroller"
          tabIndex={0}
          className="min-h-0 flex-1 overflow-auto focus-ring-none"
        >
          <table className="w-full border-separate border-spacing-0 text-xs">
            <thead className="sticky top-0 z-panel">
              <tr>
                {columns.map((col) => {
                  const active = sort?.id === col.id;
                  // Sorted here, a column needs a `sortValue`; sorted elsewhere,
                  // `sortable` is enough. Otherwise the arrow would claim a
                  // sort the rows don't show.
                  const sortable = !!col.sortValue || (manualSorting && !!col.sortable);
                  return (
                    <th
                      key={col.id}
                      scope="col"
                      className={cn(
                        "h-control-md border-b border-element-selected bg-card px-3 text-left eyebrow whitespace-nowrap",
                        col.align === "right" && "text-right",
                        sortable && "cursor-pointer select-none hover:text-foreground",
                        col.className,
                      )}
                      onClick={sortable ? () => toggle(col.id) : undefined}
                      aria-sort={
                        active ? (sort.dir === "asc" ? "ascending" : "descending") : undefined
                      }
                    >
                      <span
                        className={cn(
                          "inline-flex items-center gap-1",
                          col.align === "right" && "flex-row-reverse",
                        )}
                      >
                        {col.header}
                        {active && (
                          <Icon
                            icon={sort.dir === "asc" ? ArrowUpIcon : ArrowDownIcon}
                            size="xs"
                            className="size-2.5"
                          />
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => {
                const id = rowId(row);
                const selected = id === selectedId;
                return (
                  <tr
                    key={id}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    // A clickable row is a keyboard stop too: Tab reaches it,
                    // Enter or Space opens it, as a click does. The ring is
                    // drawn inset, since the scroller clips anything outside.
                    tabIndex={onRowClick ? 0 : undefined}
                    onKeyDown={
                      onRowClick
                        ? (e) => {
                            if (e.target !== e.currentTarget) return;
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onRowClick(row);
                            }
                          }
                        : undefined
                    }
                    aria-selected={selected || undefined}
                    className={cn(
                      "group/row transition-colors duration-fast ease-out-strong",
                      selected ? "bg-element-selected" : "hover:bg-element-hover",
                      onRowClick && "cursor-pointer focus-visible:-outline-offset-2",
                    )}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className={cn(
                          "h-8 border-b border-border-subtle px-3 align-middle",
                          col.align === "right" && "text-right tabular-nums",
                          col.className,
                        )}
                      >
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {sorted.length === 0 && empty && (
                <tr>
                  <td colSpan={columns.length} className="h-24 px-3 text-center caption">
                    {empty}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <ScrollFade at="bottom" visible={edges.bottom} className="from-card" />
      </div>

      {footer && (
        <div className="flex h-control-lg shrink-0 items-center gap-2 border-t border-element-selected px-3 text-2xs text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}

/** The toolbar search: desktop's usage-table field, a recessed well. */
function TableSearch({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <div className={cn("relative", className)}>
      <Icon
        icon={SearchIcon}
        size="xs"
        className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="search"
        className="h-control-md w-50 rounded-md border border-border bg-background pr-2 pl-6 text-xs text-foreground outline-none focus-ring-none placeholder:text-muted-foreground focus:border-border-strong"
        {...props}
      />
    </div>
  );
}

export { DataTable, TableSearch };
