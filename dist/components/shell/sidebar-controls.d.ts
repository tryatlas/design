/**
 * The sidebar footer's two menus.
 *
 * `ProfileMenu` is YOU — your face on the trigger, your account inside. The
 * workspace switcher at the top of the rail is US; keeping the two apart is
 * why "Account settings" lives here and not there.
 *
 * `InfoMenu` is the Atlas desktop app's (?) menu: help, the community, and
 * the way out to settings and the website. External destinations open in a
 * new tab, and a link the caller leaves out is left out of the menu.
 *
 * Both take `children`: the host's own entries (a theme submenu, an
 * interface-size submenu), as `DropdownMenuItem`s or `DropdownMenuSub`s,
 * placed with the menu's other settings.
 */
declare function ProfileMenu({ user, accountHref, privacyHref, onLogOut, children, }: {
    user: {
        name: string;
        email: string;
        image?: string | null;
    };
    accountHref: string;
    privacyHref?: string;
    onLogOut: () => void;
    /** The host's own entries, after Account and Privacy (a theme submenu). */
    children?: React.ReactNode;
}): import("react").JSX.Element;
/** Where the help menu's entries go. Each one left out is not shown. */
export type InfoLinks = {
    docs?: string;
    feedback?: string;
    github?: string;
    discord?: string;
    x?: string;
    download?: string;
    website?: string;
};
declare function InfoMenu({ links, settingsHref, onShortcuts, onFeedback, children, }: {
    links: InfoLinks;
    settingsHref?: string;
    onShortcuts?: () => void;
    /** Send feedback opens the host's own form (a dialog) instead of a link. Wins over `links.feedback`. */
    onFeedback?: () => void;
    /** The host's own entries, after the help group (an interface-size submenu). */
    children?: React.ReactNode;
}): import("react").JSX.Element;
export { InfoMenu, ProfileMenu };
//# sourceMappingURL=sidebar-controls.d.ts.map