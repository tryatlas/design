/**
 * Shown while a turn is live but has produced nothing to render yet: the ACP
 * round-trip, the model's first tokens, the beat before the first tool call.
 * Without it the transcript sits completely unchanged after send, which reads
 * as the message having been dropped.
 *
 * A pixel-grid wavefront, a shimmering label and an elapsed timer rather than a
 * spinner — see `loading-state.tsx` and the shimmer's note in `transcript.css`.
 * The timer matters here specifically: this is the one moment in a turn with no
 * other evidence that anything is happening, and "42.4s" answers the question
 * the reader is actually asking. It occupies a fixed-height row so its arrival
 * and departure don't jolt the thread it sits under.
 */
export declare function WorkingIndicator({ label, onStallRestart, onStallSwitch, onStallCopyDiagnostics, }: {
    label?: string;
    onStallRestart?: () => void;
    onStallSwitch?: () => void;
    onStallCopyDiagnostics?: () => void;
}): import("react").JSX.Element;
//# sourceMappingURL=working-indicator.d.ts.map