import type { LabelTone } from "../../lib/types.ts";
/**
 * A trend drawn as a dot matrix — the headline figures' sparkline.
 *
 * One column per day, each a stack of seven dots rising from a baseline row
 * that is always lit, so a quiet day still reads as a day rather than as a gap
 * in the chart. Seven rows rather than five because the resolution is what the
 * shape is made of: at five, a day at a third of the peak and one at half drew
 * the same column.
 *
 * `null` in the series means "no value today" (a rate with no denominator, not
 * a rate of zero) and draws as an empty column — the baseline dot dims for it,
 * so an undefined day is visibly different from a zero one.
 */
declare function DotMatrix({ values, rows, className, 
/** Cap the columns drawn, keeping the most recent — a year does not fit. */
maxColumns, }: {
    values: ReadonlyArray<number | null>;
    rows?: number;
    className?: string;
    maxColumns?: number;
}): import("react").JSX.Element | null;
/**
 * A share of a whole as a row of ticks. Every tick is present; the share is
 * how many are lit, and a thin cursor stands where the value lands. Reads at
 * a glance down a row of four, where four bars of different lengths would
 * make the eye compare end-points.
 *
 * With a `hue`, lit ticks are the hue and unlit ones the same hue faint, so
 * the track still says whose meter it is when almost nothing is lit.
 * Without one it is foreground ink.
 */
declare function SegmentMeter({ value, hue, segments, className, }: {
    /** 0–1. */
    value: number;
    hue?: LabelTone;
    segments?: number;
    className?: string;
}): import("react").JSX.Element;
export { DotMatrix, SegmentMeter };
//# sourceMappingURL=dot-matrix.d.ts.map