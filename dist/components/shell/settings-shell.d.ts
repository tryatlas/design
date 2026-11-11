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
declare function RailLink({ to, icon: Glyph, children, }: {
    to: string;
    icon?: LucideIcon;
    children: React.ReactNode;
}): import("react").JSX.Element;
declare function RailGroup({ label, items }: {
    label: string;
    items: Array<SettingsNavItem>;
}): import("react").JSX.Element;
/**
 * Settings, in the same frame as the app: the back link and the workspace sit
 * on the canvas, the section list is a curved nav panel, and the page is a
 * curved panel beside it — so leaving the app for settings changes what is
 * in the panels, not the shape of the window.
 */
declare function SettingsShell({ org, groups, backHref, children, }: {
    org: Pick<Organisation, "name" | "initials">;
    /** The rail's sections, e.g. Workspace and Account. */
    groups: Array<SettingsNavGroup>;
    /** Where "Back to app" goes. */
    backHref: string;
    children: React.ReactNode;
}): import("react").JSX.Element;
export { RailGroup, RailLink, SettingsShell };
//# sourceMappingURL=settings-shell.d.ts.map