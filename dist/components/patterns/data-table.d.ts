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
export type DataTableSort = {
    id: string;
    dir: "asc" | "desc";
} | null;
declare function DataTable<T>({ rows, columns, rowId, selectedId, onRowClick, toolbar, footer, empty, sort: sortProp, onSortChange, manualSorting, className, }: {
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
}): import("react").JSX.Element;
/** The toolbar search: desktop's usage-table field, a recessed well. */
declare function TableSearch({ className, ...props }: React.ComponentProps<"input">): import("react").JSX.Element;
export { DataTable, TableSearch };
//# sourceMappingURL=data-table.d.ts.map