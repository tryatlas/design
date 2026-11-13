import { useRender } from "@base-ui/react/use-render";
type PillSize = "xs" | "sm";
type PillSurface = "default" | "raised";
export interface PillProps extends useRender.ComponentProps<"span"> {
    /** `xs` (20px, `text-2xs`) is the default. `sm` (24px, `text-xs`) is a pill
     *  that stands on its own: a queued prompt, a status over a panel. */
    size?: PillSize;
    /** The pill ends in its own button (remove, dismiss): the end padding
     *  tightens and the gap closes up. */
    trailingAction?: boolean;
    /** `raised` floats over content (a status over a dimmed panel): no outline,
     *  `shadow-sm` instead, so it reads as a layer above rather than a chip on
     *  the surface. */
    surface?: PillSurface;
}
/**
 * A rounded-full chip: a filter token, a breadcrumb crumb, an agent tag.
 *
 * Distinct from <Badge> by shape and by job. A badge states a fact about a row
 * ("Admin", "Live"). A pill is usually interactive or removable, and its full
 * radius is what says so.
 */
declare function Pill({ className, render, size, trailingAction, surface, ...props }: PillProps): import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>>;
export { Pill };
export type { PillSize, PillSurface };
//# sourceMappingURL=pill.d.ts.map