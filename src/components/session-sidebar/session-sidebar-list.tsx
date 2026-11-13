"use client";

import type {
  ComponentProps,
  KeyboardEvent,
  ReactNode,
  Ref,
  RefObject,
  UIEventHandler,
} from "react";
import { ChevronDown, Plus, Search, X } from "lucide-react";

import { cn } from "../../lib/utils.ts";
import { Icon } from "../../ui/icon.tsx";

/**
 * The session sidebar's list, around the rows (`session-row.tsx`): the
 * search header, the scroller with its top fade, the pinned block's drop
 * zone and divider, the section headings, the Snoozed and Settled shelves,
 * the search results, and the empty and error states. Props only; the app
 * owns the list itself (its order, its virtual window, its drag, its keys).
 */

/** The search results listbox's id, which the search field controls. */
export const SESSION_SEARCH_RESULTS_ID = "sidebar-session-search-results";
/** A search result's DOM id: the field's `aria-activedescendant`. */
export const sessionSearchResultId = (index: number) => `sidebar-session-search-result-${index}`;

export interface SessionSidebarSearchProps {
  searchInputRef: RefObject<HTMLInputElement | null>;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearchKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  isSearching: boolean;
  searchResultCount: number;
  activeSearchResultIndex: number;
  onClearSearch: () => void;
  /** After the field: the project filter. */
  filter?: ReactNode;
}

/**
 * The list's header: search across every session, and a filter after it.
 * The search is a combobox over the list below it: typing swaps the sections
 * for results (`SessionSidebarSearchResults`), the arrow keys move a
 * highlight through them while the field keeps focus, Enter opens the
 * highlighted one and Escape clears. The keys are the app's
 * (`onSearchKeyDown`).
 */
export function SessionSidebarSearch(props: SessionSidebarSearchProps) {
  const {
    searchInputRef,
    searchQuery,
    onSearchQueryChange,
    onSearchKeyDown,
    isSearching,
    searchResultCount,
    activeSearchResultIndex,
    onClearSearch,
  } = props;
  const resultsVisible = isSearching && searchResultCount > 0;
  // Results shrink as the query narrows, so the active index can outrun the
  // list; pointing aria-activedescendant at a removed option strands the
  // screen reader on nothing.
  const activeResultExists = resultsVisible && activeSearchResultIndex < searchResultCount;
  return (
    // The sidebar's own inset and the destinations' row, so the search glyph
    // sits in their icon column (`SessionSidebarDestination`).
    <div className="flex items-center gap-1 px-[8px]">
      <label className="flex h-7 min-w-0 flex-1 cursor-text items-center gap-2.5 rounded-md px-2 text-sm text-muted-foreground hover:bg-element-hover hover:text-foreground focus-within:bg-element-hover">
        <Icon icon={Search} size="md" aria-hidden className="shrink-0" />
        <input
          ref={searchInputRef}
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.currentTarget.value)}
          onKeyDown={onSearchKeyDown}
          placeholder="Search sessions"
          aria-label="Search sessions"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={resultsVisible}
          aria-controls={resultsVisible ? SESSION_SEARCH_RESULTS_ID : undefined}
          aria-activedescendant={
            activeResultExists ? sessionSearchResultId(activeSearchResultIndex) : undefined
          }
          className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
        />
        {isSearching ? (
          <button
            type="button"
            aria-label="Clear session search"
            onClick={() => {
              onClearSearch();
              searchInputRef.current?.focus();
            }}
            className="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
          >
            <X aria-hidden className="size-3" />
          </button>
        ) : null}
      </label>
      {props.filter ? <div className="flex shrink-0 items-center">{props.filter}</div> : null}
    </div>
  );
}

/**
 * The list's scroller, under the search row, with a short fade from the
 * sidebar's colour along its top edge so rows scroll out under the header
 * rather than being cut by it — the dock's fade, mirrored. The fade is over
 * the scroller, not in it, so it stays put while the rows move. The room
 * between it and the header is the scroller's top padding, so rows scroll
 * right up to the header.
 */
export function SessionSidebarScroller({
  ref,
  onKeyDown,
  onScroll,
  children,
}: {
  ref?: Ref<HTMLDivElement>;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  onScroll?: UIEventHandler<HTMLDivElement>;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-panel h-4 bg-gradient-to-b from-sidebar to-transparent"
      />
      <div
        ref={ref}
        onKeyDown={onKeyDown}
        onScroll={onScroll}
        className="scrollbar-hidden relative min-h-0 flex-1 overflow-y-auto px-2 pt-1.5 pb-2"
      >
        {children}
      </div>
    </div>
  );
}

/** Where a dragged session lands to be pinned, while nothing is pinned yet.
 *  `over`: the drag is on it. A list item of the pinned list. */
export function SessionSidebarPinDropZone({ over }: { over: boolean }) {
  return (
    <div
      role="listitem"
      className={cn(
        "flex h-9 items-center justify-center rounded-md border border-dashed text-xs",
        over
          ? "border-primary/40 bg-primary/5 text-primary"
          : "border-border text-muted-foreground",
      )}
    >
      Drop to pin
    </div>
  );
}

/** The hairline between the pinned block and the active list. */
export function SessionSidebarListDivider() {
  return <div aria-hidden className="mx-2 my-1 h-px bg-border-subtle" />;
}

const tones = {
  muted: { label: "text-muted-foreground", line: "bg-border-subtle" },
  accent: { label: "text-primary", line: "bg-primary/50" },
  info: { label: "text-info", line: "bg-info/40" },
} as const;

export type SessionSidebarSectionTone = keyof typeof tones;

/** A section heading that collapses its section: the label, a hairline to
 *  the edge, and a chevron. The shelves' toggle. */
export function CollapsibleSectionHeader({
  children,
  expanded,
  tone = "muted",
  accessory,
  size = "md",
  ...buttonProps
}: Omit<ComponentProps<"button">, "className" | "style" | "aria-expanded"> & {
  expanded: boolean;
  tone?: SessionSidebarSectionTone;
  /** Before the chevron: a count, a control. */
  accessory?: ReactNode;
  /** `sm`: a step smaller, for a narrower rail. */
  size?: "md" | "sm";
}) {
  return (
    <button
      {...buttonProps}
      type="button"
      aria-expanded={expanded}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-md px-2 text-left font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        size === "sm" ? "h-7 text-2xs" : "h-8 text-xs",
        tones[tone].label,
      )}
    >
      <span className="shrink-0">{children}</span>
      <span aria-hidden className={cn("h-px min-w-2 flex-1", tones[tone].line)} />
      {accessory}
      <ChevronDown
        aria-hidden
        className={cn("size-3 shrink-0 transition-transform", !expanded && "rotate-180")}
      />
    </button>
  );
}

/** A static heading for a section that does not collapse, and the drop
 *  boundary a drag lights up ("Drop to unpin", `tone="accent"`). */
export function SessionSidebarSectionLabel({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: SessionSidebarSectionTone;
}) {
  return (
    <div className={cn("flex h-7 items-center gap-2 px-2 text-xs font-medium", tones[tone].label)}>
      <span className="shrink-0">{children}</span>
      <span aria-hidden className={cn("h-px min-w-2 flex-1", tones[tone].line)} />
    </div>
  );
}

/** The search's results: `count` `SessionSearchResult`s as `children`, or
 *  the line that says nothing matched. */
export function SessionSidebarSearchResults({
  query,
  count,
  children,
}: {
  query: string;
  count: number;
  children: ReactNode;
}) {
  if (count === 0) {
    return (
      <div className="px-2 py-6 text-center text-xs text-muted-foreground">
        No sessions match “{query.trim()}”.
      </div>
    );
  }
  return (
    <ul
      id={SESSION_SEARCH_RESULTS_ID}
      role="listbox"
      aria-label="Search results"
      className="flex flex-col"
    >
      {children}
    </ul>
  );
}

/** The Snoozed shelf: soonest to wake first, its rows `SessionRowSlim`s.
 *  `role="list"` on a <div>, as on every list here: WebKit drops a <ul>'s
 *  list role once its markers are styled away. */
export function SessionSidebarSnoozedShelf({
  count,
  expanded,
  onToggle,
  children,
}: {
  count: number;
  expanded: boolean;
  onToggle: () => void;
  /** The rows showing: none while collapsed, unless one is open. */
  children: ReactNode;
}) {
  return (
    <div className="mt-2">
      <CollapsibleSectionHeader
        expanded={expanded}
        tone="info"
        onClick={onToggle}
        data-testid="sidebar-snoozed-shelf-toggle"
      >
        {expanded ? "Snoozed" : `Snoozed (${count})`}
      </CollapsibleSectionHeader>
      <div role="list" aria-label="Snoozed sessions" className="flex flex-col">
        {children}
      </div>
    </div>
  );
}

/** The Settled shelf: its own search while open, a page of rows at a time
 *  and "Show N more" past it. */
export function SessionSidebarSettledShelf({
  count,
  expanded,
  onToggle,
  search,
  onSearchChange,
  children,
  noMatches,
  hiddenCount,
  pageSize,
  onShowMore,
}: {
  count: number;
  expanded: boolean;
  onToggle: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  /** The rows showing. */
  children: ReactNode;
  /** The shelf's search matched nothing. */
  noMatches: boolean;
  /** Rows past the shelf's current page; `0` hides "Show more". */
  hiddenCount: number;
  pageSize: number;
  onShowMore: () => void;
}) {
  return (
    <div className="mt-2">
      <CollapsibleSectionHeader
        expanded={expanded}
        onClick={onToggle}
        data-testid="sidebar-settled-shelf-toggle"
      >
        {expanded ? "Settled" : `Settled (${count})`}
      </CollapsibleSectionHeader>
      {expanded ? (
        <label className="mx-0.5 mb-1 flex h-7 cursor-text items-center gap-2 rounded-md px-2 text-muted-foreground hover:bg-element-hover focus-within:bg-element-hover">
          <Search aria-hidden className="size-3 shrink-0" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape" && search) {
                event.preventDefault();
                event.stopPropagation();
                onSearchChange("");
              }
            }}
            placeholder="Search settled"
            aria-label="Search settled sessions"
            className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
          />
          {search ? (
            <button
              type="button"
              aria-label="Clear settled search"
              onClick={() => onSearchChange("")}
              className="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm hover:text-foreground"
            >
              <X aria-hidden className="size-3" />
            </button>
          ) : null}
        </label>
      ) : null}
      <div role="list" aria-label="Settled sessions" className="flex flex-col">
        {children}
        {noMatches ? (
          <div role="listitem" className="px-2.5 py-2 text-xs text-muted-foreground">
            No settled sessions match.
          </div>
        ) : null}
        {hiddenCount > 0 ? (
          <div role="listitem">
            <button
              type="button"
              onClick={onShowMore}
              className="flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-left text-sm text-muted-foreground hover:bg-element-hover hover:text-foreground"
            >
              <Plus aria-hidden className="size-4 shrink-0" />
              Show {Math.min(hiddenCount, pageSize)} more
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** The list could not be read. */
export function SessionSidebarError({ error }: { error: string }) {
  return (
    <div className="px-2 py-6 text-center text-xs text-error">
      Couldn't read session history: {error}
    </div>
  );
}

/** No sessions at all: offer the first step — a project, or an import. */
export function SessionSidebarEmpty({
  hasProjects,
  scopedProjectName,
  onAddProject,
  onImportSessions,
}: {
  hasProjects: boolean;
  /** The project filter's project, when the list is filtered to one. */
  scopedProjectName: string | null;
  onAddProject: () => void;
  onImportSessions: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-2 py-6 text-center text-xs text-muted-foreground">
      {!hasProjects ? (
        <>
          <span>No projects yet</span>
          <button
            type="button"
            onClick={onAddProject}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-2xs font-medium text-secondary-foreground transition-colors hover:bg-element-hover hover:text-foreground"
          >
            <Plus aria-hidden className="-mx-0.5 size-3" />
            Add project
          </button>
        </>
      ) : scopedProjectName !== null ? (
        `No sessions in ${scopedProjectName} yet`
      ) : (
        <>
          <span>No sessions yet</span>
          <button
            type="button"
            onClick={onImportSessions}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-2xs font-medium text-secondary-foreground transition-colors hover:bg-element-hover hover:text-foreground"
          >
            Import sessions from agents…
          </button>
        </>
      )}
    </div>
  );
}
