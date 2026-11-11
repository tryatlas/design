import { type ReactNode } from "react";
import { type TraceAuthor, type TraceCheckpoint, type TraceGroupBy, type TraceRange, type TraceSession, type TraceZoom } from "./checkpoint-trace-model.ts";
export type { TraceAuthor, TraceCheckpoint, TraceGroupBy, TraceRange, TraceSession, TraceZoom, } from "./checkpoint-trace-model.ts";
/** How tightly lanes pack. `compact` is for a host that wants more lanes on
 *  a screen; its marks are still faces you can read, on one line. */
export type TraceDensity = "comfortable" | "compact";
export interface TraceLabels {
    /** The region's name. */
    region: string;
    /** The lane list's name, and the corner cell when ungrouped. */
    sessions: string;
    zoom: string;
    zoomLevels: Record<TraceZoom, string>;
    /** The jump-to-now button, and the now line's flag. */
    now: string;
    untitled: string;
    noProject: string;
    noOwner: string;
    emptyTitle: string;
    emptyDescription: string;
    errorTitle: string;
    loading: string;
    /** "Checkpoint by Priya, 14:02: Fix auth redirect". */
    checkpoint: (c: TraceCheckpoint, at: string, handoffFrom?: TraceAuthor) => string;
    /** A count pill's name; `canZoom` says whether opening it zooms in. */
    cluster: (count: number, from: string, to: string, authors: string[], canZoom: boolean) => string;
    /** A lane title's name. `s.title` arrives with `untitled` already in
     *  place of an empty one. Start it with the title: that is the label's only
     *  text assistive tech sees, and it must be part of the name. */
    session: (s: TraceSession, start: string, end: string | null, checkpoints: number) => string;
    /** "12 sessions · 40 checkpoints" under a group's name. */
    groupMeta: (sessions: number, checkpoints: number) => string;
    /** "Took over from Sam": a handoff, in the card and the checkpoint's name. */
    handoff: (from: TraceAuthor) => string;
    /** The second line of a labelled cluster chip: "6 checkpoints · Priya,
     *  Sam". `names` are first names, the latest hands first. Optional, so a
     *  host's full `TraceLabels` from before it existed still type-checks. */
    clusterSummary?: (count: number, names: string[]) => string;
    /** A handoff, short, on a chip's second line: "from Sam". Optional, as
     *  above. */
    handoffShort?: (from: TraceAuthor) => string;
    /** Said of a live session's latest checkpoint, in its name. Optional, as
     *  above. */
    latest?: string;
    /** Beside a hollow bar: the session landed nothing. Optional, as above. */
    noCheckpoints?: string;
    /** A pill card's heading. */
    checkpoints: (count: number) => string;
    /** The hover card's footer on a pill. */
    clusterHint: (canZoom: boolean) => string;
    more: (count: number) => string;
    /** Said of an orphaned checkpoint, in its name and its card. */
    orphaned: string;
    /** The "+ more" cue's name, when a session's checkpoints were capped. */
    truncated: string;
    files: (count: number) => string;
}
export declare const DEFAULT_TRACE_LABELS: TraceLabels;
export interface CheckpointTraceProps {
    sessions: readonly TraceSession[];
    /**
     * The stretch of time the trace covers; the view scrolls within it.
     * Defaults to the sessions' own extent, padded to the zoom's unit.
     */
    range?: TraceRange;
    /**
     * Called when the user pulls past either end and asks for more: the range
     * one zoom step longer on that side. Without `range` the trace extends
     * itself as well; with it, the host decides (and fetches).
     */
    onRangeChange?: (range: TraceRange) => void;
    /** Controlled zoom. Leave it unset to let the trace own it (`defaultZoom`).
     *  `week` fits its range to the track (see `timeScale`), so a week of work
     *  fills the screen rather than a fortnight of mostly empty canvas. */
    zoom?: TraceZoom;
    /** Defaults to `week`, the overview. */
    defaultZoom?: TraceZoom;
    /** Lane height and mark size: `comfortable` (52px lanes, 24px faces, two-
     *  line chips; the default) or `compact` (36px lanes, 20px faces, one
     *  line). */
    density?: TraceDensity;
    onZoomChange?: (zoom: TraceZoom) => void;
    groupBy?: TraceGroupBy;
    /** The present. Unset, the trace keeps its own clock (every 30 seconds). */
    now?: string | number | Date;
    onOpenSession?: (sessionId: string) => void;
    onOpenCheckpoint?: (checkpoint: TraceCheckpoint) => void;
    /**
     * A face, exactly `sizePx` across: the trace has already laid its marks out
     * around that diameter, so a bigger or smaller face would overlap its
     * neighbours or leave a gap. The sizes asked for are 24 (a mark,
     * comfortable), 20 (a mark, compact), 18 (a lane header's participants),
     * 16 and 14 (the hover card), and 18 for a person group's header.
     *
     * Defaults to the photo (`author.avatarUrl`) when there is one, else the
     * person's initials on a disc in their own stable hue (`actorHue` of their
     * id), so the same person is the same colour on every lane.
     */
    renderAvatar?: (author: TraceAuthor, sizePx: number) => ReactNode;
    /** The agent's mark beside its name in a lane's label. */
    renderAgentMark?: (session: TraceSession) => ReactNode;
    loading?: boolean;
    /** An error replaces the trace: a string is the description under
     *  `labels.errorTitle`; a node is drawn as it is (bring a retry). */
    error?: ReactNode;
    /** Replaces the default empty state. */
    empty?: ReactNode;
    labels?: Partial<TraceLabels>;
    /** Drawn at the left of the header row, before the zoom control: the
     *  host's own filters (group by, project, person). */
    toolbar?: ReactNode;
    /** BCP 47 locale for times; the runtime's by default. */
    locale?: string;
    className?: string;
}
/**
 * The default face: the photo, else initials in the person's own hue.
 *
 * `Avatar`'s own fallback is deliberately grey (a members table in eight
 * colours reads as eight categories). The trace is the other case: the
 * colour is the person, it matches the author rail under a bar, and it is
 * what lets you follow one person down a column of lanes without reading.
 *
 * The size is set in px, so it is exactly what the layout measured; `size`
 * only picks the initials' type step (10px from 22px up, 9px under).
 * Initials are `author.initials` when set, else drawn from the name.
 *
 * Exported so a host's `renderAvatar` can wrap it (a hover card, a link)
 * rather than redraw it: `(a, size) => <Card><TraceAvatar author={a} size={size} /></Card>`.
 */
export declare function TraceAvatar({ author, size }: {
    author: TraceAuthor;
    size: number;
}): import("react").JSX.Element;
export declare function CheckpointTrace({ sessions, range, onRangeChange, zoom: zoomProp, defaultZoom, density, onZoomChange, groupBy, now: nowProp, onOpenSession, onOpenCheckpoint, renderAvatar, renderAgentMark, loading, error, empty, labels: labelsProp, toolbar, locale, className, }: CheckpointTraceProps): import("react").JSX.Element;
//# sourceMappingURL=checkpoint-trace.d.ts.map