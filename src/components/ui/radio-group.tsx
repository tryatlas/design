"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { CheckIcon } from "lucide-react";
import { cn } from "../../lib/utils.ts";
import { Icon } from "../../ui/icon.tsx";

/**
 * `density="compact"` packs the options 4px apart instead of 8, for a stack
 * of `RadioCard`s inside a dialog, where the cards' own borders already
 * separate them.
 */
function RadioGroup({
  className,
  density = "default",
  ...props
}: RadioGroupPrimitive.Props & { density?: "default" | "compact" }) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      data-density={density === "compact" ? density : undefined}
      className={cn("grid", density === "compact" ? "gap-1" : "gap-2", className)}
      {...props}
    />
  );
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "relative flex size-3.5 shrink-0 items-center justify-center",
        // `border-strong` at rest, as `Checkbox`: a 14px ring in `border` vanishes.
        "rounded-full border border-border-strong bg-panel-input",
        "transition-colors duration-fast ease-out-strong",
        "after:absolute after:-inset-x-2 after:-inset-y-2",
        "data-checked:border-primary data-checked:bg-primary",
        // Base UI renders a span, not a button, so `:disabled` never matches.
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        "aria-invalid:border-destructive",
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="size-1.5 rounded-full bg-primary-foreground"
      />
    </RadioPrimitive.Root>
  );
}

/**
 * An option that needs a sentence to choose between: a model, a role, what
 * to delete. The whole card is the radio, inside a `RadioGroup`, so the
 * arrow keys move between cards as between dots. The chosen card takes the
 * selected fill and a stronger edge, and a check at its end; the rest lift
 * on hover. Disabled is the one disabled look, 50%.
 */
function RadioCard({
  className,
  title,
  description,
  ...props
}: Omit<RadioPrimitive.Root.Props, "title"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-card"
      className={cn(
        "flex w-full items-start gap-3 rounded-md border border-border bg-card px-3 py-2.5 text-left",
        "transition-colors duration-fast ease-out-strong hover:bg-element-hover",
        "data-checked:border-border-strong data-checked:bg-element-selected",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:bg-card",
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{title}</span>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </span>
      <RadioPrimitive.Indicator
        data-slot="radio-card-indicator"
        className="mt-0.5 flex shrink-0 animate-scale-in text-foreground"
      >
        <Icon icon={CheckIcon} size="sm" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}

export { RadioCard, RadioGroup, RadioGroupItem };
