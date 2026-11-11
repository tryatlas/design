import { cn } from "../../lib/utils.ts";

/**
 * Multi-line text. Same border and focus language as <Input>, the same 16px
 * on a touch screen (iOS zooms the page into a smaller field), and the same
 * read-only look.
 */
type TextareaSize = "sm" | "md" | "lg";

/** Each size's padding, type step and floor, in step with `Input`'s. */
const SIZE: Record<TextareaSize, string> = {
  sm: "min-h-12 px-1.5 py-1 text-2xs",
  md: "min-h-16 px-2 py-1.5 text-xs",
  lg: "min-h-20 px-2.5 py-2 text-sm",
};

function Textarea({
  className,
  size = "md",
  ...props
}: React.ComponentProps<"textarea"> & { size?: TextareaSize }) {
  return (
    <textarea
      data-slot="textarea"
      data-size={size === "md" ? undefined : size}
      className={cn(
        "w-full min-w-0 rounded border border-border bg-panel-input text-foreground",
        SIZE[size],
        "pointer-coarse:text-lg field-sizing-content",
        "transition-colors duration-fast ease-out-strong",
        "placeholder:text-muted-foreground",
        "focus:border-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive",
        "read-only:not-disabled:bg-transparent read-only:not-disabled:text-secondary-foreground read-only:focus:border-border",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
export type { TextareaSize };
