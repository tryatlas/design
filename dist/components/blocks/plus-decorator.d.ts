/**
 * A corner cross-hair.
 *
 * Eight lines and no dependencies, and it is what makes a bordered panel
 * read as a technical drawing rather than a card. Place one at each corner
 * of a container; the `corner` prop nudges it onto the border by half a
 * pixel so the crossing sits exactly on the line.
 */
declare function PlusDecorator({ corner, className, }: {
    corner?: "tl" | "tr" | "bl" | "br";
    className?: string;
}): import("react").JSX.Element;
/** All four corners at once. The parent must be `relative`. */
declare function PlusCorners({ className }: {
    className?: string;
}): import("react").JSX.Element;
export { PlusCorners, PlusDecorator };
//# sourceMappingURL=plus-decorator.d.ts.map