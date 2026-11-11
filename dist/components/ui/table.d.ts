/**
 * A data table.
 *
 * A single hairline under the header, no
 * zebra striping, no vertical rules, 2rem rows, and the whole row highlighting
 * on hover. The grid is implied by alignment, not drawn.
 */
declare function Table({ className, ...props }: React.ComponentProps<"table">): import("react").JSX.Element;
declare function TableHeader({ className, ...props }: React.ComponentProps<"thead">): import("react").JSX.Element;
declare function TableBody({ className, ...props }: React.ComponentProps<"tbody">): import("react").JSX.Element;
declare function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">): import("react").JSX.Element;
/**
 * `data-muted` dims a row's cells to 50%, the one disabled look, for a row
 * that is shown but not in play (a model this workspace has not been
 * granted, a link that has run out). The row's own hover and selection stay.
 */
declare function TableRow({ className, ...props }: React.ComponentProps<"tr">): import("react").JSX.Element;
/** A column heading. `eyebrow`-cased, never the same weight as the data. */
declare function TableHead({ className, ...props }: React.ComponentProps<"th">): import("react").JSX.Element;
declare function TableCell({ className, ...props }: React.ComponentProps<"td">): import("react").JSX.Element;
declare function TableCaption({ className, ...props }: React.ComponentProps<"caption">): import("react").JSX.Element;
export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
//# sourceMappingURL=table.d.ts.map