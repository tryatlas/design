import type { Meta, StoryObj } from "@storybook/react-vite";
import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import {
  AppFrame,
  SideDock,
  SideDockSizeToggle,
  useSideDock,
  useSideDockRoom,
} from "../../../src/components/layout/app-frame.tsx";
import type { AppFrameInset, SideDockMode } from "../../../src/components/layout/app-frame.tsx";
import { expect, waitFor } from "storybook/test";
import { PageHeader } from "../../../src/components/patterns/section-header.tsx";
import {
  Sidebar,
  SidebarBody,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarPanel,
} from "../../../src/components/shell/sidebar.tsx";
import { cn } from "../../../src/lib/utils.ts";
import { Button } from "../../../src/ui/button.tsx";
import { IconButton } from "../../../src/ui/icon-button.tsx";
import { NAV, SESSIONS, StoryLinks } from "../shell/fixtures.tsx";

type Row = (typeof SESSIONS)[number];

function Dock({
  row,
  onClose,
  instant = false,
}: {
  row: Row;
  onClose: () => void;
  instant?: boolean;
}) {
  const { mode } = useSideDock();
  const { expand, restore } = useSideDockRoom();
  return (
    <SideDock instant={instant}>
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border-subtle px-3">
        <span className="code text-muted-foreground">{row.ref}</span>
        <span className="flex-1" />
        <SideDockSizeToggle />
        <IconButton icon={XIcon} label="Close" size="sm" onClick={onClose} />
      </div>
      <div className="flex flex-col gap-3 p-4">
        <h2 className="text-md font-semibold">{row.title}</h2>
        <p className="body text-secondary-foreground">
          The dock is drawn {mode}. Borrowing widens a compact dock without telling the app, so the
          size it remembers is still the one the person picked.
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

interface DemoProps {
  docked?: boolean;
  initialMode?: SideDockMode;
  topBar?: boolean;
  empty?: boolean;
  inset?: AppFrameInset;
  /** Open and close the dock with no slide and no fade. */
  instant?: boolean;
}

/** A macOS-style title row: what `inset="sides"` keeps at the window's top. */
function TitleRow({ lights = false, title }: { lights?: boolean; title?: string }) {
  return (
    <div
      data-testid={lights ? "title-row-lights" : "title-row"}
      className="flex h-9 shrink-0 items-center gap-2 border-b border-border-subtle px-3"
    >
      {/* Where macOS draws the traffic lights; the system's, not the app's. */}
      {lights && (
        <span aria-hidden="true" className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-3 rounded-full bg-muted" />
          ))}
        </span>
      )}
      {title && <span className="label truncate">{title}</span>}
    </div>
  );
}

function Demo({
  docked = false,
  initialMode = "compact",
  topBar = false,
  empty = false,
  inset = "all",
  instant = false,
}: DemoProps) {
  const sides = inset === "sides";
  // The app's state: the frame reports a pick and keeps nothing.
  const [dockMode, setDockMode] = useState<SideDockMode>(initialMode);
  const [selected, setSelected] = useState<number | null>(docked ? 0 : null);
  const row = selected === null ? undefined : SESSIONS[selected];

  return (
    <StoryLinks pathname="/sessions">
      <AppFrame
        dockMode={dockMode}
        onDockModeChange={setDockMode}
        inset={inset}
        topBar={
          topBar ? (
            <div className="flex h-10 shrink-0 items-center gap-1 px-2 lg:hidden">
              <IconButton icon={MenuIcon} label="Open navigation" size="sm" />
              <span className="truncate text-xs font-medium">Sessions</span>
            </div>
          ) : undefined
        }
        sidebar={
          <Sidebar className="lg:mr-2 max-lg:hidden">
            {sides ? (
              <TitleRow lights />
            ) : (
              <SidebarHeader>
                <span className="label px-2">Atlas</span>
              </SidebarHeader>
            )}
            <SidebarPanel className={sides ? "rounded-t-none border-t-0" : undefined}>
              <SidebarBody>
                <SidebarGroup label="Workspace">
                  {NAV.workspace.map((item) => (
                    <SidebarItem key={item.to} {...item} />
                  ))}
                </SidebarGroup>
              </SidebarBody>
            </SidebarPanel>
          </Sidebar>
        }
      >
        {sides && <TitleRow title="Sessions" />}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-5">
          <PageHeader title="Sessions" description={`The app keeps the dock at ${dockMode}.`} />
          {empty ? (
            <p className="caption">Nothing here: the page is whatever the app renders.</p>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border">
              {SESSIONS.map((s, i) => (
                <button
                  key={s.ref}
                  type="button"
                  onClick={() => setSelected(i)}
                  className={cn(
                    "flex w-full items-center gap-2 border-b border-border-subtle px-3 py-2 text-left last:border-b-0",
                    "transition-colors duration-fast ease-out-strong hover:bg-element-hover",
                    selected === i && "bg-element-selected",
                  )}
                >
                  <span className="code shrink-0 text-muted-foreground">{s.ref}</span>
                  <span className="label min-w-0 flex-1 truncate">{s.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {row && <Dock row={row} onClose={() => setSelected(null)} instant={instant} />}
      </AppFrame>
    </StoryLinks>
  );
}

const meta = {
  title: "Layout/AppFrame",
  component: Demo,
  args: { docked: false, initialMode: "compact", topBar: false, empty: false },
  argTypes: { initialMode: { control: "inline-radio", options: ["compact", "half"] } },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The application frame as slots: `sidebar`, an optional `topBar` (below lg) and `overlay`, and the page. It reads no storage and listens to no keys. The dock's size is controlled (`dockMode`, `onDockModeChange`); a screen fills `SideDock` from anywhere inside the frame, `SideDockSizeToggle` picks a size, `useSideDock` reads it and `useSideDockRoom` borrows room without changing the remembered pick. `AppShell` is this frame filled the way the Atlas apps fill it.",
      },
    },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
/** A record selected: the dock slides in beside the page. */
export const WithDock: Story = { args: { docked: true } };
/** The dock at half the work area. */
export const HalfDock: Story = { args: { docked: true, initialMode: "half" } };
export const Empty: Story = { args: { empty: true } };
export const Light: Story = { args: { docked: true }, globals: { appearance: "light" } };
/**
 * `inset="sides"`: the gutter runs left, right and bottom only, so the page,
 * the dock and (squared by the caller) the sidebar meet the window's top
 * edge. A 36px title row inside them stays where macOS centres its traffic
 * lights; the dots mark where the system draws them.
 */
export const TitlebarInset: Story = {
  args: { inset: "sides", docked: true },
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector<HTMLElement>('[data-slot="app-frame"]')!;
    await expect(frame).toHaveAttribute("data-inset", "sides");
    const page = frame.querySelector("main")!;
    const box = page.getBoundingClientRect();
    const frameBox = frame.getBoundingClientRect();
    // Flush with the top; the 8px gutter still runs below and to the right.
    await expect(box.top - frameBox.top).toBe(0);
    await expect(getComputedStyle(page).borderTopWidth).toBe("0px");
    const gutter = parseFloat(getComputedStyle(page.parentElement!.parentElement!).paddingBottom);
    await expect(gutter).toBeGreaterThan(0);
    await expect(Math.abs(frameBox.bottom - box.bottom - gutter)).toBeLessThanOrEqual(0.5);
    const dock = await waitFor(() => {
      const el = frame.querySelector<HTMLElement>('[data-slot="dock"]');
      if (!el) throw new Error("no dock yet");
      return el;
    });
    await expect(dock.getBoundingClientRect().top - frameBox.top).toBe(0);
    await expect(getComputedStyle(dock).borderTopWidth).toBe("0px");
  },
};

/** Below lg: the caller's top bar, no rail and no dock. */
export const Phone: Story = {
  args: { topBar: true },
  globals: { viewport: { value: "phone" } },
};

/**
 * `SideDock instant`: the dock opens and closes in one frame, for a dock
 * toggled from the keyboard (⌘J), where a slide on every press reads as
 * latency. Pick a row, then close it.
 */
export const InstantDock: Story = { args: { docked: true, instant: true } };
