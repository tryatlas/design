"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import { Columns2Icon, PanelRightIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "../../lib/utils.ts";
import { SPRING_DOCK } from "../../lib/motion.ts";
import { useMeasure } from "../../lib/use-measure.ts";
import { IconButton } from "../../ui/icon-button.tsx";
import { SegmentedIconGroup } from "../patterns/segmented.tsx";

/**
 * The application frame: curved panels on a canvas, as the Atlas desktop app
 * draws it.
 *
 *   ┌ canvas ─────────────────────────────────────────────────────┐
 *   │ ┌─ sidebar ─┐ ┌──────────────────────────────┐ ┌─ dock ───┐ │
 *   │ │           │ │            page              │ │ (raised) │ │
 *   │ └───────────┘ └──────────────────────────────┘ └──────────┘ │
 *   └─────────────────────────────────────────────────────────────┘
 *
 * The canvas is `bg-sidebar`, a step darker than the page; the page is a
 * `rounded-xl` sheet on `background` with an opaque border, set into the
 * frame, which is where the depth comes from. The dock is the one panel on
 * `card`, a step up, so a selected record beside the page is visibly the
 * thing in focus.
 *
 * `h-dvh overflow-hidden`: the PAGE never scrolls. Scroll lives inside each
 * panel. The frame tracks the dynamic viewport, so a phone browser's
 * collapsing toolbar never leaves a gap under a composer pinned to the
 * bottom (`svh` is the height with the toolbar shown). Where there is no
 * such toolbar (a desktop webview or browser window) the two are equal.
 *
 * The frame is slots and layout only. It reads no storage, listens to no
 * keys and knows no routes: the sidebar, the bar shown below `lg` and any
 * overlay (a scrim, a drawer, ⌘K) are the caller's, and so is the dock's
 * size. The one thing it keeps is a borrow (`useSideDockRoom`), which is
 * deliberately not a choice anyone should remember.
 */

/**
 * The dock's two sizes:
 *
 *   compact  the reading width beside the page
 *   half     half the work area: the page and the dock share it
 */
export type SideDockMode = "compact" | "half";

/** The gap between the page and the dock: the dock's `ml-2`. */
const DOCK_GAP = 8;
/** The compact dock's reading width, `w-95`. Only the dock reads it, so it is
 *  a constant here rather than a token. */
const DOCK_WIDTH = "23.75rem";

type SideDockContextValue = {
  slot: HTMLElement | null;
  /** What the dock is drawn at: the chosen size, widened by any borrow. */
  mode: SideDockMode;
  /** A pick from the size control: reported to the app, and it ends every borrow. */
  setMode: (mode: SideDockMode) => void;
  borrow: (id: string) => void;
  release: (id: string) => void;
  /** Width of the work area (page + dock), in px. 0 outside a frame. */
  work: number;
  /** The frame's `inset`, so the dock meets the window's top edge as the page does. */
  inset: AppFrameInset;
};

/**
 * Where the frame's 8px gutter runs.
 *
 *   all    every side (the default): the panels float on the canvas.
 *   sides  left, right and bottom only. The panels run to the window's top
 *          edge, square and borderless there, so a titlebar row inside them
 *          sits at the window's top, where it was before the frame. On macOS
 *          with an overlay title bar the system draws the traffic lights at a
 *          fixed point from that edge, and an 8px top gutter would push the
 *          row they are centred in down by 8px.
 */
export type AppFrameInset = "all" | "sides";

const SideDockContext = createContext<SideDockContextValue>({
  slot: null,
  mode: "compact",
  setMode: () => {},
  borrow: () => {},
  release: () => {},
  work: 0,
  inset: "all",
});

/** The dock's drawn size and the setter its size control uses. */
function useSideDock(): { mode: SideDockMode; setMode: (mode: SideDockMode) => void } {
  const { mode, setMode } = useContext(SideDockContext);
  return { mode, setMode };
}

/**
 * Borrow room from the dock for something that will not fit in it: a panel
 * that grows out of a button, a draft being written. `expand()` widens a
 * compact dock to half and returns how long to wait before measuring the
 * wider dock (0 when there was nothing to do, or no frame). The resize is one
 * layout step, not an animation, so that is one frame. `restore()` gives the
 * room back, unmounting does too, and a pick from the size control ends every
 * borrow: the room is the person's then.
 *
 * A borrow never reaches `onDockModeChange`, so it can never become the size
 * the app remembers and the dock next opens at.
 */
function useSideDockRoom(): { expand: () => number; restore: () => void } {
  const { mode, borrow, release, work } = useContext(SideDockContext);
  const id = useId();
  const expand = useCallback(() => {
    if (work === 0 || mode !== "compact") return 0;
    borrow(id);
    return 16;
  }, [borrow, id, mode, work]);
  const restore = useCallback(() => release(id), [release, id]);
  useEffect(() => () => release(id), [release, id]);
  return { expand, restore };
}

/**
 * The dock: a panel beside the page that a screen fills by rendering
 * `<SideDock>` anywhere inside the frame, which portals into the frame's
 * slot. A portal rather than a prop because the frame lives in the app's
 * layout and the dock's contents are the screen's own state. Children make it
 * open; none make it close.
 *
 * `instant` opens and closes it with no slide and no fade: for a dock toggled
 * from the keyboard (⌘J), where an entrance on every press reads as latency.
 */
function SideDock({ children, instant = false }: { children?: ReactNode; instant?: boolean }) {
  const { slot } = useContext(SideDockContext);
  if (!slot) return null;
  return createPortal(
    <AnimatePresence initial={false}>
      {children && (
        <SideDockPanel key="dock" instant={instant}>
          {children}
        </SideDockPanel>
      )}
    </AnimatePresence>,
    slot,
  );
}

/**
 * The dock moves by transform, not width. Animating `width` re-lays out the
 * page beside it on every frame, and the page is the busiest thing on
 * screen, often while a session streams. So the layout changes once and the
 * motion is composited:
 *
 *  - Entering, the dock takes its full width at once (the page narrows in
 *    one step) and slides in from 24px right of its place as it fades in,
 *    on `SPRING_DOCK`, which is critically damped.
 *  - Leaving, it is taken out of the flow first (`absolute`, pinned to the
 *    right edge), so the page widens in one step underneath it, and it
 *    slides back out to the right the way it came while fading.
 *  - Changing size (compact ↔ half) is a single layout step, not animated:
 *    tweening it would mean animating width again.
 *
 * Reduced motion drops the slide and keeps the fade. The transform is a full
 * string rather than motion's `x`, which motion can hand to the compositor.
 */
function SideDockPanel({ children, instant }: { children: ReactNode; instant: boolean }) {
  const { mode, work, inset } = useContext(SideDockContext);
  const isPresent = useIsPresent();
  const still = useReducedMotion();
  const width = mode === "half" && work ? Math.round((work - DOCK_GAP) / 2) : DOCK_WIDTH;
  const away = still ? "translateX(0px)" : "translateX(24px)";

  return (
    <motion.aside
      data-slot="dock"
      data-mode={mode}
      data-panel=""
      initial={{ opacity: 0, transform: away }}
      animate={{ opacity: 1, transform: "translateX(0px)" }}
      exit={{ opacity: 0, transform: away }}
      transition={instant ? { duration: 0 } : SPRING_DOCK}
      style={{ width }}
      className={cn(
        "z-panel flex h-full shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-card max-lg:hidden",
        isPresent ? "relative ml-2" : "absolute inset-y-0 right-0",
        inset === "sides" && "rounded-t-none border-t-0",
      )}
    >
      <div className="@container flex min-h-0 w-full min-w-95 flex-1 flex-col">{children}</div>
    </motion.aside>
  );
}

const DOCK_SIZES: Array<{ mode: SideDockMode; icon: LucideIcon; label: string }> = [
  { mode: "compact", icon: PanelRightIcon, label: "Compact panel" },
  { mode: "half", icon: Columns2Icon, label: "Half-width panel" },
];

/** The two dock sizes as one segmented control, for a dock's header. */
function SideDockSizeToggle({ className }: { className?: string }) {
  const { mode, setMode } = useSideDock();
  return (
    <SegmentedIconGroup className={className}>
      {DOCK_SIZES.map((s) => (
        <IconButton
          key={s.mode}
          icon={s.icon}
          label={s.label}
          size="xs"
          aria-pressed={mode === s.mode}
          onClick={() => setMode(s.mode)}
        />
      ))}
    </SegmentedIconGroup>
  );
}

function AppFrame({
  sidebar,
  topBar,
  overlay,
  dockMode,
  onDockModeChange,
  inset = "all",
  className,
  children,
}: {
  /** The rail: a `Sidebar`, with `lg:mr-2` for the gap to the page. */
  sidebar: ReactNode;
  /** A bar above the panels, for below `lg` where the rail is a drawer and
   *  something has to open it. Hide it at `lg` yourself (`lg:hidden`). */
  topBar?: ReactNode;
  /** Anything over the frame: a drawer's scrim, ⌘K. */
  overlay?: ReactNode;
  /** The dock size the person chose. The app keeps it (and remembers it, if
   *  it wants); the frame only reports a new pick. */
  dockMode: SideDockMode;
  onDockModeChange: (mode: SideDockMode) => void;
  /**
   * Where the 8px gutter runs: `all` sides (the default), or `sides` only, so
   * the panels meet the window's top edge and a titlebar row inside them
   * stays where the macOS traffic lights are drawn. A `sidebar` in the frame
   * meets the top edge too; square its top corners to match the page.
   */
  inset?: AppFrameInset;
  className?: string;
  /** The page. */
  children: ReactNode;
}) {
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [borrowers, setBorrowers] = useState<ReadonlyArray<string>>([]);
  // The work area is the page + dock row; the half dock is a fraction of it.
  // Measured through a callback ref, not a ref read once in an effect: when
  // the frame remounts (a hot reload, a route that rebuilds it) the observer
  // must follow the new element, or "half" silently falls back to compact.
  const [workRef, workRect] = useMeasure<HTMLDivElement>();
  const work = Math.round(workRect.width);

  const borrow = useCallback(
    (id: string) => setBorrowers((b) => (b.includes(id) ? b : [...b, id])),
    [],
  );
  const release = useCallback(
    (id: string) => setBorrowers((b) => (b.includes(id) ? b.filter((x) => x !== id) : b)),
    [],
  );
  const setMode = useCallback(
    (next: SideDockMode) => {
      setBorrowers([]);
      onDockModeChange(next);
    },
    [onDockModeChange],
  );
  const mode: SideDockMode = dockMode === "compact" && borrowers.length > 0 ? "half" : dockMode;

  const dock = useMemo(
    () => ({ slot, mode, setMode, borrow, release, work, inset }),
    [slot, mode, setMode, borrow, release, work, inset],
  );

  return (
    <SideDockContext.Provider value={dock}>
      <div
        data-slot="app-frame"
        data-inset={inset === "sides" ? inset : undefined}
        className={cn("flex h-dvh w-full flex-col overflow-hidden bg-sidebar", className)}
      >
        {overlay}
        {topBar}
        <div
          className={cn(
            "flex min-h-0 flex-1 p-2",
            topBar != null && "max-lg:pt-0",
            inset === "sides" && "pt-0",
          )}
        >
          {sidebar}

          {/* The work area: the page and the dock share it. `relative`: a
              leaving dock is pinned to its right edge. */}
          <div ref={workRef} className="relative flex min-h-0 min-w-0 flex-1">
            <main
              className={cn(
                "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-background",
                inset === "sides" && "rounded-t-none border-t-0",
              )}
            >
              {children}
            </main>
            <div ref={setSlot} className="contents" />
          </div>
        </div>
      </div>
    </SideDockContext.Provider>
  );
}

export { AppFrame, SideDock, SideDockSizeToggle, useSideDock, useSideDockRoom };
