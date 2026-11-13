import type { LucideIcon } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
/**
 * An inline notice: the strip Cursor puts above a settings page ("You have
 * limited free Bugbot reviews. Upgrade for unlimited.").
 *
 * This is the one place a tinted fill is correct, because the whole block IS
 * the status. Everywhere else, status colour belongs on a badge or a dot, not
 * on a surface.
 *
 * A callout that a user can dismiss and never see again should not be a
 * callout — that is a toast.
 */
declare const calloutVariants: (props?: ({
    variant?: "default" | "tucked" | null | undefined;
    tone?: "error" | "info" | "neutral" | "success" | "warning" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Callout({ className, variant, tone, icon, children, action, animate, ...props }: React.ComponentProps<"div"> & VariantProps<typeof calloutVariants> & {
    icon?: LucideIcon | false;
    action?: React.ReactNode;
    /**
     * Rise into place on mount: 6px up and a fade over 200ms (desktop's
     * `atlas-pill-in`). For a rare notice that appears on its own, like the
     * "woke after 21m" pill; leave it off for one that is there when the view
     * opens. Reduced motion keeps only the fade. There is no matching exit:
     * whatever replaces the notice says so itself.
     */
    animate?: boolean;
}): import("react").JSX.Element;
export { Callout, calloutVariants };
//# sourceMappingURL=callout.d.ts.map