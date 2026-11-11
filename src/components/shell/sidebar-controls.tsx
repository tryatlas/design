"use client";

import {
  BookOpenIcon,
  CircleHelpIcon,
  DownloadIcon,
  GlobeIcon,
  KeyboardIcon,
  LogOutIcon,
  MessageCircleIcon,
  SettingsIcon,
  ShieldIcon,
  UserIcon,
} from "lucide-react";

import { initialsOf } from "../../lib/initials.ts";
import { useLinks } from "../../lib/link.tsx";
import { PersonAvatar } from "../patterns/person-avatar.tsx";
import { DiscordMark, GitHubMark, XMark } from "../ui/brand-marks.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu.tsx";
import { Icon } from "../../ui/icon.tsx";
import { IconButton } from "../../ui/icon-button.tsx";

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

function ProfileMenu({
  user,
  accountHref,
  privacyHref,
  onLogOut,
  children,
}: {
  user: { name: string; email: string; image?: string | null };
  accountHref: string;
  privacyHref?: string;
  onLogOut: () => void;
  /** The host's own entries, after Account and Privacy (a theme submenu). */
  children?: React.ReactNode;
}) {
  const { Link } = useLinks();
  // The name starts with the initials the avatar shows, so a voice user can
  // say what they see (WCAG 2.5.3, label in name).
  const initials = initialsOf(user.name, user.email);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={`${initials}, account — ${user.name}`}
            className="rounded-full outline-offset-2 transition-opacity duration-fast hover:opacity-85"
          >
            <PersonAvatar
              size="sm"
              name={user.name}
              email={user.email}
              image={user.image}
              initials={initials}
            />
          </button>
        }
      />
      <DropdownMenuContent side="top" align="start" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2 py-2 tracking-normal normal-case">
            <PersonAvatar size="md" name={user.name} email={user.email} image={user.image} />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-medium text-foreground">{user.name}</span>
              <span className="truncate text-2xs text-muted-foreground">{user.email}</span>
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={accountHref} />}>
          <Icon icon={UserIcon} size="sm" />
          Account settings
        </DropdownMenuItem>
        {privacyHref && (
          <DropdownMenuItem render={<Link href={privacyHref} />}>
            <Icon icon={ShieldIcon} size="sm" />
            Privacy
          </DropdownMenuItem>
        )}
        {children}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onLogOut}>
          <Icon icon={LogOutIcon} size="sm" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** An external destination: a real anchor, opened in a new tab. */
function external(href: string) {
  return <a href={href} target="_blank" rel="noreferrer" />;
}

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

function InfoMenu({
  links,
  settingsHref,
  onShortcuts,
  onFeedback,
  children,
}: {
  links: InfoLinks;
  settingsHref?: string;
  onShortcuts?: () => void;
  /** Send feedback opens the host's own form (a dialog) instead of a link. Wins over `links.feedback`. */
  onFeedback?: () => void;
  /** The host's own entries, after the help group (an interface-size submenu). */
  children?: React.ReactNode;
}) {
  const { Link } = useLinks();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<IconButton icon={CircleHelpIcon} label="Help and links" size="sm" />}
      />
      <DropdownMenuContent side="top" align="end" className="w-56">
        {links.docs && (
          <DropdownMenuItem render={external(links.docs)}>
            <Icon icon={BookOpenIcon} size="sm" />
            Docs
          </DropdownMenuItem>
        )}
        {onFeedback ? (
          <DropdownMenuItem onClick={onFeedback}>
            <Icon icon={MessageCircleIcon} size="sm" />
            Send feedback…
          </DropdownMenuItem>
        ) : (
          links.feedback && (
            <DropdownMenuItem render={external(links.feedback)}>
              <Icon icon={MessageCircleIcon} size="sm" />
              Send feedback
            </DropdownMenuItem>
          )
        )}
        {onShortcuts && (
          <DropdownMenuItem onClick={onShortcuts}>
            <Icon icon={KeyboardIcon} size="sm" />
            Keyboard shortcuts
            <DropdownMenuShortcut>⌘ /</DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        {children}
        <DropdownMenuSeparator />
        {links.github && (
          <DropdownMenuItem render={external(links.github)}>
            <GitHubMark className="size-3.5" />
            GitHub repo
          </DropdownMenuItem>
        )}
        {links.discord && (
          <DropdownMenuItem render={external(links.discord)}>
            <DiscordMark className="size-3.5" />
            Discord community
          </DropdownMenuItem>
        )}
        {links.x && (
          <DropdownMenuItem render={external(links.x)}>
            <XMark className="size-3.5" />
            Follow on X
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {links.download && (
          <DropdownMenuItem render={external(links.download)}>
            <Icon icon={DownloadIcon} size="sm" />
            Download desktop
          </DropdownMenuItem>
        )}
        {settingsHref && (
          <DropdownMenuItem render={<Link href={settingsHref} />}>
            <Icon icon={SettingsIcon} size="sm" />
            Settings
          </DropdownMenuItem>
        )}
        {links.website && (
          <DropdownMenuItem render={external(links.website)}>
            <Icon icon={GlobeIcon} size="sm" />
            Our website
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { InfoMenu, ProfileMenu };
