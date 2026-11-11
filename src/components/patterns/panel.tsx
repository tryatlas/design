"use client";

import { ArrowUpRightIcon, SlidersHorizontalIcon } from "lucide-react";

import { cn } from "../../lib/utils.ts";
import { IconButton } from "../../ui/icon-button.tsx";

/**
 * The card of this system.
 *
 * `surface-card` — desktop's card: a hairline on a lighter step of the
 * ramp, never a shadow. A panel may carry a top-right action cluster
 * (filter, expand) of round ghost icon buttons; nothing in it is filled,
 * since the panel's content is the thing to read.
 *
 * Panels settle in with `animate-card-rise` (180ms, 4px up and a fade, a
 * fade alone under reduced motion), and a page staggers them down with
 * `index`, 30ms apart, so the eye is led rather than presented. CSS, not
 * `motion`: it plays while the page is busiest (the data just landed), and
 * a CSS animation stays off the main thread. The stagger stops at the sixth
 * panel; past that a wait is latency, not a lead.
 */
function Panel({
  title,
  subtitle,
  actions,
  onExpand,
  onFilter,
  className,
  bodyClassName,
  children,
  index = 0,
}: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  onExpand?: () => void;
  onFilter?: () => void;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
  /** The panel's place down the page, for the stagger. Capped at 5. */
  index?: number;
}) {
  return (
    <section
      data-slot="panel"
      className={cn(
        "flex min-w-0 animate-card-rise flex-col overflow-hidden surface-card",
        className,
      )}
      style={{ "--i": Math.min(Math.max(index, 0), 5) } as React.CSSProperties}
    >
      {(title || actions || onExpand || onFilter) && (
        <header className="flex items-start justify-between gap-3 px-3.5 pt-3 pb-2">
          <div className="min-w-0">
            {title && <h3 className="truncate text-sm font-medium text-foreground">{title}</h3>}
            {subtitle && <p className="mt-0.5 truncate caption">{subtitle}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {actions}
            {onFilter && (
              <IconButton
                icon={SlidersHorizontalIcon}
                label="Filter"
                size="sm"
                shape="round"
                onClick={onFilter}
              />
            )}
            {onExpand && (
              <IconButton
                icon={ArrowUpRightIcon}
                label="Open"
                size="sm"
                shape="round"
                onClick={onExpand}
              />
            )}
          </div>
        </header>
      )}
      <div className={cn("min-h-0 flex-1 px-3.5 pt-1 pb-3.5", bodyClassName)}>{children}</div>
    </section>
  );
}

export { Panel };
