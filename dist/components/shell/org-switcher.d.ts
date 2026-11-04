import type { Organisation } from "../../lib/types.ts";
/**
 * The workspace switcher, top-left of the rail.
 *
 * This is the single worst thing about the current Atlas web app: to change
 * org you navigate to /dashboard, land on the Organisation tab, and use a
 * `<select>` that sets better-auth's active org — which three other screens
 * then ignore, because they read the org from the URL instead.
 *
 * The answer here:
 *
 *  - The switcher is the FIRST thing in the rail, so the answer to "which
 *    workspace am I in" is in the same place on every screen.
 *  - The parent menu carries the things you reach for while thinking about
 *    the workspace as a whole — Settings, Invite people, Log out — because
 *    that is what you are already looking at.
 *  - Switching is a SUBMENU, not the menu. It is the rarest of the four
 *    actions, and putting five workspaces inline would push Log out off the
 *    bottom the moment someone joins a sixth.
 *  - The submenu is headed by the account email. With several accounts, "which
 *    login is this list for" is the question immediately before "which
 *    workspace", so it is answered first.
 *  - Each workspace carries a numeric shortcut. The check marks the active
 *    one — the number is how you get there without the menu at all.
 */
declare function OrgMark({ initials, className }: {
    initials: string;
    className?: string;
}): import("react").JSX.Element;
declare function OrgSwitcher({ org, orgs, email, onOrgChange, settingsHref, membersHref, onLogOut, className, collapsed, }: {
    /** The active workspace. */
    org: Organisation;
    orgs: Array<Organisation>;
    /** The signed-in account, heading the workspace list. */
    email: string;
    onOrgChange: (id: string) => void;
    settingsHref: string;
    membersHref?: string;
    onLogOut?: () => void;
    className?: string;
    collapsed?: boolean;
}): import("react").JSX.Element;
export { OrgMark, OrgSwitcher };
//# sourceMappingURL=org-switcher.d.ts.map