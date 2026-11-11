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
 *    one; with `numberKeys`, pressing a number while the list is open
 *    switches to that workspace.
 *
 * What the host owns: `plan` (a label after the member count), `loading`
 * (the count is not known yet), `onCreateOrg` and `onInvite` (the host's
 * dialogs; without `onInvite` the item is a link to `membersHref`), and
 * `shortcuts={false}` for a host that has no keyboard shortcuts to show.
 */
declare function OrgMark({ initials, logo, className, }: {
    initials: string;
    /** An image URL drawn in place of the initials. */
    logo?: string | null;
    className?: string;
}): import("react").JSX.Element;
declare function OrgSwitcher({ org, orgs, email, onOrgChange, settingsHref, membersHref, onLogOut, className, collapsed, plan, loading, onCreateOrg, onInvite, numberKeys, shortcuts, }: {
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
    /** The plan's name, after the member count ("Team"). */
    plan?: string;
    /** The member count is still loading: a placeholder holds its line. */
    loading?: boolean;
    /** Create or join a workspace (the host's dialog). Absent: the item is not shown. */
    onCreateOrg?: () => void;
    /** Invite people (the host's dialog). Absent: the item links to `membersHref`. */
    onInvite?: () => void;
    /** With the workspace list open, 1–9 switch to that workspace. */
    numberKeys?: boolean;
    /** Show the keyboard-shortcut hints. Off for a host with no shortcuts. */
    shortcuts?: boolean;
}): import("react").JSX.Element;
export { OrgMark, OrgSwitcher };
//# sourceMappingURL=org-switcher.d.ts.map