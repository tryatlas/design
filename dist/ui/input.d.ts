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
 * A text field draws no outline (decision 31): browsers match
 * `:focus-visible` on a field however it was focused, so a ring would draw on
 * every click. Its border lifts to `--ring` on focus instead, the keyboard
 * ring's colour, which clears 3:1 on the field's fill.
 */
export interface InputProps extends Omit<React.ComponentProps<"input">, "size">, VariantProps<typeof inputVariants> {
}
declare function Input({ className, size, type, ...props }: InputProps): React.JSX.Element;
export { Input, inputVariants };
//# sourceMappingURL=input.d.ts.map