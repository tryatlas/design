import type { SideDockMode } from "../layout/app-frame.tsx";
import type { CommandAction } from "./command-menu.tsx";
declare function ThemeToggle({ appearance, onToggle, }: {
    appearance: "dark" | "light";
    onToggle: () => void;
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
 *
 * It is `AppFrame` filled the way the Atlas apps fill it: a collapsible rail
 * with the workspace switcher, search and the navigation; ⌘K; and below `lg`,
 * a drawer opened from a top bar. The rail's collapsed state and the dock's
 * size are the caller's too: the shell reports a change and draws what it is
 * given, so an app remembers them wherever it remembers things. ⌘. toggles
 * the rail. The drawer's open state is the one thing kept here, and nothing
 * should outlive the window it was opened in.
 *
 * The drawer closes on a link inside it (the new screen would otherwise open
 * underneath), on Escape, and on its scrim. The scrim is always mounted and
 * fades in step with the rail's slide, both ways, so it never pops in on the
 * first frame or vanishes while the rail is still leaving. `topBarActions`
 * sit at the end of the top bar below `lg`.
 */
declare function AppShell({ title, header, nav, footer, actions, collapsed: railCollapsed, onCollapsedChange, dockMode, onDockModeChange, topBarActions, children, }: {
    /** Shown beside the menu button when the rail is a drawer (below lg). */
    title: string;
    header: ShellSlot;
    nav: React.ReactNode;
    footer: ShellSlot;
    actions: Array<CommandAction>;
    /** Whether the rail is collapsed to its icons. */
    collapsed: boolean;
    onCollapsedChange: (collapsed: boolean) => void;
    /** The dock size the person chose (see `AppFrame`). */
    dockMode: SideDockMode;
    onDockModeChange: (mode: SideDockMode) => void;
    /** Controls at the end of the top bar below `lg` (a search, a bell). */
    topBarActions?: React.ReactNode;
    children: React.ReactNode;
}): import("react").JSX.Element;
export { AppShell, ThemeToggle };
//# sourceMappingURL=app-shell.d.ts.map