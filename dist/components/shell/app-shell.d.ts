import type { CommandAction } from "./command-menu.tsx";
declare function ThemeToggle({ appearance, onToggle, }: {
    appearance: "dark" | "light";
    onToggle: () => void;
}): import("react").JSX.Element;
/**
 * The dock: a panel beside the page that a screen fills by rendering
 * `<Dock>` anywhere in its tree, which portals into the shell's slot. A
 * portal rather than a prop because the shell lives in the layout route and
 * the dock's contents are the screen's own state.
 *
 * Two sizes, owned by the shell so they persist across screens:
 *
 *   compact  the reading width (`DOCK_WIDTH`) beside the page
 *   half     half the work area — the page and the dock share it
 *
 * Widths are measured, not percentages: the work area is the space right of
 * the sidebar, which changes as the rail collapses, so a ResizeObserver
 * gives the half width in pixels.
 */
export type DockMode = "compact" | "half";
type DockContextValue = {
    slot: HTMLElement | null;
    mode: DockMode;
    setMode: (mode: DockMode) => void;
    /** Width of the work area (page + dock), in px. */
    work: number;
};
declare const useDock: () => DockContextValue;
/**
 * Borrow room from the dock for something that will not fit in it — a panel
 * that grows out of a button, say. `expand()` widens a compact dock to half
 * and returns how long to wait before measuring the wider dock (0 when there
 * was nothing to do, or no dock at all: `work` is only measured inside the
 * app shell). The resize is one layout step, not an animation, so that is
 * one frame for the render that applies it. `restore()` puts it back — but only if it was this hook that
 * widened it, and only if nobody has resized it since.
 */
declare function useDockRoom(): {
    expand: () => 0 | 16;
    restore: () => void;
};
declare function Dock({ children }: {
    children?: React.ReactNode;
}): import("react").ReactPortal | null;
/** The two dock sizes as one segmented control, for a dock's header. */
declare function DockSizeToggle({ className }: {
    className?: string;
}): import("react").JSX.Element;
type ShellSlot = React.ReactNode | ((state: {
    collapsed: boolean;
}) => React.ReactNode);
/**
 * The frame, filled by the app: what sits in the rail is the caller's, so the
 * shell holds no data and no routes. `header` is the workspace row (an
 * `OrgSwitcher`), `nav` the rail's `SidebarGroup`s, `footer` the rail's
 * bottom tools (`ProfileMenu`, `ThemeToggle`, `UiScaleControl`, `InfoMenu`),
 * and `actions` what ⌘K offers. `header` and `footer` may be functions of the
 * rail's collapsed state.
 */
declare function AppShell({ title, header, nav, footer, actions, children, }: {
    /** Shown beside the menu button when the rail is a drawer (below lg). */
    title: string;
    header: ShellSlot;
    nav: React.ReactNode;
    footer: ShellSlot;
    actions: Array<CommandAction>;
    children: React.ReactNode;
}): import("react").JSX.Element;
export { AppShell, Dock, DockSizeToggle, ThemeToggle, useDock, useDockRoom };
//# sourceMappingURL=app-shell.d.ts.map