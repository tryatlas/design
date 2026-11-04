import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { type LinkLocation } from "../../lib/link.tsx";
type RailContext = {
    collapsed: boolean;
    railId: string;
    location: LinkLocation;
};
declare function useSidebar(): RailContext;
declare function Sidebar({ collapsed, className, children, ...props }: Omit<React.ComponentProps<typeof motion.nav>, "children"> & {
    collapsed?: boolean;
    children: React.ReactNode;
}): import("react").JSX.Element;
/**
 * The workspace row. It sits on the shell's canvas ABOVE the curved panel,
 * as the Atlas desktop app does — the switcher is the frame's, the panel
 * below is the navigation's.
 */
declare function SidebarHeader({ className, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
/**
 * The curved segment the navigation lives in: search, groups and footer
 * inside one ringed panel on the page's own background, so the rail reads as
 * a surface with depth rather than a strip of links along the window edge.
 */
declare function SidebarPanel({ className, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
/** The ⌘K affordance. Collapsed, it is just the glyph, in a circle. */
declare function SidebarSearch({ onOpen }: {
    onOpen: () => void;
}): import("react").JSX.Element;
declare function SidebarBody({ className, children, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
declare function SidebarFooter({ className, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
/** A labelled run of rows. Collapsed, the label becomes a short rule. */
declare function SidebarGroup({ label, className, children, ...props }: React.ComponentProps<"div"> & {
    label?: React.ReactNode;
}): import("react").JSX.Element;
export type SidebarChild = {
    label: string;
    to: string;
    search?: Record<string, string>;
    icon: LucideIcon;
};
type SidebarItemProps = {
    icon?: LucideIcon;
    /** A rendered glyph — a status icon — where a Lucide icon does not fit. */
    mark?: React.ReactNode;
    label: string;
    to?: string;
    search?: Record<string, string>;
    /** Right-aligned count. Hidden at 0. */
    count?: number;
    /** A one-glyph marker: "AI", a live dot, a beta mark. */
    badge?: "ai" | "live" | "beta";
    /** Makes the row a disclosure. */
    children?: Array<SidebarChild>;
    /** A disclosure that starts open. It still opens itself for an active child. */
    defaultOpen?: boolean;
    /** Considered active when the pathname matches — defaults to `to`. */
    match?: (pathname: string) => boolean;
    className?: string;
};
declare function SidebarItem({ icon, mark, label, to, search, count, badge, children, defaultOpen, match, className, }: SidebarItemProps): import("react").JSX.Element;
export { Sidebar, SidebarBody, SidebarFooter, SidebarGroup, SidebarHeader, SidebarItem, SidebarPanel, SidebarSearch, useSidebar, };
//# sourceMappingURL=sidebar.d.ts.map