import { parseColor } from "./color.js";
/**
 * Concrete values for the consumers CSS cannot reach (pixi wants a 24-bit
 * integer). The pure half of desktop's `features/theme/theme-values.ts`; the
 * active-theme lookups and the change subscription stay in the app, which
 * owns the applied theme.
 */
/** Any CSS colour as pixi's 24-bit colour integer. Alpha is dropped; see `alphaOf`. */
export function hexOf(value) {
    const color = parseColor(value);
    if (!color)
        return 0;
    return (((Math.round(color.r) & 0xff) << 16) |
        ((Math.round(color.g) & 0xff) << 8) |
        (Math.round(color.b) & 0xff));
}
/** The alpha channel of a colour, for the pixi calls that take it apart. */
export function alphaOf(value) {
    return parseColor(value)?.a ?? 1;
}
//# sourceMappingURL=values.js.map