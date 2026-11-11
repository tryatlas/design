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
 *
 * `variant="gauge"` is desktop's composer usage meter (`TickMeter`): a fill
 * against a limit, such as a context window. The scale carries the status
 * rather than the value: ticks below `warnAt` are success, the rest warning,
 * so the amber band is always visible as the place the value is heading.
 * Ticks past the value are dimmed, and a hairline marker stands at the value
 * and slides with it. It is 48 ticks unless `segments` says otherwise, 1px
 * apart. `hue` does not apply to it. Pass `warnAt={1}` or more for a meter with
 * no warning band (desktop's efficiency card).
 */
declare function SegmentMeter({ value, hue, segments, label, variant, warnAt, className, }: {
    /** 0–1. A gauge pins anything past 1 at the end. */
    value: number;
    hue?: LabelTone;
    /** Tick count: 36 for a share, 48 for a gauge. */
    segments?: number;
    /** What is measured, read out as the meter's name. A meter needs one. */
    label?: string;
    /** `share` (the default): a share of a whole. `gauge`: a fill against a limit. */
    variant?: "share" | "gauge";
    /** Gauge only: where the ticks turn from success to warning, 0–1. */
    warnAt?: number;
    className?: string;
}): import("react").JSX.Element;
export { DotMatrix, SegmentMeter };
//# sourceMappingURL=dot-matrix.d.ts.map