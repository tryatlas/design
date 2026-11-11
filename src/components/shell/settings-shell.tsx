"use client";

import { useRef } from "react";
import { ArrowLeftIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { isAt, useLinks } from "../../lib/link.tsx";
import type { Organisation } from "../../lib/types.ts";
import { cn } from "../../lib/utils.ts";
import { Icon } from "../../ui/icon.tsx";
import { ScrollFade, useScrollEdges } from "../../ui/scroll-fade.tsx";
import { OrgMark } from "./org-switcher.tsx";

/**
 * Settings is a MODE, not a page: you leave the app, with an explicit way
 * back. Same frame as the app shell — curved nav panel on the canvas,
 * eyebrow group labels, the rail's rows — so it reads as the same product
 * with a different table of contents.
 */

export type SettingsNavItem = { label: string; to: string; icon: LucideIcon };

export type SettingsNavGroup = { label: string; items: Array<SettingsNavItem> };

/**
 * The item a path belongs to: the one it equals, or else the longest one it
 * sits under, so Billing stays lit on Billing → Plans while General
 * (`/settings`) does not light for every page beneath it.
 */
function currentItem(groups: Array<SettingsNavGroup>, pathname: string): string | undefined {
  const path = pathname.replace(/(.)\/$/, "$1");
  let best: string | undefined;
  for (const { to } of groups.flatMap((group) => group.items)) {
    if (path === to) return to;
    if (path.startsWith(`${to}/`) && (!best || to.length > best.length)) best = to;
  }
  return best;
}

/** A rail row, the sidebar's shape. */
function RailLink({
  to,
  icon: Glyph,
  children,
  className,
  current,
}: {
  to: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  /** Whether this is the page you are on. Unset, the path must equal `to`. */
  current?: boolean;
}) {
  const { Link, location } = useLinks();
  return (
    <Link
      href={to}
      aria-current={(current ?? isAt(location, to)) ? "page" : undefined}
      className={cn(
        "group/item flex h-7 items-center gap-2 rounded-md px-2 text-xs",
        "transition-colors duration-fast ease-out-strong",
        "text-muted-foreground hover:bg-element-hover hover:text-foreground",
        "aria-[current=page]:bg-element-selected aria-[current=page]:font-medium aria-[current=page]:text-foreground",
        className,
      )}
    >
      {Glyph && <Icon icon={Glyph} size="sm" />}
      <span className="truncate">{children}</span>
    </Link>
  );
}

function RailGroup({
  label,
  items,
  current,
}: {
  label: string;
  items: Array<SettingsNavItem>;
  /** The `to` of the item that is lit; unset, an exact path match. */
  current?: string;
}) {
  return (
    <div className="mb-3">
      <div className="px-2 pb-1.5 eyebrow">{label}</div>
      <ul className="space-y-px">
        {items.map((item) => (
          <li key={item.to}>
            <RailLink
              to={item.to}
              icon={item.icon}
              current={current === undefined ? undefined : item.to === current}
            >
              {item.label}
            </RailLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
function SettingsShell({
  org,
  groups,
  backHref,
  wide = false,
  children,
}: {
  org: Pick<Organisation, "name" | "initials">;
  /** The rail's sections, e.g. Workspace and Account. */
  groups: Array<SettingsNavGroup>;
  /** Where "Back to app" goes. */
  backHref: string;
  /** Give the page 72rem rather than a form's 40rem. */
  wide?: boolean;
  children: React.ReactNode;
}) {
  const nav = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const navEdges = useScrollEdges(nav, [groups]);
  const pageEdges = useScrollEdges(page, [children]);
  const current = currentItem(groups, useLinks().location.pathname) ?? "";
  return (
    <div className="flex h-svh w-full flex-col overflow-hidden bg-sidebar">
      <div className="shrink-0 px-2 pt-2 md:hidden">
        <div className="flex h-10 items-center justify-between gap-2 pb-2">
          <RailLink to={backHref} icon={ArrowLeftIcon}>
            Back to app
          </RailLink>
          <span className="flex min-w-0 items-center gap-2 pr-2">
            <OrgMark initials={org.initials} className="size-5 rounded-md text-3xs" />
            <span className="truncate text-xs font-medium">{org.name}</span>
          </span>
        </div>
        <nav
          aria-label="Settings"
          className="-mx-2 flex gap-1 overflow-x-auto px-2 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {groups
            .flatMap((group) => group.items)
            .map((item) => (
              <RailLink
                key={item.to}
                to={item.to}
                icon={item.icon}
                current={item.to === current}
                className="shrink-0"
              >
                {item.label}
              </RailLink>
            ))}
        </nav>
      </div>

      <div className="flex min-h-0 flex-1 gap-2 p-2 max-md:pt-0">
        <nav
          aria-label="Settings"
          data-panel=""
          className="flex w-56 shrink-0 flex-col max-md:hidden"
        >
          <div className="flex h-10 shrink-0 items-center pb-2">
            <RailLink to={backHref} icon={ArrowLeftIcon}>
              Back to app
            </RailLink>
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-background">
            <div className="flex items-center gap-2 px-3 pt-3 pb-3">
              <OrgMark initials={org.initials} className="size-6 rounded-md text-3xs" />
              <span className="truncate text-xs font-medium">{org.name}</span>
            </div>
            <div className="relative flex min-h-0 flex-1 flex-col">
              <div ref={nav} className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
                {groups.map((group) => (
                  <RailGroup key={group.label} {...group} current={current} />
                ))}
              </div>
              <ScrollFade at="top" visible={navEdges.top} className="h-6 from-background" />
              <ScrollFade at="bottom" visible={navEdges.bottom} className="h-6 from-background" />
            </div>
          </div>
        </nav>

        <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-xl border border-border bg-background">
          <div ref={page} className="h-full overflow-y-auto">
            <div
              className={cn(
                "mx-auto w-full px-5 py-6 max-sm:px-4",
                wide ? "max-w-288" : "max-w-160",
              )}
            >
              {children}
            </div>
          </div>
          <ScrollFade at="top" visible={pageEdges.top} className="from-background" />
          <ScrollFade at="bottom" visible={pageEdges.bottom} className="from-background" />
        </div>
      </div>
    </div>
  );
}

export { RailGroup, RailLink, SettingsShell };
