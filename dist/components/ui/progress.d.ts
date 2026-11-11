import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
/**
 * The indicator's ink. `default` is the primary ink, a plain amount. The
 * others are desktop's usage bars (quota, rate limits), where the fill says
 * how close a limit is: `success` with room left, `warning` near it, `error`
 * at it. Which tone a value gets is the app's call; desktop turns amber at
 * 70% and red at 90%.
 */
type ProgressTone = "default" | "success" | "warning" | "error";
declare function Progress({ className, children, value, tone, ...props }: ProgressPrimitive.Root.Props & {
    tone?: ProgressTone;
}): import("react").JSX.Element;
declare function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props): import("react").JSX.Element;
/**
 * The fill moves by `translateX`, not `width`: a full-width bar slid left by
 * what is still to do, on a track that clips it. A width change re-lays out
 * the bar every frame of the ease, and a purge's bar retargets on every
 * poll. Base UI writes the value as an inline `width`; this reads it back
 * and writes a transform instead. Indeterminate (no value) is the bar at
 * full width, as before. Reduced motion jumps to the new value.
 */
declare function ProgressIndicator({ className, tone, ...props }: ProgressPrimitive.Indicator.Props & {
    tone?: ProgressTone;
}): import("react").JSX.Element;
declare function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props): import("react").JSX.Element;
declare function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props): import("react").JSX.Element;
export { Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue };
export type { ProgressTone };
//# sourceMappingURL=progress.d.ts.map