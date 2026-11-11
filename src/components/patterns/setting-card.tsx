import { ChevronRightIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils.ts";

import { Icon } from "../../ui/icon.tsx";
import { Hint } from "../../ui/tooltip.tsx";

/**
 * The atom every settings surface is built from.
 *
 * A bordered card containing divided rows. Each row is a label with an
 * optional description on the left, and exactly one control hard-right: a
 * switch, a select, a button, a badge, or a chevron.
 *
 * Why it is a component and not a div with two children: the alignment is the
 * whole point. Every row in a card shares one baseline for its label and one
 * right edge for its control, and the moment a screen hand-rolls one row the
 * column breaks. Six screens in this app show settings; they all use this.
 *
 * Rows are `min-h`, not `h` — a two-line description grows the row rather
 * than clipping.
 */

function SettingCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="setting-card"
      className={cn("divide-y divide-border-subtle overflow-hidden surface-card", className)}
      {...props}
    />
  );
}

type SettingRowProps = React.ComponentProps<"div"> & {
  label: React.ReactNode;
  description?: React.ReactNode;
  /** The control. Goes hard-right, vertically centred against the label. */
  control?: React.ReactNode;
  icon?: LucideIcon;
  /**
   * The setting cannot change right now. The words dim to 50% and the
   * control is inert (no pointer, no focus, no key) at the same 50%: one dim
   * each, never one inside the other. Pair it with `disabledReason`.
   */
  disabled?: boolean;
  /**
   * Why it cannot change, shown in a hint over the control while `disabled`.
   * The control's wrapper keeps one tab stop, so the reason is reachable by
   * keyboard too.
   */
  disabledReason?: string;
};

/**
 * One setting: desktop's row. The title at `text-sm`, the description at
 * `text-xs` under it, the control hard-right, 2rem between them.
 */
function SettingRow({
  className,
  label,
  description,
  control,
  icon,
  disabled = false,
  disabledReason,
  children,
  ...props
}: SettingRowProps) {
  // `inert`, not `pointer-events-none`: a disabled row's switch must not take
  // focus or a Space from the keyboard either.
  const inertControl = control && disabled && (
    <span inert className="inline-flex disabled-look">
      {control}
    </span>
  );
  return (
    <div
      data-slot="setting-row"
      data-disabled={disabled || undefined}
      className={cn(
        // Wraps rather than squeezes: once the label column would drop under
        // 12rem (`basis-48`), the control moves under the label instead of
        // crushing it to a word a line. At settings widths it never does.
        "flex min-h-9 flex-wrap items-center gap-x-8 gap-y-2.5 px-4 py-3",
        className,
      )}
      {...props}
    >
      {icon && (
        <Icon
          icon={icon}
          size="sm"
          className={cn("text-muted-foreground", disabled && "opacity-50")}
        />
      )}
      <div
        className={cn("flex min-w-0 flex-1 basis-48 flex-col gap-0.5", disabled && "opacity-50")}
      >
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && (
          <span className="max-w-xl text-xs text-muted-foreground">{description}</span>
        )}
      </div>
      {control && (
        <div className="shrink-0">
          {inertControl && disabledReason ? (
            <Hint label={disabledReason}>
              {/* A group, so the reason can name it: a bare span may not carry a label. */}
              <span role="group" tabIndex={0} className="inline-flex rounded">
                {inertControl}
              </span>
            </Hint>
          ) : (
            inertControl || control
          )}
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * A row that navigates rather than sets. The whole row is the target, so the
 * chevron is decoration — it must not be the only thing that is clickable.
 */
function DrillInRow({
  className,
  label,
  description,
  icon,
  value,
  ...props
}: Omit<React.ComponentProps<"button">, "value"> & {
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: LucideIcon;
  value?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      data-slot="drill-in-row"
      className={cn(
        "flex min-h-9 w-full items-center gap-3 px-3 py-2 text-left",
        "transition-colors duration-fast ease-out-strong hover:bg-element-hover",
        // The same disabled look as `Button`: dimmed, and no hover to promise
        // a click that will not land.
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent",
        className,
      )}
      {...props}
    >
      {icon && <Icon icon={icon} size="sm" className="text-muted-foreground" />}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="label">{label}</span>
        {description && <span className="caption">{description}</span>}
      </div>
      {value && <span className="shrink-0 caption">{value}</span>}
      <Icon icon={ChevronRightIcon} size="sm" className="shrink-0 text-muted-foreground" />
    </button>
  );
}

export { DrillInRow, SettingCard, SettingRow };
