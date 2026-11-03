import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
/**
 * The three-pane reading layout: list, detail, properties.
 *
 * The reason this shape works for Atlas is that a session board is
 * the same problem as an issue list — a long list of short rows where you want
 * to move through them without losing your place. The current `/timeline`
 * already puts a board beside a detail pane; this names the layout so
 * `/inbox`, `/chat` and `/timeline` stop inventing it separately.
 *
 * The list pane is a fixed 20rem (`w-80`). Fluid list panes re-wrap every row title on
 * every window resize, which makes scanning feel unstable.
 */
function ListDetail({ className, ...props }) {
    return (_jsx("div", { "data-slot": "list-detail", className: cn("flex min-h-0 flex-1", className), ...props }));
}
/**
 * `narrow` is the Inbox shape: a 320px index beside a read pane, where each
 * row is an avatar, a title and a line of preview.
 *
 * `wide` is the Issues shape: the list IS the screen, and the detail is the
 * narrower companion. A dense row carries priority, id, status, title,
 * labels, a diff and an assignee — roughly 700px of content — so putting it in
 * a 320px column truncates the title to nothing while the metadata keeps its
 * space. Which is exactly what happened here the first time.
 */
function ListPane({ className, width = "narrow", ...props }) {
    return (_jsx("div", { "data-slot": "list-pane", "data-panel": "", "data-width": width, className: cn("flex flex-col border-r border-border-subtle", width === "narrow" && "w-80 shrink-0", width === "wide" && "min-w-0 flex-1", 
        // Below lg the detail pane takes the whole width and the list is a
        // separate screen; the mock shows the list.
        "max-lg:w-full max-lg:flex-1 max-lg:border-r-0", className), ...props }));
}
/** `companion` pairs with a wide list: fixed, and narrower than the list. */
function DetailPane({ className, width = "fill", ...props }) {
    return (_jsx("div", { "data-slot": "detail-pane", "data-panel": "", "data-width": width, className: cn("flex flex-col max-lg:hidden", width === "fill" && "min-w-0 flex-1", width === "companion" && "w-95 shrink-0 border-l border-border-subtle", className), ...props }));
}
/** The right rail of attributes on a detail view. Hidden under xl. */
function PropertiesPane({ className, ...props }) {
    return (_jsx("aside", { "data-slot": "properties-pane", "data-panel": "", className: cn("flex w-65 shrink-0 flex-col gap-4 overflow-y-auto border-l border-border-subtle p-3 max-xl:hidden", className), ...props }));
}
/** One attribute: dim label on the left, value on the right. */
function PropertyRow({ className, label, children, ...props }) {
    return (_jsxs("div", { "data-slot": "property-row", className: cn("flex min-h-(--control-sm) items-center gap-2", className), ...props, children: [_jsx("span", { className: "w-20 shrink-0 caption", children: label }), _jsx("div", { className: "flex min-w-0 flex-1 items-center gap-1.5 text-xs", children: children })] }));
}
export { DetailPane, ListDetail, ListPane, PropertiesPane, PropertyRow };
//# sourceMappingURL=list-detail.js.map