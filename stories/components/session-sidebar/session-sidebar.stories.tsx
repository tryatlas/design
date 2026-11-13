import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { ArrowDownUp, ChevronDown, PanelLeft, Plus } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { expect, userEvent, within } from "storybook/test";

import {
  SessionRowCard,
  SessionRowHoverCard,
  SessionRowSlim,
  SessionSearchResult,
  type SessionRowViewProps,
} from "../../../src/components/session-sidebar/session-row.tsx";
import {
  SessionSidebarEmpty,
  SessionSidebarListDivider,
  SessionSidebarScroller,
  SessionSidebarSearch,
  SessionSidebarSearchResults,
  SessionSidebarSettledShelf,
  SessionSidebarSnoozedShelf,
  sessionSearchResultId,
} from "../../../src/components/session-sidebar/session-sidebar-list.tsx";
import {
  GlassIconButton,
  SessionSidebar,
  SessionSidebarDestinations,
  SessionSidebarDock,
  SessionSidebarPeek,
} from "../../../src/components/session-sidebar/session-sidebar.tsx";
import { IconButton } from "../../../src/ui/icon-button.tsx";
import {
  Destinations,
  DockItems,
  NotificationsBell,
  PROJECTS,
  SESSIONS,
  SETTLED,
  SNOOZED,
  SNOOZE_PRESETS,
  agentIcon,
  badgeFor,
  manySessions,
  workingDuration,
  type FixtureSession,
} from "./fixtures.tsx";

const noop = () => {};

function hoverCard(s: FixtureSession) {
  return (
    <SessionRowHoverCard>
      <div className="flex min-w-0 max-w-80 flex-col gap-1 px-1 py-2 text-xs">
        <div className="truncate font-medium text-foreground">{s.title}</div>
        <div className="truncate text-secondary-foreground">{s.projectName}</div>
      </div>
    </SessionRowHoverCard>
  );
}

function viewProps(s: FixtureSession, activeId: string | null): SessionRowViewProps {
  const active = s.threadId === activeId;
  return {
    session: s,
    status: s.status,
    topStatus: s.topStatus,
    shouldRecede:
      !active &&
      s.status !== "input" &&
      (s.status === "working" || (s.status === "ready" && !s.unread && !s.woke)),
    isUnread: s.unread,
    isWoke: s.woke,
    isActive: active,
    isRenaming: false,
    isDragging: false,
    accessibleLabel: [s.title, s.projectName].join(", "),
    hoverCardDisabled: false,
    surface: { onClick: noop, onDoubleClick: noop, onKeyDown: noop, onContextMenu: noop },
    onSettle: noop,
    onCommitRename: noop,
    onCancelRename: noop,
    badge: badgeFor(s.project),
    hoverCard: hoverCard(s),
  };
}

function Card({ s, activeId }: { s: FixtureSession; activeId: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <SessionRowCard
      {...viewProps(s, activeId)}
      isPinned={s.pinned}
      dragOffset={0}
      dropVerb={null}
      settleShortcut="⌘⇧S"
      snoozeMenuOpen={menuOpen}
      onSnoozeMenuOpenChange={setMenuOpen}
      getSnoozePresets={() => SNOOZE_PRESETS}
      onPointerDown={noop}
      onSnooze={noop}
      onCustomSnooze={noop}
      onUnpin={noop}
      onAcknowledgeWoke={noop}
      workingDuration={workingDuration(s)}
      agentIcon={agentIcon(s.agent)}
    />
  );
}

function Slim({ s }: { s: FixtureSession }) {
  return (
    <SessionRowSlim
      {...viewProps(s, null)}
      onWake={noop}
      onUnsettle={noop}
      snoozeRemaining={s.snoozedUntil ? "3h" : null}
    />
  );
}

/** The window's corner, as desktop fills the header slot: room for the
 *  traffic lights, then the sidebar toggle. */
function Corner({ onToggle }: { onToggle?: () => void }) {
  return (
    <div className="flex h-9 shrink-0 items-center justify-end px-2">
      <IconButton icon={PanelLeft} label="Toggle sidebar" size="sm" onClick={onToggle} />
    </div>
  );
}

/** The project picker, as a plain button: desktop's opens a menu. */
function Picker() {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        className="flex h-7 min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-md px-2 text-sm text-foreground hover:bg-element-hover"
      >
        {badgeFor("atlas")}
        <span className="min-w-0 flex-1 truncate text-left">{PROJECTS.atlas.name}</span>
        <ChevronDown aria-hidden className="size-3 shrink-0 text-muted-foreground" />
      </button>
      <GlassIconButton icon={Plus} label="Add project" onClick={noop} />
    </div>
  );
}

interface DemoProps {
  sessions?: FixtureSession[];
  snoozed?: FixtureSession[];
  settled?: FixtureSession[];
  activeId?: string | null;
  initialQuery?: string;
}

function Sessions({
  sessions = SESSIONS,
  snoozed = SNOOZED,
  settled = SETTLED,
  activeId = "t-working",
  initialQuery = "",
}: DemoProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [highlight, setHighlight] = useState(0);
  const [snoozedOpen, setSnoozedOpen] = useState(false);
  const [settledOpen, setSettledOpen] = useState(false);
  const [settledSearch, setSettledSearch] = useState("");
  const searching = query.trim().length > 0;
  const all = [...sessions, ...snoozed, ...settled];
  const results = searching
    ? all.filter((s) => s.title.toLowerCase().includes(query.trim().toLowerCase()))
    : [];
  const pinned = sessions.filter((s) => s.pinned);
  const active = sessions.filter((s) => !s.pinned);
  const empty = all.length === 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SessionSidebarSearch
        searchInputRef={inputRef}
        searchQuery={query}
        onSearchQueryChange={setQuery}
        onSearchKeyDown={(event) => {
          if (event.key === "ArrowDown") setHighlight((i) => Math.min(i + 1, results.length - 1));
          if (event.key === "ArrowUp") setHighlight((i) => Math.max(i - 1, 0));
          if (event.key === "Escape") setQuery("");
        }}
        isSearching={searching}
        searchResultCount={results.length}
        activeSearchResultIndex={highlight}
        onClearSearch={() => setQuery("")}
        filter={<GlassIconButton icon={ArrowDownUp} label="Show sessions from" onClick={noop} />}
      />
      <TooltipPrimitive.Provider delay={150} closeDelay={0} timeout={400}>
        <SessionSidebarScroller>
          {searching ? (
            <SessionSidebarSearchResults query={query} count={results.length}>
              {results.map((s, index) => (
                <SessionSearchResult
                  key={s.threadId}
                  session={s}
                  resultId={sessionSearchResultId(index)}
                  isHighlighted={index === highlight}
                  isActive={s.threadId === activeId}
                  accessibleLabel={`${s.title}, ${s.projectName}`}
                  hoverCardDisabled={false}
                  badge={badgeFor(s.project)}
                  hoverCard={hoverCard(s)}
                  onHighlight={() => setHighlight(index)}
                  onSelect={noop}
                  onContextMenu={noop}
                />
              ))}
            </SessionSidebarSearchResults>
          ) : empty ? (
            <SessionSidebarEmpty
              hasProjects
              scopedProjectName={null}
              onAddProject={noop}
              onImportSessions={noop}
            />
          ) : (
            <>
              <div role="list" aria-label="Pinned sessions" className="flex flex-col">
                {pinned.map((s) => (
                  <Card key={s.threadId} s={s} activeId={activeId} />
                ))}
              </div>
              {pinned.length > 0 && active.length > 0 ? <SessionSidebarListDivider /> : null}
              <div role="list" aria-label="Active sessions" className="flex flex-col">
                {active.map((s) => (
                  <Card key={s.threadId} s={s} activeId={activeId} />
                ))}
              </div>
              {snoozed.length > 0 ? (
                <SessionSidebarSnoozedShelf
                  count={snoozed.length}
                  expanded={snoozedOpen}
                  onToggle={() => setSnoozedOpen(!snoozedOpen)}
                >
                  {snoozedOpen ? snoozed.map((s) => <Slim key={s.threadId} s={s} />) : null}
                </SessionSidebarSnoozedShelf>
              ) : null}
              {settled.length > 0 ? (
                <SessionSidebarSettledShelf
                  count={settled.length}
                  expanded={settledOpen}
                  onToggle={() => setSettledOpen(!settledOpen)}
                  search={settledSearch}
                  onSearchChange={setSettledSearch}
                  noMatches={false}
                  hiddenCount={0}
                  pageSize={20}
                  onShowMore={noop}
                >
                  {settledOpen ? settled.map((s) => <Slim key={s.threadId} s={s} />) : null}
                </SessionSidebarSettledShelf>
              ) : null}
            </>
          )}
        </SessionSidebarScroller>
      </TooltipPrimitive.Provider>
    </div>
  );
}

function Sidebar(props: DemoProps & { onToggle?: () => void }) {
  return (
    <SessionSidebar
      className="h-full"
      header={<Corner onToggle={props.onToggle} />}
      picker={<Picker />}
      destinations={
        <SessionSidebarDestinations>
          <Destinations />
        </SessionSidebarDestinations>
      }
      footer={
        <SessionSidebarDock trailing={<NotificationsBell />}>
          <DockItems />
        </SessionSidebarDock>
      }
    >
      <Sessions {...props} />
    </SessionSidebar>
  );
}

/** The sidebar at desktop's width, beside a stand-in for the session. */
function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-svh bg-background text-foreground">
      {children}
      <main className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        The session
      </main>
    </div>
  );
}

const meta = {
  title: "Shell/SessionSidebar",
  component: SessionSidebar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Desktop's left sidebar, props only: a header row, the picker, the labelled destinations, the sessions (search, pinned and active cards, the Snoozed and Settled shelves) and the footer dock. Every slot is the app's; these stories fill them with fixtures. Closed, the sidebar is gone and `SessionSidebarPeek` lays it over the content from the left edge.",
      },
    },
  },
} satisfies Meta<typeof SessionSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Frame>
      <div className="w-[244px] shrink-0">
        <Sidebar />
      </div>
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("navigation", { name: "Destinations" })).toBeVisible();
    await expect(canvas.getByRole("list", { name: "Active sessions" })).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: /Port the timeline's work log/ }),
    ).toHaveAttribute("aria-current", "true");
  },
};

export const ManySessions: Story = {
  render: () => (
    <Frame>
      <div className="w-[244px] shrink-0">
        <Sidebar sessions={manySessions(60)} activeId={null} />
      </div>
    </Frame>
  ),
};

export const LongTitles: Story = {
  render: () => (
    <Frame>
      <div className="w-[244px] shrink-0">
        <Sidebar sessions={SESSIONS.filter((s) => s.threadId === "t-long")} activeId="t-long" />
      </div>
    </Frame>
  ),
};

export const Empty: Story = {
  render: () => (
    <Frame>
      <div className="w-[244px] shrink-0">
        <Sidebar sessions={[]} snoozed={[]} settled={[]} />
      </div>
    </Frame>
  ),
};

export const Searching: Story = {
  render: () => (
    <Frame>
      <div className="w-[244px] shrink-0">
        <Sidebar initialQuery="port" />
      </div>
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("combobox", { name: "Search sessions" });
    await expect(field).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(canvas.getByRole("button", { name: "Clear session search" }));
    await expect(field).toHaveValue("");
  },
};

/** Closed, with the peek open: the same sidebar over the content. */
export const Peek: Story = {
  render: () => (
    <Frame>
      <SessionSidebarPeek open onRequest={noop} onHold={noop} onRelease={noop}>
        <Sidebar />
      </SessionSidebarPeek>
    </Frame>
  ),
};

/** Closed, the peek shut: only the edge strip is there, waiting for the pointer. */
export const Closed: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <Frame>
        <SessionSidebarPeek
          open={open}
          onRequest={() => setOpen(true)}
          onHold={noop}
          onRelease={() => setOpen(false)}
        >
          <Sidebar />
        </SessionSidebarPeek>
      </Frame>
    );
  },
};
