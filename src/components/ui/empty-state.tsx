import type { LucideIcon } from "lucide-react";
import { isValidElement } from "react";
import { cn } from "../../lib/utils.ts";

import { Icon } from "../../ui/icon.tsx";

/**
 * What a pane says when it has nothing to show.
 *
 * Deliberately quiet: a large illustration in an empty inbox is a reward for
 * having no work, which is the wrong emphasis in a tool people live in. One
 * dim glyph, one sentence, and — only when there is a real next step — one
 * action.
 *
 * The copy rule: say what would be here, not that there is nothing here.
 * "No sessions in the last 7 days" beats "Nothing found".
 *
 * `size="page"` is a whole page with nothing on it yet: more room above and
 * below, and the title a step up, so it holds the page rather than floating
 * in the top of it. A pane or a card keeps the default.
 */
function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "page";
  /**
   * A Lucide component, drawn through `Icon` at `md`; or an element, drawn as
   * given in the same 32px box, for a glyph that is not a Lucide icon (a
   * provider's logo, a package mark). Size an element yourself (14–16px sits
   * right) and keep it `aria-hidden`: the title says what is missing.
   */
  icon?: LucideIcon | React.ReactElement;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      data-slot="empty-state"
      data-size={size === "page" ? size : undefined}
      className={cn(
        "flex flex-col items-center justify-center gap-2 px-6 text-center",
        size === "page" ? "py-20" : "py-12",
        className,
      )}
      {...props}
    >
      {icon && (
        <div className="flex size-control-lg items-center justify-center rounded-md border border-border text-muted-foreground">
          {isValidElement(icon) ? icon : <Icon icon={icon} size="md" />}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <p className={cn("font-medium text-foreground", size === "page" ? "text-md" : "text-sm")}>
          {title}
        </p>
        {description && (
          <p className="max-w-[34ch] text-xs text-balance text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

export { EmptyState };
