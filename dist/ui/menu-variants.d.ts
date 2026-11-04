import { cn } from "../lib/utils.ts";
/**
 * `DropdownMenu`'s class recipes, without `"use client"`, for a menu that
 * cannot be a Base UI `Menu`: a list that renders into an editor's own popup
 * root and must never take focus (the slash menu, a mention list), so its
 * rows are highlighted by the caller (`data-active`), not focused.
 *
 * Plain functions rather than `cva`: `cva` appends a variant's classes after
 * the base, and the highlight sits in the middle of the item's list, so a
 * `cva` recipe would reorder `DropdownMenuItem`'s class attribute.
 */
/**
 * How a row shows that it is the one Enter would pick. `focus` is the menu's
 * own (Base UI moves focus through the rows); `active` reads `data-active`,
 * for a list that leaves focus where it is and marks the row itself.
 */
type MenuHighlight = "focus" | "active";
interface MenuRecipeProps {
    /** Composed last, as `cn` composes it on the components. */
    className?: Parameters<typeof cn>[number];
}
/**
 * The popup surface, shared by `DropdownMenuContent` and its submenu.
 * `motion: false` drops the scale-in and the exit, for a surface that opens
 * on a keystroke many times a day and should appear at once.
 */
declare function menuContentVariants({ motion, className, }?: MenuRecipeProps & {
    motion?: boolean;
}): string;
/** A row. `data-inset`, `data-variant="destructive"` and `data-disabled` style it as on `DropdownMenuItem`. */
declare function menuItemVariants({ highlight, className, }?: MenuRecipeProps & {
    highlight?: MenuHighlight;
}): string;
/** A group's heading. `data-inset` lines it up with inset rows. */
declare function menuLabelVariants({ className }?: MenuRecipeProps): string;
/** The keys at a row's end. It brightens with its row, so pass the row's `highlight`. */
declare function menuShortcutVariants({ highlight, className, }?: MenuRecipeProps & {
    highlight?: MenuHighlight;
}): string;
export { menuContentVariants, menuItemVariants, menuLabelVariants, menuShortcutVariants };
export type { MenuHighlight };
//# sourceMappingURL=menu-variants.d.ts.map