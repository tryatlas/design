import { type ReactNode, type Ref } from "react";
import { type CommandPaletteGroup, type CommandPaletteItem } from "./command-list.ts";
/**
 * The palettes ⌘K, ⌘P and the new-tab palette are, on the `Command` shell
 * (`src/ui/command.tsx`). Copied from desktop's `command-palette-content.tsx`
 * and the view stack in `command-palette.tsx` (ADR-0027), with the stores
 * left behind: everything arrives as props.
 *
 * Three layers, each usable alone:
 *
 *   CommandList         the rows. Controlled (`activeId`), never takes focus,
 *                       never listens for keys — so an editor that keeps DOM
 *                       focus (a slash or mention picker) can drive it.
 *   CommandPaletteView  the field, the list and the key legend, with the
 *                       keyboard model. No dialog: a host dialog that swaps
 *                       views (desktop's ⌘K ⇄ ⌘P) mounts one per view.
 *   CommandPalette      the dialog, the filter and the submenu stack.
 *
 * The keyboard model: the field keeps focus and names the highlighted row as
 * its active descendant; ↑/↓ step the highlight over the enabled rows,
 * wrapping; Enter runs it; Backspace on an empty field, or Escape, goes back
 * out of a submenu. A new query highlights the first row again. The pointer
 * highlights a row only when it actually moves.
 *
 * No open, close or highlight animation, on purpose: a palette opens hundreds
 * of times a day, and motion on a keyboard action reads as latency. Nothing
 * moves, so there is nothing for reduced motion to take away.
 */
/** The rows, grouped, with the keyboard highlight the caller owns. */
declare function CommandList({ id, groups, activeId, onPoint, onRun, emptyMessage, loading, size, className, ref, ...aria }: {
    /** The listbox's id: the field's `aria-controls`, and the root of every
     *  row's id (`optionId(id, item.id)`). */
    id: string;
    /** The listbox's name. A list driven by a plain field (not a `combobox`)
     *  needs one; inside the palette the field names it. */
    "aria-label"?: string;
    "aria-labelledby"?: string;
    groups: ReadonlyArray<CommandPaletteGroup>;
    /** The highlighted row's `item.id`. */
    activeId: string | null;
    /** From a row's `onPointerMove`: hand it to `useListHighlight().pointTo`. */
    onPoint?: (itemId: string, x: number, y: number) => void;
    /** A click on an enabled row. */
    onRun: (item: CommandPaletteItem) => void;
    emptyMessage?: ReactNode;
    /** With no rows yet, three placeholder rows; with rows, nothing extra. */
    loading?: boolean;
    size?: "default" | "tall";
    className?: string;
    ref?: Ref<HTMLDivElement>;
}): import("react").JSX.Element;
/** One row: icon, title (and description), then timestamp, trailing,
 *  shortcut and a submenu's chevron on the right. */
declare function CommandRow({ id, item, active, onPoint, onRun, }: {
    id: string;
    item: CommandPaletteItem;
    active: boolean;
    onPoint?: (x: number, y: number) => void;
    onRun: (item: CommandPaletteItem) => void;
}): import("react").JSX.Element;
/** The key legend: Navigate, then Enter, Backspace and Esc as they apply,
 *  and `trailing` at the far end. */
declare function CommandHints({ actionLabel, backLabel, escapeLabel, extra, trailing, }: {
    /** The Enter hint's label; omitted, the hint is left out. */
    actionLabel?: string;
    /** The Backspace hint's label; omitted, the hint is left out. */
    backLabel?: string;
    escapeLabel?: string;
    /** More hints, after Backspace. */
    extra?: ReactNode;
    trailing?: ReactNode;
}): import("react").JSX.Element;
interface CommandPaletteViewProps {
    /** The rows to show, already filtered (`filterCommandGroups`). */
    groups: ReadonlyArray<CommandPaletteGroup>;
    query: string;
    onQueryChange: (query: string) => void;
    /** Enter, or a click, on an enabled row. */
    onRun: (item: CommandPaletteItem) => void;
    placeholder?: string;
    /** Shown when there are no rows. */
    emptyMessage?: ReactNode;
    /** No rows yet and more to come: placeholder rows and a spinner. */
    loading?: boolean;
    /** The Enter hint's label; omitted, the hint is left out. */
    actionLabel?: string;
    escapeLabel?: string;
    /** Backspace on an empty field calls this, and its hint shows (a
     *  submenu's way out). */
    onBack?: () => void;
    /**
     * A step that runs on the field's text rather than a row (a clone URL, a
     * new project's name): ⌘/Ctrl+Enter always calls it, and Enter does when
     * no row is highlighted.
     */
    onSubmit?: (opts: {
        mod: boolean;
    }) => void;
    /** Replaces the magnifier: a submenu's back arrow. */
    startAddon?: ReactNode;
    /** At the field's right end: a step's primary action ("Create ⌘ Enter"). */
    endAddon?: ReactNode;
    /** At the far end of the key legend (⌘P's "Reindex"). */
    footerTrailing?: ReactNode;
    /** Leave the legend out. */
    hints?: boolean;
    size?: "default" | "tall";
    disabled?: boolean;
    /** Take focus on mount (default). Off when the host places focus itself. */
    claimFocus?: boolean;
    /** The listbox's id; generated when omitted. */
    listId?: string;
}
/** The field, the list and the legend, with the keyboard model. */
declare function CommandPaletteView(props: CommandPaletteViewProps): import("react").JSX.Element;
interface CommandPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** The root's rows. A row with `groups` is a submenu. */
    groups: ReadonlyArray<CommandPaletteGroup>;
    /** The dialog's accessible name. */
    title?: string;
    placeholder?: string;
    /** The placeholder inside a submenu that names none. */
    submenuPlaceholder?: string;
    /** Shown when nothing matches; a function gets the query. */
    emptyMessage?: ReactNode | ((query: string) => ReactNode);
    /** The Enter hint's label. */
    actionLabel?: string;
    /** Filter and rank the rows by the query (default). Off, the rows are
     *  shown as given — for a caller that searches elsewhere (a backend). */
    filter?: boolean;
    /** The query, for a caller that searches elsewhere. Uncontrolled when
     *  omitted; either way it starts empty on every open. */
    onQueryChange?: (query: string) => void;
    /** Rows are on their way: placeholder rows and a spinner. */
    loading?: boolean;
    /** Called with every row run, before its own `onSelect`. */
    onRun?: (item: CommandPaletteItem) => void;
    hints?: boolean;
    size?: "default" | "tall";
}
/**
 * ⌘K: the dialog, the filter and the submenu stack, over `CommandPaletteView`.
 *
 * Running a row: a disabled row does nothing; a submenu row drills in, its
 * query starting empty (Backspace or Escape restores the parent's); any other row asks to close (unless `keepOpen`), then calls
 * `onRun` and its own `onSelect`. Escape and Backspace-on-empty go back out
 * of a submenu; Escape at the root closes. The query and the stack live in
 * the dialog's popup, which unmounts on close, so every open starts fresh.
 */
declare function CommandPalette({ open, onOpenChange, title, ...props }: CommandPaletteProps): import("react").JSX.Element;
export { CommandHints, CommandList, CommandPalette, CommandPaletteView, CommandRow };
export type { CommandPaletteProps, CommandPaletteViewProps };
//# sourceMappingURL=command-palette.d.ts.map