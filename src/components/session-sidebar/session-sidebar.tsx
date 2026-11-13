"use client";

import type { ComponentProps, ReactNode, Ref } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "../../lib/utils.ts";
import { Icon } from "../../ui/icon.tsx";
import { Hint } from "../../ui/tooltip.tsx";

/**
 * The session sidebar: the app's one left column, full height, sessions
 * first. Desktop's look, props only, so any app can draw the same sidebar
 * over its own data.
 *
 * Top to bottom: the header row (on desktop, the window's corner: traffic
 * lights, the sidebar toggle, search), the picker (a project or organisation
 * switcher), the labelled destinations, the sessions (`children`: the
 * search, the scroller and its rows, anything after them), and last the
 * footer dock of icons. Each is a slot; the app fills it and owns what it
 * does. The parts below are what desktop fills them with.
 *
 * Docking and hiding do not animate: the toggle is pressed many times a day.
 * Only the peek (`SessionSidebarPeek`) slides, because it comes and goes
 * under the pointer and has to read as laid over the content rather than
 * replacing it.
 *
 * The surface is `bg-sidebar` with a hairline on the right. An app with a
 * divider colour of its own sets it on `[data-slot="session-sidebar"]` in
 * its stylesheet (desktop does), rather than restyling through `className`.
 */
export function SessionSidebar({
  header,
  picker,
  destinations,
  footer,
  children,
  className,
  ...props
}: Omit<ComponentProps<"aside">, "children"> & {
  /** The top row, drawn as given: the app sets its height and any window
   *  drag on it. */
  header?: ReactNode;
  /** Under the header: the project or organisation picker. */
  picker?: ReactNode;
  /** `SessionSidebarDestinations`. */
  destinations?: ReactNode;
  /** `SessionSidebarDock`. */
  footer?: ReactNode;
  /** The sessions: a flex column that takes the room left over. */
  children?: ReactNode;
}) {
  return (
    <aside
      data-slot="session-sidebar"
      {...props}
      className={cn(
        "flex h-screen w-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar inset-highlight",
        className,
      )}
    >
      {header}
      {/* Room under the header, so the picker reads as the start of the
          sidebar's content, not part of the window's controls. */}
      {picker ? <div className="px-[8px] pt-[0.35rem]">{picker}</div> : null}
      {/* More room below than above: the destinations are a block of their
          own, and the session search under them starts the next one. */}
      {destinations ? <div className="mt-1 mb-4">{destinations}</div> : null}
      {children}
      {footer}
    </aside>
  );
}

/** The labelled destinations: the views reached most often, a column of
 *  `SessionSidebarDestination`s. */
export function SessionSidebarDestinations({
  children,
  "aria-label": ariaLabel = "Destinations",
}: {
  children: ReactNode;
  "aria-label"?: string;
}) {
  return (
    <nav aria-label={ariaLabel} className="flex shrink-0 flex-col items-start gap-0.5 px-[8px]">
      {children}
    </nav>
  );
}

/**
 * One destination: an icon and its label, lit while its view is on screen.
 * `iconOnly` drops the label to the tooltip, for the footer dock.
 *
 * No motion: pressed many times a day, and the view it opens is the
 * feedback. Hover is a colour step only.
 */
export function SessionSidebarDestination({
  icon: IconGlyph,
  label,
  hint,
  active,
  locked,
  dot,
  disabled,
  iconOnly,
  round,
  hintSide,
  className,
  ...props
}: Omit<ComponentProps<"button">, "children"> & {
  icon: LucideIcon;
  label: string;
  /** The tooltip, when it says more than the label (why it is disabled). */
  hint?: string;
  /** Its view is the one showing. */
  active?: boolean;
  /** What unlocks a destination this button cannot open yet. The button stays
   *  clickable (the click is the unlock, where there is one) and greyed. */
  locked?: string;
  /** A dot on the icon: something unread behind it. */
  dot?: boolean;
  /** A square, the label only in the tooltip. */
  iconOnly?: boolean;
  /** A circle rather than a rounded square: the dock's buttons, inside its
   *  capsule. */
  round?: boolean;
  hintSide?: "top" | "right" | "bottom";
}) {
  // An icon-only button always has a tooltip: it is the only place the label
  // is written.
  const tip = locked ?? hint ?? (iconOnly ? label : undefined);
  const button = (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      aria-disabled={locked ? true : undefined}
      data-locked={locked ? "" : undefined}
      disabled={disabled}
      className={cn(
        "flex shrink-0 cursor-pointer items-center text-muted-foreground outline-none transition-colors duration-fast ease-out-strong",
        "hover:bg-element-hover hover:text-foreground focus-visible:bg-element-hover focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        "disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground",
        "data-locked:opacity-50",
        round ? "rounded-full" : "rounded-md",
        iconOnly ? "size-7 justify-center" : "h-7 w-full gap-2.5 px-2",
        active && "bg-element-active text-foreground hover:bg-element-active",
        className,
      )}
      {...props}
    >
      <span className="relative flex shrink-0 items-center justify-center">
        <Icon icon={IconGlyph} size="md" aria-hidden />
        {dot && (
          <span
            data-testid="rail-dot"
            className="pointer-events-none absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-foreground"
          />
        )}
      </span>
      {iconOnly ? null : <span className="min-w-0 truncate text-sm leading-none">{label}</span>}
    </button>
  );
  if (!tip) return button;
  return (
    <Hint label={tip} side={hintSide ?? (iconOnly ? "top" : "right")}>
      {button}
    </Hint>
  );
}

/**
 * The sidebar's last row: a pill of icon-only destinations (`children`),
 * and `trailing` (the notification bell) in a capsule of its own at the far
 * end, the same glass, so the row reads as two pieces of one set. A short
 * fade from the sidebar's colour separates the scrolling session list from
 * it. Give the dock's buttons `iconOnly` and `round`.
 */
export function SessionSidebarDock({
  children,
  trailing,
  "aria-label": ariaLabel = "Sidebar tools",
}: {
  children: ReactNode;
  trailing?: ReactNode;
  "aria-label"?: string;
}) {
  return (
    <nav
      aria-label={ariaLabel}
      className="relative flex shrink-0 items-center gap-0.5 px-[8px] pb-2 pt-1 before:pointer-events-none before:absolute before:inset-x-0 before:-top-4 before:h-4 before:bg-gradient-to-t before:from-sidebar before:to-transparent"
    >
      <div className="glass-rim flex items-center gap-0.5 rounded-full p-0.5">{children}</div>
      {trailing ? (
        <div className="glass-rim ml-auto flex items-center rounded-full p-0.5">{trailing}</div>
      ) : null}
    </nav>
  );
}

/**
 * A round icon button with the dock's glass rim: the sidebar's standalone
 * actions (Add project beside the picker, the session filter) drawn as small
 * capsules of the same glass as the dock. `pressed` is a toggle's on state:
 * the fill lifts.
 */
export function GlassIconButton({
  icon,
  label,
  shortcut,
  disabled,
  pressed,
  onClick,
  className,
}: {
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  pressed?: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <Hint label={label} shortcut={shortcut} side="bottom">
      <button
        type="button"
        aria-label={label}
        disabled={disabled}
        aria-pressed={pressed}
        onClick={onClick}
        className={cn(
          "glass-rim glass-rim-control flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground outline-none transition-colors duration-fast",
          "hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default disabled:opacity-40",
          pressed && "text-foreground",
          className,
        )}
      >
        <Icon icon={icon} size="sm" aria-hidden />
      </button>
    </Hint>
  );
}

/**
 * The closed sidebar: a strip along the container's left edge that asks for
 * a peek, and the peek itself — the sidebar (`children`) laid over the
 * content at the width it docks to, sliding in. Absolutely placed: put it in
 * the positioned frame the sidebar docks into.
 *
 * Controlled. The app owns the timing (a short rest before it opens, a beat
 * before it goes, held while a menu opened from it is up) and Escape:
 * `onRequest` is the pointer reaching the edge, `onHold` the pointer on the
 * panel, `onRelease` it leaving either. `panelRef` is the open panel, for
 * asking whether the pointer is still on it.
 */
export function SessionSidebarPeek({
  open,
  panelRef,
  onRequest,
  onHold,
  onRelease,
  edgeClassName,
  children,
}: {
  open: boolean;
  panelRef?: Ref<HTMLDivElement>;
  onRequest: () => void;
  onHold: () => void;
  onRelease: () => void;
  /** Where the edge strip starts, when not at the top (below a title bar, so
   *  it never sits on the window's controls). */
  edgeClassName?: string;
  children: ReactNode;
}) {
  return (
    <>
      <div
        aria-hidden
        className={cn("absolute bottom-0 left-0 top-0 z-drawer w-2", edgeClassName)}
        onPointerEnter={onRequest}
        onPointerLeave={onRelease}
      />
      {open && (
        <div
          ref={panelRef}
          className="absolute inset-y-0 left-0 z-drawer w-[244px] shadow-md motion-safe:animate-slide-in-left"
          onPointerEnter={onHold}
          onPointerLeave={onRelease}
        >
          {children}
        </div>
      )}
    </>
  );
}
