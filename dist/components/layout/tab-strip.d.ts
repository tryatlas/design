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
declare function TabStrip({ items, activeId, onSelect, onClose, focused, leading, trailing, renderTab, className, "aria-label": ariaLabel, }: {
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
    className?: string;
    "aria-label": string;
}): import("react").JSX.Element;
export { TabStrip };
//# sourceMappingURL=tab-strip.d.ts.map