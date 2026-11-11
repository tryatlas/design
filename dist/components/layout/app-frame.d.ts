import type { ReactNode } from "react";
/**
 * The application frame: curved panels on a canvas, as the Atlas desktop app
 * draws it.
 *
 *   ┌ canvas ─────────────────────────────────────────────────────┐
 *   │ ┌─ sidebar ─┐ ┌──────────────────────────────┐ ┌─ dock ───┐ │
 *   │ │           │ │            page              │ │ (raised) │ │
 *   │ └───────────┘ └──────────────────────────────┘ └──────────┘ │
 *   └─────────────────────────────────────────────────────────────┘
 *
 * The canvas is `bg-sidebar`, a step darker than the page; the page is a
 * `rounded-xl` sheet on `background` with an opaque border, set into the
 * frame, which is where the depth comes from. The dock is the one panel on
 * `card`, a step up, so a selected record beside the page is visibly the
 * thing in focus.
 *
 * `h-dvh overflow-hidden`: the PAGE never scrolls. Scroll lives inside each
 * panel. The frame tracks the dynamic viewport, so a phone browser's
 * collapsing toolbar never leaves a gap under a composer pinned to the
 * bottom (`svh` is the height with the toolbar shown). Where there is no
 * such toolbar (a desktop webview or browser window) the two are equal.
 *
 * The frame is slots and layout only. It reads no storage, listens to no
 * keys and knows no routes: the sidebar, the bar shown below `lg` and any
 * overlay (a scrim, a drawer, ⌘K) are the caller's, and so is the dock's
 * size. The one thing it keeps is a borrow (`useSideDockRoom`), which is
 * deliberately not a choice anyone should remember.
 */
/**
 * The dock's two sizes:
 *
 *   compact  the reading width beside the page
 *   half     half the work area: the page and the dock share it
 */
export type SideDockMode = "compact" | "half";
/**
 * Where the frame's 8px gutter runs.
 *
 *   all    every side (the default): the panels float on the canvas.
 *   sides  left, right and bottom only. The panels run to the window's top
 *          edge, square and borderless there, so a titlebar row inside them
 *          sits at the window's top, where it was before the frame. On macOS
 *          with an overlay title bar the system draws the traffic lights at a
 *          fixed point from that edge, and an 8px top gutter would push the
 *          row they are centred in down by 8px.
 */
export type AppFrameInset = "all" | "sides";
/** The dock's drawn size and the setter its size control uses. */
declare function useSideDock(): {
    mode: SideDockMode;
    setMode: (mode: SideDockMode) => void;
};
/**
 * Borrow room from the dock for something that will not fit in it: a panel
 * that grows out of a button, a draft being written. `expand()` widens a
 * compact dock to half and returns how long to wait before measuring the
 * wider dock (0 when there was nothing to do, or no frame). The resize is one
 * layout step, not an animation, so that is one frame. `restore()` gives the
 * room back, unmounting does too, and a pick from the size control ends every
 * borrow: the room is the person's then.
 *
 * A borrow never reaches `onDockModeChange`, so it can never become the size
 * the app remembers and the dock next opens at.
 */
declare function useSideDockRoom(): {
    expand: () => number;
    restore: () => void;
};
/**
 * The dock: a panel beside the page that a screen fills by rendering
 * `<SideDock>` anywhere inside the frame, which portals into the frame's
 * slot. A portal rather than a prop because the frame lives in the app's
 * layout and the dock's contents are the screen's own state. Children make it
 * open; none make it close.
 */
declare function SideDock({ children }: {
    children?: ReactNode;
}): import("react").ReactPortal | null;
/** The two dock sizes as one segmented control, for a dock's header. */
declare function SideDockSizeToggle({ className }: {
    className?: string;
}): import("react").JSX.Element;
declare function AppFrame({ sidebar, topBar, overlay, dockMode, onDockModeChange, inset, className, children, }: {
    /** The rail: a `Sidebar`, with `lg:mr-2` for the gap to the page. */
    sidebar: ReactNode;
    /** A bar above the panels, for below `lg` where the rail is a drawer and
     *  something has to open it. Hide it at `lg` yourself (`lg:hidden`). */
    topBar?: ReactNode;
    /** Anything over the frame: a drawer's scrim, ⌘K. */
    overlay?: ReactNode;
    /** The dock size the person chose. The app keeps it (and remembers it, if
     *  it wants); the frame only reports a new pick. */
    dockMode: SideDockMode;
    onDockModeChange: (mode: SideDockMode) => void;
    /**
     * Where the 8px gutter runs: `all` sides (the default), or `sides` only, so
     * the panels meet the window's top edge and a titlebar row inside them
     * stays where the macOS traffic lights are drawn. A `sidebar` in the frame
     * meets the top edge too; square its top corners to match the page.
     */
    inset?: AppFrameInset;
    className?: string;
    /** The page. */
    children: ReactNode;
}): import("react").JSX.Element;
export { AppFrame, SideDock, SideDockSizeToggle, useSideDock, useSideDockRoom };
//# sourceMappingURL=app-frame.d.ts.map