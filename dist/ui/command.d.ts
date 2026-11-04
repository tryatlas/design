import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
/**
 * The command shell: the large search dialog that ⌘K, ⌘P and the new-tab
 * palette all open (decision 32's shape, shadcn's base-style `command`).
 *
 * A centred dialog with no Positioner, the search field on top, a list, and
 * a footer of key hints. It has no open or close animation on purpose — it
 * is opened hundreds of times a day, and a scale-in reads as latency.
 *
 * The keyboard model belongs to the caller: the field keeps focus, the
 * caller tracks the highlighted row and passes `active` to `CommandItem`, so
 * a mouse resting over the list never fights the keys.
 *
 * Scales: `rounded-xl` (the dialog step), `shadow-lg`, `z-overlay` for the
 * scrim and `z-modal` for the dialog.
 */
declare function CommandDialog(props: DialogPrimitive.Root.Props): React.JSX.Element;
declare function CommandDialogPopup({ className, children, title, ...props }: DialogPrimitive.Popup.Props & {
    /** The dialog's accessible name, read out on open. */
    title: string;
}): React.JSX.Element;
/** The search field. `startAddon` replaces the magnifier (a back arrow in a
 *  submenu); `endAddon` sits at its right end (a step's "Create ⌘ Enter").
 *  The input is a combobox over the list it controls. */
declare function CommandInput({ className, startAddon, endAddon, ...props }: React.ComponentProps<"input"> & {
    startAddon?: React.ReactNode;
    endAddon?: React.ReactNode;
}): React.JSX.Element;
/** The scroll area under the field. */
declare function CommandPanel({ className, size, ...props }: React.ComponentProps<"div"> & {
    /** `tall` is ⌘P's list: the same width, more rows. */
    size?: "default" | "tall";
}): React.JSX.Element;
/** A group's small muted header ("Actions", "Recent Sessions", a project). */
declare function CommandGroupLabel({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
/** One row. `active` is the keyboard highlight, which the caller owns. */
declare function CommandItem({ className, active, disabled, ...props }: React.ComponentProps<"div"> & {
    active?: boolean;
    disabled?: boolean;
}): React.JSX.Element;
/** The leading glyph, held to the first line of a two-line row. */
declare function CommandItemIcon({ className, ...props }: React.ComponentProps<"span">): React.JSX.Element;
/** A chord as plain glyphs on the right of a row ("⌘⇧N") — quieter than
 *  keycaps, which belong to the footer. */
declare function CommandShortcut({ className, ...props }: React.ComponentProps<"kbd">): React.JSX.Element;
/** The `>` on a row that drills into a submenu. */
declare function CommandSubmenuChevron({ className }: {
    className?: string;
}): React.JSX.Element;
/** The key legend along the bottom. */
declare function CommandFooter({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
/** One "keys + label" pair in the footer. */
declare function CommandFooterHint({ className, ...props }: React.ComponentProps<"span">): React.JSX.Element;
/** The centred line a list shows when it has no rows. */
declare function CommandEmpty({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
export { CommandDialog, CommandDialogPopup, CommandEmpty, CommandFooter, CommandFooterHint, CommandGroupLabel, CommandInput, CommandItem, CommandItemIcon, CommandPanel, CommandShortcut, CommandSubmenuChevron, };
//# sourceMappingURL=command.d.ts.map