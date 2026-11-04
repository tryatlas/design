"use client";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "../../lib/utils.js";
/**
 * A rounded-full chip: a filter token, a breadcrumb crumb, an agent tag.
 *
 * Distinct from <Badge> by shape and by job. A badge states a fact about a row
 * ("Admin", "Live"). A pill is usually interactive or removable, and its full
 * radius is what says so.
 */
function Pill({ className, render, ...props }) {
    return useRender({
        defaultTagName: "span",
        props: mergeProps({
            className: cn("inline-flex h-control-xs w-fit shrink-0 items-center gap-1.5", "rounded-full border border-border bg-card px-2 text-2xs font-medium", "whitespace-nowrap text-secondary-foreground select-none", "[&>svg]:pointer-events-none [&>svg]:size-3", className),
        }, props),
        render,
        state: { slot: "pill" },
    });
}
export { Pill };
//# sourceMappingURL=pill.js.map