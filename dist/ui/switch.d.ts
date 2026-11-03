/**
 * The house on/off control, built on `@base-ui/react/switch` and ported from
 * the Standards switch.
 *
 * A settings row is a label and a description with one of these hard-right.
 * Off is the input fill, on is the primary ink — no green, because "on" is a
 * state, not a success. The `after:` inset widens the hit target past the
 * 16px track without changing the painted size.
 *
 * `mixed` is the indeterminate state a setting has when it differs across a
 * selection (several projects, say): the thumb sits centred, the track takes
 * the input fill, and assistive tech hears `aria-checked="mixed"`. Toggling a
 * mixed switch turns it on, so one click makes every selected target agree.
 */
export interface SwitchProps {
    checked: boolean;
    onCheckedChange: (next: boolean) => void;
    disabled?: boolean;
    /** Indeterminate: settings that differ across a selection. Thumb centred, aria-checked="mixed". */
    mixed?: boolean;
    size?: "sm" | "md";
    "aria-label"?: string;
    id?: string;
    className?: string;
}
export declare function Switch({ checked, onCheckedChange, disabled, mixed, size, className, ...props }: SwitchProps): import("react").JSX.Element;
//# sourceMappingURL=switch.d.ts.map