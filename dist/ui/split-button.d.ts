import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode, Ref } from "react";
/**
 * A primary action with its alternatives on an attached ⌄: desktop's
 * source-control ship button ("Commit" beside a menu of "Commit & push",
 * "Commit, push & PR"). Built from `Button` and `DropdownMenu`; the menu's
 * rows are yours (`DropdownMenuItem`s).
 *
 * The two halves sit in a `role="group"` named by `label`, 2px apart. The
 * menu opens against the whole group, aligned to its end, so it lines up with
 * the button rather than the chevron. The root takes `ref`, so a popover the
 * menu opens (desktop's "Edit pull request…") can anchor to the same place.
 *
 * `busy` swaps the icon for a spinner and `busyLabel` for the label, and
 * holds both halves: nothing starts while one run is going. `disabledReason`
 * turns the primary off and says why: in its tooltip for a pointer, and as
 * its description for a keyboard and a screen reader (it stays focusable
 * while off, `aria-disabled`). The menu stays open to the other choices.
 */
interface SplitButtonProps extends Omit<ComponentProps<"div">, "onClick" | "children" | "ref"> {
    ref?: Ref<HTMLDivElement>;
    /** The group's accessible name: "Commit actions". */
    label: string;
    /** The primary action's label. */
    children: ReactNode;
    icon?: LucideIcon;
    onClick?: () => void;
    /** Why the primary cannot run; set, it is disabled and this is its tooltip. */
    disabledReason?: string | null;
    /** A run is going: a spinner on the primary, and both halves held. */
    busy?: boolean;
    /** What the primary says while busy ("Pushing…"). Defaults to its label. */
    busyLabel?: ReactNode;
    /** The ⌄'s accessible name: "More commit actions". */
    menuLabel: string;
    /** The menu's rows. */
    menu: ReactNode;
    /** The primary's look; the ⌄ is always `outline`. */
    variant?: "default" | "secondary" | "outline";
    size?: "xs" | "sm" | "md";
    /** Classes for the menu's popup, such as its width. */
    menuClassName?: string;
}
declare function SplitButton({ ref, label, children, icon, onClick, disabledReason, busy, busyLabel, menuLabel, menu, variant, size, menuClassName, className, ...props }: SplitButtonProps): import("react").JSX.Element;
export { SplitButton };
export type { SplitButtonProps };
//# sourceMappingURL=split-button.d.ts.map