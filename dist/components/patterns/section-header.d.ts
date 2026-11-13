import type { LucideIcon } from "lucide-react";
/**
 * The small-caps label above a group of rows or cards.
 *
 * `eyebrow` rather than a heading: this labels a GROUP, and uppercase with
 * tracking is the one place this system allows it. A heading here would
 * compete with the page title.
 *
 * `title` takes any node (a count, a badge after the words); `icon` puts a
 * glyph before it, in the eyebrow's ink: a Lucide component at `sm`, or an
 * element drawn as given (an agent's mark).
 */
declare function SectionHeader({ className, title, icon, description, action, ...props }: Omit<React.ComponentProps<"div">, "title"> & {
    title: React.ReactNode;
    icon?: LucideIcon | React.ReactElement;
    description?: React.ReactNode;
    action?: React.ReactNode;
}): import("react").JSX.Element;
/**
 * The title block at the top of a page: name, what it is, and at most one
 * primary action.
 *
 * One page title everywhere, desktop's settings title: `text-xl` at 500,
 * whose step carries its own leading and -0.02em tracking (no
 * `tracking-tight` on top). The description is a `caption` that wraps: a
 * lede cut off at one line hides the page's point. No bottom padding; the
 * page's own `gap` spaces it from what follows. A title outside this header
 * is the `page-title` utility.
 */
declare function PageHeader({ className, title, description, action, ...props }: React.ComponentProps<"div"> & {
    title: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
}): import("react").JSX.Element;
export { PageHeader, SectionHeader };
//# sourceMappingURL=section-header.d.ts.map