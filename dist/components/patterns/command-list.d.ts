import { type ReactNode } from "react";
/**
 * The palettes as data: the items a list shows, how a query filters and ranks
 * them, how the keyboard steps the highlight, and the ids that tie the field
 * to the highlighted row. Pure apart from `useListHighlight`, so the ranking
 * and the stepping are tested without a DOM (`command-list.test.ts`).
 *
 * Copied from desktop's `features/command-palette/lib/command-palette-logic.ts`
 * (ADR-0027): the same ranking, the same wrap-around highlight, the same
 * "a filter that drops the highlighted row lands on the first one".
 */
/** One row a command list can run. */
export interface CommandPaletteItem {
    /** Unique within the list; the highlight is tracked by it. */
    readonly id: string;
    /** The row's text, and the first thing a query matches. */
    readonly label: string;
    /** Replaces `label` on screen (a title with a badge in it); `label` is
     *  still what a query matches. */
    readonly title?: ReactNode;
    /** More text a query matches, after the label: a module's type, a
     *  session's project. An earlier term ranks higher. */
    readonly keywords?: ReadonlyArray<string>;
    /** The muted second line. */
    readonly description?: ReactNode;
    /** The leading glyph, usually `<Icon icon={…} size="lg" />`. */
    readonly icon?: ReactNode;
    /** A chord as glyphs on the right ("⌘⇧N"). */
    readonly shortcut?: string;
    /** An age on the right ("1d ago"). */
    readonly timestamp?: string;
    /** Anything else at the row's right end, before the shortcut. */
    readonly trailing?: ReactNode;
    readonly disabled?: boolean;
    /** Ranked after every match that is not secondary. */
    readonly secondary?: boolean;
    /** The palette stays open after it runs (it opens a child search). */
    readonly keepOpen?: boolean;
    /** What running it does. Called after the palette has asked to close. */
    readonly onSelect?: () => void;
    /** Set, the row is a submenu: running it drills into these groups. */
    readonly groups?: ReadonlyArray<CommandPaletteGroup>;
    /** The field's placeholder inside the submenu. */
    readonly placeholder?: string;
}
/** A labelled run of rows. */
export interface CommandPaletteGroup {
    readonly id: string;
    /** The small muted header; omitted, the rows run on without one. */
    readonly label?: string;
    readonly items: ReadonlyArray<CommandPaletteItem>;
    /** Dropped while a query is typed (a "Recent" group, whose rows the
     *  search finds anyway). */
    readonly hideWhenSearching?: boolean;
}
/** Case- and accent-folded, whitespace-collapsed: what every match compares.
 *  Locale-free on purpose (a Turkish host must still match "GIT" to "git"). */
export declare function normalizeSearchText(value: string): string;
/**
 * The groups a query shows. Empty, the groups as given. Typed, every row
 * whose label and keywords together hold every query word, ranked within its
 * group (secondary rows last, then by `rankItem`, then in source order);
 * groups left empty, and `hideWhenSearching` groups, drop out.
 */
export declare function filterCommandGroups(groups: ReadonlyArray<CommandPaletteGroup>, query: string): CommandPaletteGroup[];
/** The ids the keyboard can land on, in display order: every row that is
 *  not disabled. */
export declare function selectableIds(groups: ReadonlyArray<CommandPaletteGroup>): string[];
/** The highlight one step from `current` through `ids`, wrapping at the ends.
 *  With nothing highlighted, down starts at the top and up at the bottom. */
export declare function stepHighlight(ids: ReadonlyArray<string>, current: string | null, step: 1 | -1): string | null;
/** A row's element id: the list's id and the row's key, reduced to
 *  `[A-Za-z0-9_-]` so it is a safe id whatever the key holds. Look the
 *  element up with `document.getElementById`, never a selector — React's
 *  `useId` ids hold colons. */
export declare function optionId(listId: string, key: string): string;
/**
 * The keyboard highlight over a list's selectable ids.
 *
 * `active` is the tracked id while it is still listed, else the first one, so
 * a filter that drops the highlighted row lands on the top rather than on
 * nothing. A change of `resetKey` (the query) starts again at the top.
 * `pointTo` is for `onPointerMove`: it highlights only when the pointer
 * really moved, so a list scrolling under a resting mouse never steals the
 * highlight from the keys.
 */
export declare function useListHighlight(ids: ReadonlyArray<string>, resetKey?: unknown): {
    active: string;
    setActive: import("react").Dispatch<import("react").SetStateAction<string | null>>;
    /** Moves the highlight and returns where it landed. */
    step: (direction: 1 | -1) => string | null;
    pointTo: (id: string, x: number, y: number) => void;
};
/** One run of text, matched or not. */
export interface HighlightSegment {
    readonly text: string;
    readonly match: boolean;
}
/**
 * Cut `text` at `ranges` (`[start, end)` pairs, as a search backend reports
 * them). Ranges are clamped to the text, empty and inverted ones dropped, and
 * overlapping or touching ones merged, so the segments alternate and join
 * back to `text` exactly. No ranges: one unmatched segment. Empty text: none.
 */
export declare function splitHighlights(text: string, ranges?: ReadonlyArray<readonly [number, number]>): HighlightSegment[];
//# sourceMappingURL=command-list.d.ts.map