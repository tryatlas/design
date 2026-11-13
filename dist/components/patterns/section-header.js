import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { isValidElement } from "react";
import { cn } from "../../lib/utils.js";
import { Icon } from "../../ui/icon.js";
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
function SectionHeader({ className, title, icon, description, action, ...props }) {
    return (_jsxs("div", { "data-slot": "section-header", className: cn("flex items-end justify-between gap-3 pb-2", className), ...props, children: [_jsxs("div", { className: "flex flex-col gap-0.5", children: [icon ? (_jsxs("span", { className: "eyebrow flex min-w-0 items-center gap-1.5", children: [_jsx("span", { "data-slot": "section-header-icon", className: "flex shrink-0", children: isValidElement(icon) ? icon : _jsx(Icon, { icon: icon, size: "sm" }) }), _jsx("span", { className: "min-w-0", children: title })] })) : (_jsx("span", { className: "eyebrow", children: title })), description && _jsx("span", { className: "caption", children: description })] }), action && _jsx("div", { className: "shrink-0 pb-0.5", children: action })] }));
}
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
function PageHeader({ className, title, description, action, ...props }) {
    return (_jsxs("div", { "data-slot": "page-header", className: cn("flex flex-wrap items-end justify-between gap-3", className), ...props, children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h1", { className: "truncate text-xl font-medium text-foreground", children: title }), description && _jsx("p", { className: "mt-1 caption", children: description })] }), action && _jsx("div", { className: "shrink-0", children: action })] }));
}
export { PageHeader, SectionHeader };
//# sourceMappingURL=section-header.js.map