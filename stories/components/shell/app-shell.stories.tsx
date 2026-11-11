import type { Meta, StoryObj } from "@storybook/react-vite";
import { BellIcon, FolderIcon, PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { expect, screen, userEvent, waitFor } from "storybook/test";
import { PersonAvatar } from "../../../src/components/patterns/person-avatar.tsx";
import { PageHeader } from "../../../src/components/patterns/section-header.tsx";
import {
  SideDock,
  SideDockSizeToggle,
  useSideDock,
  useSideDockRoom,
} from "../../../src/components/layout/app-frame.tsx";
import type { SideDockMode } from "../../../src/components/layout/app-frame.tsx";
import { AppShell, ThemeToggle } from "../../../src/components/shell/app-shell.tsx";
import { OrgSwitcher } from "../../../src/components/shell/org-switcher.tsx";
import { SidebarGroup, SidebarItem } from "../../../src/components/shell/sidebar.tsx";
import { InfoMenu, ProfileMenu } from "../../../src/components/shell/sidebar-controls.tsx";
import { UiScaleControl } from "../../../src/components/shell/ui-scale.tsx";
import { StatusIcon } from "../../../src/components/ui/status-icon.tsx";
import { cn } from "../../../src/lib/utils.ts";
import { Button } from "../../../src/ui/button.tsx";
import { Icon } from "../../../src/ui/icon.tsx";
import { IconButton } from "../../../src/ui/icon-button.tsx";
import { ACTIONS, NAV, ORGS, SESSIONS, StoryLinks, USER } from "./fixtures.tsx";

type Row = (typeof SESSIONS)[number];

/** The dock a screen renders: a header with the size toggle, then the record. */
function SessionDock({ row, onClose }: { row: Row; onClose: () => void }) {
  const { mode } = useSideDock();
  const { expand, restore } = useSideDockRoom();
  return (
    <SideDock>
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border-subtle px-3">
        <span className="code text-muted-foreground">{row.ref}</span>
        <span className="flex-1" />
        <SideDockSizeToggle />
        <IconButton icon={XIcon} label="Close" size="sm" onClick={onClose} />
      </div>
      <div className="flex flex-col gap-3 p-4">
        <h2 className="text-md font-semibold">{row.title}</h2>
        <div className="flex items-center gap-2">
          <PersonAvatar size="xs" name={row.who} />
          <span className="caption">
            {row.who} · {row.ago}
          </span>
        </div>
        <p className="body text-secondary-foreground">
          The dock is {mode}. A panel that needs more room borrows it with `useSideDockRoom`.
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => expand()}>
            Borrow room
          </Button>
          <Button size="sm" variant="ghost" onClick={restore}>
            Give it back
          </Button>
        </div>
      </div>
    </SideDock>
  );
}

function SessionsPage({ rows, docked }: { rows: Row[]; docked: boolean }) {
  const [selected, setSelected] = useState<number | null>(docked ? 0 : null);
  const current = selected === null ? undefined : rows[selected];
  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-5">
        <PageHeader
          title="Sessions"
          description={`${rows.length} this week across 3 projects`}
          action={
            <Button size="sm">
              <Icon icon={PlusIcon} size="sm" />
              New session
            </Button>
          }
        />
        {rows.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-1 py-16">
            <span className="label">No sessions yet</span>
            <span className="caption">Start one with ⌘N, or from ⌘K.</span>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            {rows.map((row, i) => (
              <button
                key={`${row.ref}-${i}`}
                type="button"
                onClick={() => setSelected(i)}
                className={cn(
                  "flex w-full items-center gap-2 border-b border-border-subtle px-3 py-2 text-left last:border-b-0",
                  "transition-colors duration-fast ease-out-strong hover:bg-element-hover",
                  selected === i && "bg-element-selected",
                )}
              >
                <StatusIcon status={i === 0 ? "live" : "done"} />
                <span className="code shrink-0 text-muted-foreground">{row.ref}</span>
                <span className="label min-w-0 flex-1 truncate">{row.title}</span>
                <span className="caption shrink-0">{row.who}</span>
                <span className="caption w-16 shrink-0 text-right">{row.ago}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {current && <SessionDock row={current} onClose={() => setSelected(null)} />}
    </>
  );
}

interface DemoProps {
  rows: Row[];
  docked?: boolean;
  pathname?: string;
  collapsed?: boolean;
}

function Demo({ rows, docked = false, pathname = "/sessions", collapsed = false }: DemoProps) {
  // The app's state, which it would remember wherever it remembers things.
  const [railCollapsed, setRailCollapsed] = useState(collapsed);
  const [dockMode, setDockMode] = useState<SideDockMode>("compact");
  const [scale, setScale] = useState(1);
  const [appearance, setAppearance] = useState<"dark" | "light">("dark");
  return (
    <StoryLinks pathname={pathname}>
      <AppShell
        title="Sessions"
        actions={ACTIONS}
        collapsed={railCollapsed}
        onCollapsedChange={setRailCollapsed}
        dockMode={dockMode}
        onDockModeChange={setDockMode}
        topBarActions={<IconButton icon={BellIcon} label="Notifications" size="sm" />}
        header={({ collapsed }) => (
          <OrgSwitcher
            org={ORGS[0]!}
            orgs={ORGS}
            email={USER.email}
            onOrgChange={() => {}}
            settingsHref="/settings"
            collapsed={collapsed}
          />
        )}
        nav={
          <>
            <SidebarGroup label="Workspace">
              {NAV.workspace.map((item) => (
                <SidebarItem key={item.to} {...item} />
              ))}
            </SidebarGroup>
            <SidebarGroup label="Team">
              {NAV.team.map((item) => (
                <SidebarItem key={item.to} {...item} />
              ))}
              <SidebarItem icon={FolderIcon} label="Projects" children={NAV.projects} />
            </SidebarGroup>
          </>
        }
        footer={({ collapsed }) => (
          <>
            <ProfileMenu user={USER} accountHref="/settings/profile" onLogOut={() => {}} />
            {!collapsed && <span className="flex-1" />}
            <ThemeToggle
              appearance={appearance}
              onToggle={() => setAppearance((a) => (a === "dark" ? "light" : "dark"))}
            />
            <UiScaleControl scale={scale} onScaleChange={setScale} iconOnly />
            <InfoMenu links={{ docs: "#", github: "#", discord: "#" }} settingsHref="/settings" />
          </>
        )}
      >
        <SessionsPage rows={rows} docked={docked} />
      </AppShell>
    </StoryLinks>
  );
}

const MANY = Array.from({ length: 40 }, (_, i) => SESSIONS[i % SESSIONS.length]!);

const meta = {
  title: "Shell/AppShell",
  component: Demo,
  args: { rows: SESSIONS, docked: false, pathname: "/sessions", collapsed: false },
  argTypes: { rows: { control: false } },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "`AppFrame` filled the way the Atlas apps fill it. The caller fills the rail (`header`, `nav`, `footer`, which may be functions of the collapsed state) and ⌘K's `actions`; the page is the children. The rail's `collapsed` state and the `dockMode` are controlled: the shell reports changes and keeps nothing, so the app decides what is remembered. ⌘. toggles the rail. A screen fills the `SideDock` by rendering it anywhere in its tree. `ThemeToggle` is a footer tool. Below lg the rail is a drawer.",
      },
    },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
/** A session selected: the dock opens beside the page. */
export const WithDock: Story = {
  args: { docked: true },
};
/** The rail collapsed to its icons. */
export const Collapsed: Story = {
  args: { collapsed: true },
};
export const Light: Story = {
  args: { docked: true },
  globals: { appearance: "light" },
};
export const Empty: Story = {
  args: { rows: [] },
};
export const ManyItems: Story = {
  args: { rows: MANY },
};
/** ⌘K open over the shell. */
export const CommandOpen: Story = {
  play: async () => {
    await userEvent.keyboard("{Meta>}k{/Meta}");
    // Wait for the dialog, so the axe run sees it open rather than racing the keys.
    await screen.findByRole("dialog");
  },
  tags: ["!autodocs"],
};
/** Below lg: the top bar, with `topBarActions` at its end, opens the rail as a drawer. */
export const Phone: Story = { globals: { viewport: { value: "phone" } } };

/**
 * The drawer's scrim is always mounted and fades with the rail; Escape
 * closes the drawer, and so does a link inside it, but nothing else in the
 * rail does.
 */
export const PhoneDrawer: Story = {
  globals: { viewport: { value: "phone" } },
  play: async ({ canvasElement }) => {
    const scrim = canvasElement.ownerDocument.querySelector<HTMLElement>(
      'button[aria-label="Close navigation"]',
    )!;
    await expect(scrim).toHaveAttribute("aria-hidden", "true");
    // A programmatic click: the button is `lg:hidden`, and the run's viewport may be wide.
    canvasElement.ownerDocument
      .querySelector<HTMLElement>('button[aria-label="Open navigation"]')!
      .click();
    await waitFor(() => expect(scrim).not.toHaveAttribute("aria-hidden"));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(scrim).toHaveAttribute("aria-hidden", "true"));
  },
};
