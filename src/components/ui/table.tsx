import { cn } from "../../lib/utils.ts";

/**
 * A data table.
 *
 * A single hairline under the header, no
 * zebra striping, no vertical rules, 2rem rows, and the whole row highlighting
 * on hover. The grid is implied by alignment, not drawn.
 */

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-xs", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b [&_tr]:border-border-subtle", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn(className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-border-subtle font-medium text-secondary-foreground",
        className,
      )}
      {...props}
    />
  );
}

/**
 * `data-muted` dims a row's cells to 50%, the one disabled look, for a row
 * that is shown but not in play (a model this workspace has not been
 * granted, a link that has run out). The row's own hover and selection stay.
 */
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border-subtle transition-colors duration-fast ease-out-strong",
        "hover:bg-element-hover data-selected:bg-element-selected",
        "data-muted:*:opacity-50",
        "last:border-0",
        className,
      )}
      {...props}
    />
  );
}

/** A column heading. `eyebrow`-cased, never the same weight as the data. */
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-control-md px-3 text-left align-middle eyebrow whitespace-nowrap",
        "[&:has([role=checkbox])]:w-0 [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "h-8 px-3 align-middle whitespace-nowrap",
        "[&:has([role=checkbox])]:w-0 [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption data-slot="table-caption" className={cn("mt-3 caption", className)} {...props} />;
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
