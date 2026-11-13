import type { ReactElement, ReactNode } from "react";
/**
 * A row of document tabs, as desktop's pane headers draw them: small
 * rounded chips rather than full-height cells between rules, so the strip
 * reads as things you can pick rather than as more chrome.
 *
 * The strip holds no state. Which tab is open, the order, what closing does
 * (ask about unsaved work, stop a running session) are the app's; the strip
 * reports `onSelect` and `onClose` and draws what it is given.
 *
 * - **Closing lives where the icon is.** On hover, or keyboard focus, a
 *   closable tab's icon becomes its ×, so the target is always in the same
 *   place and never pushes the title around. Middle-click and Delete close
 *   too. A pinned tab is its icon alone and never closes from the strip.
 * - **Keyboard.** One tab stop: the active tab (the first when none is).
 *   Left and Right move focus and wrap, Home and End jump, Enter or Space
 *   opens. Moving focus does not open: activation is manual because opening
 *   a tab can mount a heavy panel, and arrowing past three of them should
 *   not mount all three.
 * - **Overflow.** Only the tabs scroll; `leading` and `trailing` (a `+`,
 *   the pane's controls) stay put. An edge with more tabs past it fades, the
 *   scroll arrows appear, a vertical wheel scrolls sideways, and the active
 *   tab is scrolled clear of the fades whenever it changes.
 *
 * Roving focus, middle-click close, Delete-to-close and the "Close {title}"
 * name are each on by default and each has a prop to turn it off
 * (`rovingFocus`, `closeOnMiddleClick`, `closeOnDelete`, `closeLabel`), for
 * an app keeping its earlier behaviour. Reordering is the host's: `tabProps`
 * puts its drag ref, handlers and transform on each tab.
 *
 * No motion: a tab is picked tens of times an hour, often from the keyboard,
 * so the selection changes colour (`duration-fast`) and nothing moves.
 */
export interface TabStripItem {
    id: string;
    title: string;
    /** A 14px glyph: `<Icon icon={…} size="md" />`, or a file icon. */
    icon?: ReactNode;
    /** Shows the × and allows middle-click and Delete. Needs `onClose`. */
    closable?: boolean;
    /** Unsaved: the title goes italic, and the tab carries `data-dirty`. */
    dirty?: boolean;
    /** Working (a running session, a loading page): the icon is a spinner. */
    busy?: boolean;
    /** Icon only, named by a tooltip, and never closed from the strip. */
    pinned?: boolean;
}
/**
 * What a host puts on one tab element, for a behaviour the strip does not
 * own: drag-to-reorder above all. dnd-kit's `useSortable`, for instance,
 * hands back `setNodeRef`, `listeners`, `transform` and `isDragging`; pass
 * them as `ref`, the spread listeners, `style` and `dragging`. The host's
 * `onClick`, `onMouseDown` and `onAuxClick` run before the tab's own (a click
 * still selects); other handlers are the host's alone. `className` is added to
 * the tab's. The tab's role, name, selection and tab stop are the strip's and
 * cannot be replaced, so a drag library's `attributes` may be spread safely.
 */
export type TabStripTabProps = Omit<React.ComponentProps<"div">, "children" | "onSelect"> & {
    ref?: React.Ref<HTMLDivElement>;
    /** Being dragged: the tab rides over its neighbours, lit, as they make room. */
    dragging?: boolean;
};
declare function TabStrip({ items, activeId, onSelect, onClose, focused, leading, trailing, renderTab, tabProps, rovingFocus, closeOnMiddleClick, closeOnDelete, closeLabel, className, "aria-label": ariaLabel, }: {
    items: readonly TabStripItem[];
    activeId: string | null;
    onSelect: (id: string) => void;
    onClose?: (id: string) => void;
    /** Whether the strip's pane has focus. Only then is the active tab fully
     *  lit; in a pane beside the focused one it is a step quieter. */
    focused?: boolean;
    /** Before the tabs, outside the scroll. */
    leading?: ReactNode;
    /** After the tabs, outside the scroll: where the `+` goes. */
    trailing?: ReactNode;
    /**
     * Wraps each tab, for what the strip does not do itself: a context menu
     * (`<ContextMenuTrigger render={tab} />`) or a drag handle. Keep the tab
     * element in the tree; keyboard and scrolling find tabs by their role.
     */
    renderTab?: (item: TabStripItem, tab: ReactElement) => ReactNode;
    /**
     * Props for each tab element, for host-driven drag-to-reorder: a ref, the
     * drag listeners, the drag transform and `dragging`. See `TabStripTabProps`.
     * The order stays the app's: reorder `items` when the drag ends.
     */
    tabProps?: (item: TabStripItem) => TabStripTabProps;
    /**
     * The behaviours below are on by default. Each can be turned off on its
     * own, for an app keeping the behaviour it had before the strip (D24).
     *
     * `rovingFocus`: the strip is one tab stop, and the arrow keys, Home and
     * End move between tabs. Off, every tab is its own tab stop and the arrow
     * keys do nothing; Enter and Space still open.
     */
    rovingFocus?: boolean;
    /** Middle-click closes a closable tab. */
    closeOnMiddleClick?: boolean;
    /** Delete closes the focused tab, when it is closable. */
    closeOnDelete?: boolean;
    /** The × button's name. Default `Close {title}`; desktop's was "Close tab". */
    closeLabel?: (item: TabStripItem) => string;
    className?: string;
    "aria-label": string;
}): import("react").JSX.Element;
export { TabStrip };
//# sourceMappingURL=tab-strip.d.ts.map