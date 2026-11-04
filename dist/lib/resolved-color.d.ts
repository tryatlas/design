/**
 * Resolve any CSS colour — including `oklch()` and `color-mix()` — to a
 * concrete RGB triple.
 *
 * Canvas 2D and WebGL take colour strings, not custom properties, and they
 * do not understand every syntax the token layer uses. A 1×1 canvas does:
 * assign the value to `fillStyle`, paint a pixel, and read it back. The
 * browser's own colour engine does the conversion, so this stays correct as
 * the token layer evolves.
 *
 * Reads the variable off `<html>` so it resolves against the active theme.
 */
export type Rgb = {
    r: number;
    g: number;
    b: number;
};
export declare function resolveColor(value: string): Rgb | null;
/** The resolved value of a custom property on the document root. */
export declare function resolveToken(name: string): Rgb | null;
export declare function rgbString({ r, g, b }: Rgb, alpha?: number): string;
//# sourceMappingURL=resolved-color.d.ts.map