import * as React from "react";
/**
 * A segmented control: one choice among a few, all visible at once (theme
 * mode, a density). Ported from the Standards `SegmentedPills`.
 *
 * The options sit in ONE track with a hairline edge, and the active one is a
 * thumb that slides inside it (a shared `layoutId`, `SPRING_INDICATOR`) — so
 * the control reads as one object with parts rather than loose words, and the
 * selection moves instead of cross-fading. The thumb is the selected-element
 * fill, never the primary: this is a choice, not the loudest action on screen.
 *
 * Radio-group semantics: one tab stop (the selected option), arrow keys move
 * the selection, Home/End jump to the ends.
 */
interface SegmentedOptionBase<T extends string> {
    value: T;
    icon?: React.ReactNode;
    /** A small tally after the label ("Unread 3"), on a quiet chip that
     *  lifts with the option when it is chosen. */
    count?: number | string;
}
/**
 * One option. `label` is what it shows: text, or any node (an icon beside a
 * word, a styled fragment), whose text content is its accessible name unless
 * `ariaLabel` is given. `ariaLabel` is the name (and an `iconOnly` option's
 * tooltip) when the label is not plain text or would read badly aloud.
 *
 * `iconOnly` draws only the icon; the label stays the option's accessible
 * name and its tooltip. For a toolbar's icon pair (a diff's layout). An
 * icon-only option shows no text, so the type requires a name: a string
 * `label`, or an `ariaLabel`.
 */
export type SegmentedOption<T extends string> = SegmentedOptionBase<T> & ({
    iconOnly?: false;
    label: React.ReactNode;
    ariaLabel?: string;
} | {
    iconOnly: true;
    label: string;
    ariaLabel?: string;
} | {
    iconOnly: true;
    label: React.ReactNode;
    ariaLabel: string;
});
export interface SegmentedProps<T extends string> {
    value: T;
    onValueChange: (next: T) => void;
    options: readonly SegmentedOption<T>[];
    disabled?: boolean;
    size?: "sm" | "md";
    "aria-label": string;
    className?: string;
}
export declare function Segmented<T extends string>({ value, onValueChange, options, disabled, size, className, ...props }: SegmentedProps<T>): React.JSX.Element;
export {};
//# sourceMappingURL=segmented.d.ts.map