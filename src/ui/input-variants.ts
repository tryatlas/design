import { cva } from "class-variance-authority";

/** `Input`'s class recipe, without `"use client"` so a server component can call it. */
const inputVariants = cva(
  [
    "w-full min-w-0 rounded border bg-panel-input text-foreground",
    "border-border transition-colors duration-fast ease-out-strong",
    "placeholder:text-muted-foreground",
    // A text field draws no outline (decision 31): the border is the focus
    // signal, in the keyboard ring's colour so it clears 3:1 on the fill.
    "focus:border-ring",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:border-destructive",
    // A value to read and copy, not to edit: no field fill, secondary ink,
    // and the border stays put on focus, since there is nothing to type.
    // `not-disabled`: a disabled field matches `:read-only` too, and keeps
    // the disabled look.
    "read-only:not-disabled:bg-transparent read-only:not-disabled:text-secondary-foreground read-only:focus:border-border",
  ],
  {
    variants: {
      // Every size types at 16px on a touch screen (`text-lg`): below that,
      // iOS zooms the page when the field takes focus.
      size: {
        xs: "h-control-xs px-1.5 text-2xs pointer-coarse:text-lg",
        sm: "h-control-sm px-2 text-xs pointer-coarse:text-lg",
        md: "h-control-md px-2 text-xs pointer-coarse:text-lg",
        lg: "h-control-lg px-2.5 text-sm pointer-coarse:text-lg",
      },
      // `code` is a one-time code or a key typed character by character:
      // centred, monospaced, spaced and upper-case, at 16px everywhere.
      variant: {
        default: "",
        code: "text-center font-mono text-lg tracking-widest uppercase",
      },
    },
    defaultVariants: { size: "md", variant: "default" },
  },
);

export { inputVariants };
