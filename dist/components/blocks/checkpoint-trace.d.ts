import { type ReactNode } from "react";
import { type TraceAuthor, type TraceCheckpoint, type TraceGroupBy, type TraceRange, type TraceSession, type TraceZoom } from "./checkpoint-trace-model.ts";
export type { TraceAuthor, TraceCheckpoint, TraceGroupBy, TraceRange, TraceSession, TraceZoom, } from "./checkpoint-trace-model.ts";
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
    /** Controlled zoom. Leave it unset to let the trace own it (`defaultZoom`). */
    zoom?: TraceZoom;
    defaultZoom?: TraceZoom;
    onZoomChange?: (zoom: TraceZoom) => void;
    groupBy?: TraceGroupBy;
    /** The present. Unset, the trace keeps its own clock (every 30 seconds). */
    now?: string | number | Date;
    onOpenSession?: (sessionId: string) => void;
    onOpenCheckpoint?: (checkpoint: TraceCheckpoint) => void;
    /** A face. Defaults to the package's `Avatar`: the photo, or initials. */
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
export declare function CheckpointTrace({ sessions, range, onRangeChange, zoom: zoomProp, defaultZoom, onZoomChange, groupBy, now: nowProp, onOpenSession, onOpenCheckpoint, renderAvatar, renderAgentMark, loading, error, empty, labels: labelsProp, toolbar, locale, className, }: CheckpointTraceProps): import("react").JSX.Element;
//# sourceMappingURL=checkpoint-trace.d.ts.map