import { isValidElement } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "../../lib/utils.ts";
import { Icon } from "../../ui/icon.tsx";

/**
 * The small-caps label above a group of rows or cards.
 *
 * `eyebrow` rather than a heading: this labels a GROUP, and uppercase with
 * tracking is the one place this system allows it. A heading here would
 * compete with the page title.
 *
 * `title` takes any node (a count, a badge after the words); `icon` puts a
 * glyph before it, in the eyebrow's ink: a Lucide component at `sm`, or an
 * element drawn as given (an agent's mark).
 */
function SectionHeader({
  className,
  title,
  icon,
  description,
  action,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  title: React.ReactNode;
  icon?: LucideIcon | React.ReactElement;
  description?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      data-slot="section-header"
      className={cn("flex items-end justify-between gap-3 pb-2", className)}
      {...props}
    >
      <div className="flex flex-col gap-0.5">
        {icon ? (
          <span className="eyebrow flex min-w-0 items-center gap-1.5">
            <span data-slot="section-header-icon" className="flex shrink-0">
              {isValidElement(icon) ? icon : <Icon icon={icon} size="sm" />}
            </span>
            <span className="min-w-0">{title}</span>
          </span>
        ) : (
          <span className="eyebrow">{title}</span>
        )}
        {description && <span className="caption">{description}</span>}
      </div>
      {action && <div className="shrink-0 pb-0.5">{action}</div>}
    </div>
  );
}

/**
 * The title block at the top of a page: name, what it is, and at most one
 * primary action.
 *
 * One page title everywhere, desktop's settings title: `text-xl` at 500,
 * whose step carries its own leading and -0.02em tracking (no
 * `tracking-tight` on top). The description is a `caption` that wraps: a
 * lede cut off at one line hides the page's point. No bottom padding; the
 * page's own `gap` spaces it from what follows. A title outside this header
 * is the `page-title` utility.
 */
function PageHeader({
  className,
  title,
  description,
  action,
  ...props
}: React.ComponentProps<"div"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      data-slot="page-header"
      className={cn("flex flex-wrap items-end justify-between gap-3", className)}
      {...props}
    >
      <div className="min-w-0">
        <h1 className="truncate text-xl font-medium text-foreground">{title}</h1>
        {description && <p className="mt-1 caption">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export { PageHeader, SectionHeader };
