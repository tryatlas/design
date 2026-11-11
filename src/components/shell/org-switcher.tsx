"use client";

import {
  ArrowLeftRightIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  LogOutIcon,
  PlusIcon,
  SettingsIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";

import { cn } from "../../lib/utils.ts";

import { useLinks } from "../../lib/link.tsx";
import type { Organisation } from "../../lib/types.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu.tsx";
import { Icon } from "../../ui/icon.tsx";
import { Skeleton } from "../ui/skeleton.tsx";

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

function OrgMark({
  initials,
  logo,
  className,
}: {
  initials: string;
  /** An image URL drawn in place of the initials. */
  logo?: string | null;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-sm",
        "bg-(--element-emphasis) text-3xs font-semibold text-foreground",
        className,
      )}
    >
      {logo ? <img src={logo} alt="" className="size-full object-cover" /> : initials}
    </span>
  );
}

function OrgSwitcher({
  org,
  orgs,
  email,
  onOrgChange,
  settingsHref,
  membersHref = settingsHref,
  onLogOut,
  className,
  collapsed = false,
  plan,
  loading = false,
  onCreateOrg,
  onInvite,
  numberKeys = false,
  shortcuts = true,
}: {
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
}) {
  const { Link } = useLinks();
  const [open, setOpen] = useState(false);
  const hint = (keys: string) => shortcuts && <DropdownMenuShortcut>{keys}</DropdownMenuShortcut>;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        // Collapsed, the mark is all that shows, so the name starts with its
        // initials (WCAG 2.5.3, label in name).
        aria-label={collapsed ? `${org.initials}, ${org.name}` : undefined}
        className={cn(
          "flex h-8 w-full min-w-0 items-center gap-2 rounded-md px-1",
          "text-left select-none",
          "transition-colors duration-fast ease-out-strong",
          "hover:bg-sidebar-accent data-popup-open:bg-sidebar-accent",
          collapsed && "justify-center px-0",
          className,
        )}
      >
        <OrgMark initials={org.initials} logo={org.logo} className="size-6 rounded-md text-3xs" />
        {!collapsed && (
          <>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-xs font-medium text-foreground">{org.name}</span>
              {loading ? (
                <Skeleton className="my-0.5 h-2 w-14" />
              ) : (
                <span className="truncate text-3xs text-muted-foreground">
                  {org.memberCount} {org.memberCount === 1 ? "member" : "members"}
                  {plan && ` · ${plan}`}
                </span>
              )}
            </span>
            <Icon icon={ChevronsUpDownIcon} size="xs" className="text-muted-foreground" />
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" sideOffset={4}>
        <DropdownMenuItem render={<Link href={settingsHref} />}>
          <Icon icon={SettingsIcon} size="sm" />
          Settings
          {hint("G then S")}
        </DropdownMenuItem>
        {onInvite ? (
          <>
            <DropdownMenuItem onClick={onInvite}>
              <Icon icon={UserPlusIcon} size="sm" />
              Invite people…
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href={membersHref} />}>
              <Icon icon={UsersIcon} size="sm" />
              Manage members
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem render={<Link href={membersHref} />}>
            <Icon icon={UserPlusIcon} size="sm" />
            Invite and manage members
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Icon icon={ArrowLeftRightIcon} size="sm" />
            Switch workspace
            {hint("O then W")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent
            className="w-64"
            onKeyDown={
              numberKeys
                ? (e) => {
                    const n = Number(e.key);
                    const target = Number.isInteger(n) && n > 0 ? orgs[n - 1] : undefined;
                    if (!target || e.metaKey || e.ctrlKey || e.altKey) return;
                    e.preventDefault();
                    onOrgChange(target.id);
                    // A choice closes the menu, as a click on the row does.
                    setOpen(false);
                  }
                : undefined
            }
          >
            {/* Which login this list belongs to, before which workspace. */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="tracking-normal normal-case">{email}</DropdownMenuLabel>
              {orgs.map((o, i) => (
                <DropdownMenuItem key={o.id} onClick={() => onOrgChange(o.id)}>
                  <OrgMark initials={o.initials} logo={o.logo} />
                  <span className="flex-1 truncate">{o.name}</span>
                  {o.id === org.id && (
                    <Icon icon={CheckIcon} size="sm" className="text-foreground" />
                  )}
                  {shortcuts && i < 9 && (
                    <span className="tnum w-3 text-right text-2xs text-disabled">{i + 1}</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              {onCreateOrg && (
                <DropdownMenuItem onClick={onCreateOrg}>
                  <Icon icon={PlusIcon} size="sm" />
                  Create or join a workspace…
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>Add an account…</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={onLogOut}>
          <Icon icon={LogOutIcon} size="sm" />
          Log out
          {hint("⌥ ⇧ Q")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { OrgMark, OrgSwitcher };
