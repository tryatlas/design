import type { SessionPhase, ToolKind } from "./session-view.ts";
/**
 * The `ToolKind` for a call. A valid ACP `acpKind` wins; otherwise the name is
 * folded through the table, and anything unknown is `other`.
 */
export declare function toolKindOf(name: string, acpKind?: string | null): ToolKind;
/** The `StatusIcon` glyph for a phase. */
export declare function statusIconOf(phase: SessionPhase): "queued" | "live" | "done" | "failed";
/** Terminal output without its escape sequences. No colour is kept. */
export declare function stripAnsi(text: string): string;
/** `850ms`, `4.2s`, `1m 12s`, `1h 3m`. */
export declare function formatDuration(ms: number): string;
/** `512 B`, `4.2 KB`, `1.3 MB`. */
export declare function formatBytes(bytes: number): string;
/**
 * A window over a long list of real DOM rows, grown as the reader nears its
 * edge. Desktop's transcript, which measured virtualisation losing to this: a
 * virtualiser unmounts rows, a fast flick outruns the remount and the reader
 * watches blank space; a row already in the DOM cannot blank. So rows are
 * never unmounted, only added.
 *
 * `down` renders `[0, initial)` and extends `end` by `chunk` when the sentinel
 * (placed after the last row) comes within 2200px of the scroll root. `up`
 * renders the last `initial` rows and lowers `start` when the sentinel (placed
 * before the first row) does, keeping the reader's place by adding the growth
 * to `scrollTop`. The scroll root is the sentinel's nearest scrollable
 * ancestor.
 *
 * Rows that arrive while streaming (`count` grows) do not grow a `down` window
 * unless the sentinel is in range. A server renders the initial window, as the
 * client's first render does; a browser without `IntersectionObserver`
 * (jsdom) renders everything.
 */
export declare function useWindow({ count, initial, chunk, grow, }: {
    count: number;
    initial?: number;
    chunk?: number;
    grow?: "down" | "up";
}): {
    start: number;
    end: number;
    sentinelRef: (el: Element | null) => void;
};
//# sourceMappingURL=session-view-helpers.d.ts.map