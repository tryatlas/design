export interface RgbaColor {
    r: number;
    g: number;
    b: number;
    a: number;
}
export declare function parseColor(value: string): RgbaColor | null;
export declare function colorToCss(color: RgbaColor): string;
export declare function withAlpha(value: string, alpha: number): string;
/** `amount` of the way from `left` to `right`, in OKLab; alpha moves linearly. */
export declare function mix(left: string, right: string, amount: number): string;
/** WCAG 2 contrast ratio, 1 to 21. Unreadable input answers 1. */
export declare function contrastRatio(left: string, right: string): number;
/** Of `a` and `b`, the one that reads better on `surface`; `a` on a tie. */
export declare function readable(surface: string, a: string, b: string): string;
export declare function lighten(value: string, amount: number): string;
export interface HsvColor {
    /** 0–360 */
    h: number;
    /** 0–1 */
    s: number;
    /** 0–1 */
    v: number;
}
/** Any colour `parseColor` reads, as HSV; black when it does not parse. */
export declare function toHsv(value: string): HsvColor;
export declare function hsvToHex({ h, s, v }: HsvColor): string;
//# sourceMappingURL=color.d.ts.map