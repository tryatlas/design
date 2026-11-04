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
declare function ListDetail({ className, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
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
declare function ListPane({ className, width, ...props }: React.ComponentProps<"div"> & {
    width?: "narrow" | "wide";
}): import("react").JSX.Element;
/** `companion` pairs with a wide list: fixed, and narrower than the list. */
declare function DetailPane({ className, width, ...props }: React.ComponentProps<"div"> & {
    width?: "fill" | "companion";
}): import("react").JSX.Element;
/** The right rail of attributes on a detail view. Hidden under xl. */
declare function PropertiesPane({ className, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
/** One attribute: dim label on the left, value on the right. */
declare function PropertyRow({ className, label, children, ...props }: React.ComponentProps<"div"> & {
    label: React.ReactNode;
}): import("react").JSX.Element;
export { DetailPane, ListDetail, ListPane, PropertiesPane, PropertyRow };
//# sourceMappingURL=list-detail.d.ts.map