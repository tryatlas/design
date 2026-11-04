import { type ReactNode } from "react";
/**
 * Search over something the host searches: find-in-files (`mode="submit"`,
 * Enter runs the search) and find-in-session (`mode="live"`, the results
 * follow the query). On the same command shell as ⌘K, so the three read as
 * one system; desktop's `search-overlay.tsx` and `chat-search-palette.tsx`
 * are the behaviour it replaces.
 *
 * Props only: the query, the status and the results are the host's, and so
 * are the recent searches (persisting them is the host's job too).
 *
 * The keyboard model is the palette's: the field keeps focus, ↑/↓ step the
 * highlight (wrapping), Enter opens the highlighted result. In submit mode,
 * Enter after an edit (or with no results) searches instead. On the recent
 * searches Enter picks one and Delete forgets it.
 */
/** One search hit. */
export interface SearchResult {
    /** Unique within the results; the highlight is tracked by it. */
    readonly id: string;
    /** The first line: a path, a message's author. */
    readonly title: string;
    /** Right of the title, muted: a line number, a time. */
    readonly meta?: string;
    /** The second line: the matching text. */
    readonly detail?: string;
    /**
     * `[start, end)` ranges into `detail` exactly as passed. A host that trims
     * the text it shows (desktop trims a grep line's leading whitespace) must
     * re-base its match offsets onto the trimmed string.
     */
    readonly highlights?: ReadonlyArray<readonly [number, number]>;
    /** The leading glyph; a document icon by default would be noise, so none. */
    readonly icon?: ReactNode;
    /** Set both lines in the code face (paths, code). */
    readonly mono?: boolean;
}
export type SearchStatus = "idle" | "searching" | "done" | "error";
interface SearchOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** The dialog's accessible name. */
    title: string;
    placeholder?: string;
    query: string;
    onQueryChange: (query: string) => void;
    /** `live`: the host filters as the query changes. `submit`: Enter searches. */
    mode?: "live" | "submit";
    /** Submit mode: run the search for this (trimmed) query. */
    onSubmit?: (query: string) => void;
    status: SearchStatus;
    /** Shown in place of the results when `status` is `"error"`. */
    error?: ReactNode;
    results: ReadonlyArray<SearchResult>;
    /** A result picked. The overlay has already asked to close. */
    onOpen: (result: SearchResult) => void;
    /** A match count beside the field ("12", "12 of 40"). */
    count?: ReactNode;
    /** Recent searches, newest first, listed while the query is empty. */
    recent?: ReadonlyArray<string>;
    onPickRecent?: (query: string) => void;
    onForgetRecent?: (query: string) => void;
    onClearRecent?: () => void;
    /** The empty field's hint when there are no recent searches. */
    idleHint?: ReactNode;
    /** Shown when a search is done and found nothing. */
    emptyMessage?: ReactNode;
    /** Under the results: "Showing the first 500 matches". */
    notice?: ReactNode;
    /** At the field's right end: option toggles (match case, regex). */
    endAddon?: ReactNode;
    hints?: boolean;
}
declare function SearchOverlay(props: SearchOverlayProps): import("react").JSX.Element;
/** One result: icon, title and meta on the first line; the matching text,
 *  its matches in the foreground colour, on the second. */
declare function SearchResultRow({ id, result, active, onPoint, onOpen, }: {
    id: string;
    result: SearchResult;
    active: boolean;
    onPoint?: (x: number, y: number) => void;
    onOpen: (result: SearchResult) => void;
}): import("react").JSX.Element;
export { SearchOverlay, SearchResultRow };
export type { SearchOverlayProps };
//# sourceMappingURL=search-overlay.d.ts.map