import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { inputVariants } from "./input-variants.ts";
/**
 * The house text field (decision 32).
 *
 * shadcn's base-style `Input` in shape — one `<input>`, a `data-slot`, class
 * composition through `className` — sized on the Atlas control heights and
 * drawn with the theme's own `--input` / `--border` tokens.
 *
 * It keeps the global `:focus-visible` ring rather than drawing its own: one
 * focus indicator across the whole app is the point of decision 31. The border
 * still lifts to `--border-strong` on focus, which is the "this field is live"
 * signal a ring alone does not give a mouse user.
 */
export interface InputProps extends Omit<React.ComponentProps<"input">, "size">, VariantProps<typeof inputVariants> {
}
declare function Input({ className, size, type, ...props }: InputProps): React.JSX.Element;
export { Input, inputVariants };
//# sourceMappingURL=input.d.ts.map