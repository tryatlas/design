import * as React from "react";
/**
 * The house select, built on `@base-ui/react/select` and ported from the
 * Standards select.
 *
 * It replaces raw `<select>`, which renders as each OS's own popup — the
 * reason a settings row looked different on macOS, Windows and Linux. A select
 * IS a menu of one choice, so the popup is the dropdown-menu surface
 * (`rounded-lg`, `shadow-md`, the `z-popover` layer) and its items share the
 * dropdown item's vocabulary, with the `pl-7` check gutter so labels line up
 * whether or not an item is the selected one.
 *
 * Two trigger looks. `bordered` is a form field. `ghost` sits inside a
 * toolbar or a settings row, where a box around it would be one rectangle
 * too many.
 *
 * Options are data, not children: every call site in the app maps an array to
 * items anyway, and taking the array lets the trigger show the selected
 * option's label (Base UI's `Value` otherwise renders the raw value string).
 *
 * It is a form field like any other: `id` and the `aria-*` field props land
 * on the trigger, so `<Label htmlFor>` names it, and `name` / `required` go to
 * the hidden input Base UI submits with a form. `value={null}` is "nothing
 * chosen yet", which is when the placeholder shows; `empty` is what the popup
 * says when there are no options at all.
 */
export interface SelectOption<T extends string> {
    value: T;
    label: string;
    /** A caption under the label, inside the popup only. */
    description?: string;
    icon?: React.ReactNode;
}
export interface SelectProps<T extends string> {
    /** The chosen value; `null` while nothing is chosen. */
    value: T | null;
    onValueChange: (next: T) => void;
    options: readonly SelectOption<T>[];
    disabled?: boolean;
    /**
     * Shown while no option is chosen: `value` is `null`, or matches no option
     * ("Mixed", "Choose a teammate"). A chosen option's label replaces it.
     */
    placeholder?: string;
    /** Shown in the popup when `options` is empty ("Everyone is already here"). */
    empty?: React.ReactNode;
    /** The trigger's id, so a `<Label htmlFor>` names it. */
    id?: string;
    /** Submitted with a form, through Base UI's hidden input. */
    name?: string;
    required?: boolean;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: React.AriaAttributes["aria-invalid"];
    size?: "sm" | "md";
    variant?: "bordered" | "ghost";
    "aria-label"?: string;
    /** Applied to the trigger. */
    className?: string;
    /**
     * Draw the selected item's check, and the gutter that holds it (default).
     * `false` for a picker whose choice is acted on and cleared — "invite this
     * person" — where nothing stays selected and the gutter is only a gap.
     */
    indicator?: boolean;
    /** `pill` rounds the trigger's ends — a picker sitting beside round
     *  controls (the sidebar's search row, a glass `+`). */
    shape?: "default" | "pill";
    /** A glyph before the value, inside the trigger. */
    leading?: React.ReactNode;
}
export declare function Select<T extends string>({ value, onValueChange, options, disabled, placeholder, empty, id, name, required, size, variant, className, indicator, shape, leading, ...props }: SelectProps<T>): React.JSX.Element;
//# sourceMappingURL=select.d.ts.map