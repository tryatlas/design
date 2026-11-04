import * as React from "react";
import { type VariantProps } from "class-variance-authority";
/**
 * A status pill (decision 32).
 *
 * shadcn's base-style `Badge` in shape — a `<span>`, a `data-slot`, an exported
 * `badgeVariants` for composing onto a link — with the four Atlas status roles
 * added, because that is what the badges in this app actually say. Colour comes
 * from the status tokens the theme resolves, never from a literal.
 *
 * A badge is not a control, so it is not on the control-height scale: it sizes
 * itself to its text. Reach for `Kbd` instead when the content is a keystroke.
 */
declare const badgeVariants: (props?: ({
    variant?: "default" | "destructive" | "info" | "outline" | "secondary" | "severe" | "success" | "warning" | null | undefined;
    size?: "md" | "sm" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface BadgeProps extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {
}
declare function Badge({ className, variant, size, ...props }: BadgeProps): React.JSX.Element;
export { Badge, badgeVariants };
//# sourceMappingURL=badge.d.ts.map