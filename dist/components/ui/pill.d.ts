import { useRender } from "@base-ui/react/use-render";
/**
 * A rounded-full chip: a filter token, a breadcrumb crumb, an agent tag.
 *
 * Distinct from <Badge> by shape and by job. A badge states a fact about a row
 * ("Admin", "Live"). A pill is usually interactive or removable, and its full
 * radius is what says so.
 */
declare function Pill({ className, render, ...props }: useRender.ComponentProps<"span">): import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>>;
/** The 6px status dot that leads a pill, a row, or a legend entry. */
declare function StatusDot({ className, tone, ...props }: React.ComponentProps<"span"> & {
    tone?: "neutral" | "success" | "warning" | "error" | "info";
}): import("react").JSX.Element;
export { Pill, StatusDot };
//# sourceMappingURL=pill.d.ts.map