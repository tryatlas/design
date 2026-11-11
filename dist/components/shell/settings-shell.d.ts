import type { LucideIcon } from "lucide-react";
import type { Organisation } from "../../lib/types.ts";
/**
 * Settings is a MODE, not a page: you leave the app, with an explicit way
 * back. Same frame as the app shell — curved nav panel on the canvas,
 * eyebrow group labels, the rail's rows — so it reads as the same product
 * with a different table of contents.
 */
export type SettingsNavItem = {
    label: string;
    to: string;
    icon: LucideIcon;
};
export type SettingsNavGroup = {
    label: string;
    items: Array<SettingsNavItem>;
};
/** A rail row, the sidebar's shape. */
declare function RailLink({ to, icon: Glyph, children, className, current, }: {
    to: string;
    icon?: LucideIcon;
    children: React.ReactNode;
    className?: string;
    /** Whether this is the page you are on. Unset, the path must equal `to`. */
    current?: boolean;
}): import("react").JSX.Element;
declare function RailGroup({ label, items, current, }: {
    label: string;
    items: Array<SettingsNavItem>;
    /** The `to` of the item that is lit; unset, an exact path match. */
    current?: string;
}): import("react").JSX.Element;
/**
 * Settings, in the same frame as the app: the back link and the workspace sit
 * on the canvas, the section list is a curved nav panel, and the page is a
 * curved panel beside it — so leaving the app for settings changes what is
 * in the panels, not the shape of the window.
 *
 * Below `md` there is no room for a second column, so the table of contents
 * runs across the top of the canvas instead — the same rows, in a line that
 * scrolls sideways — and the page keeps the whole width.
 *
 * `wide` is for a page that lays plans or columns side by side: the page
 * column grows from 40rem to 72rem.
 *
 * The lit row is the page you are on, or the page it sits under: Billing
 * stays lit on its plans page.
 */
declare function SettingsShell({ org, groups, backHref, wide, children, }: {
    org: Pick<Organisation, "name" | "initials">;
    /** The rail's sections, e.g. Workspace and Account. */
    groups: Array<SettingsNavGroup>;
    /** Where "Back to app" goes. */
    backHref: string;
    /** Give the page 72rem rather than a form's 40rem. */
    wide?: boolean;
    children: React.ReactNode;
}): import("react").JSX.Element;
export { RailGroup, RailLink, SettingsShell };
//# sourceMappingURL=settings-shell.d.ts.map