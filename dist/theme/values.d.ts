/**
 * Concrete values for the consumers CSS cannot reach (pixi wants a 24-bit
 * integer). The pure half of desktop's `features/theme/theme-values.ts`; the
 * active-theme lookups and the change subscription stay in the app, which
 * owns the applied theme.
 */
/** Any CSS colour as pixi's 24-bit colour integer. Alpha is dropped; see `alphaOf`. */
export declare function hexOf(value: string): number;
/** The alpha channel of a colour, for the pixi calls that take it apart. */
export declare function alphaOf(value: string): number;
//# sourceMappingURL=values.d.ts.map