"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../../lib/utils.js";
import { GradualBlur } from "../../blocks/gradual-blur.js";
import { WorkingIndicator } from "./working-indicator.js";
// Vertical insets shared by the transcript's view and an app's scroll window.
/** How far the header's blur band ramps BELOW the bar. Content must clear this
 *  too, or the first message renders permanently blurred. */
export const TOP_BLUR_RAMP = 34;
/** Without a header over it, only a short soft edge where rows scroll out
 *  under the bar. */
export const TOP_EDGE_RAMP = 16;
/** Breathing room between the last row and the composer. Applied as content
 *  padding rather than a spacer element so it scrolls with the thread and the
 *  bottom fade still has live content to dissolve into. */
export const BOTTOM_GAP = 28;
/** The transcript's frame: the scroller, its padded content, the app's
 *  overlays and the two edge treatments. Props only: the app owns the rows,
 *  the scroll window and the jumps. */
export function TranscriptView({ scrollRef, contentRef, onScroll, topInset, empty, rowViews, turnInProgress, footer, working, workingEpoch, workingLabel, onStallRestart, onStallSwitch, onStallCopyDiagnostics, more, overlays, }) {
    return (_jsxs("div", { className: "relative min-h-0 flex-1", children: [_jsx("div", { ref: scrollRef, onScroll: onScroll, className: "transcript-scroller h-full overflow-y-auto [overflow-anchor:none]", children: _jsxs("div", { ref: contentRef, style: {
                        paddingTop: topInset ? topInset + TOP_BLUR_RAMP + 12 : TOP_EDGE_RAMP + 4,
                        paddingBottom: BOTTOM_GAP,
                    }, children: [empty && (_jsx("div", { className: "flex h-full items-center justify-center text-xs text-[var(--muted-foreground)]", children: "No messages yet." })), rowViews, !turnInProgress && footer, working && (_jsx(WorkingIndicator, { label: workingLabel, onStallRestart: workingLabel ? onStallRestart : undefined, onStallSwitch: workingLabel ? onStallSwitch : undefined, onStallCopyDiagnostics: workingLabel ? onStallCopyDiagnostics : undefined }, workingEpoch))] }) }), overlays, _jsx(GradualBlur, { position: "top", height: `${topInset ? topInset + TOP_BLUR_RAMP : TOP_EDGE_RAMP}px`, strength: 2.1, layers: 5, 
                // Mostly-opaque behind the bar itself, ramping to clear below it.
                // Without a tint the header read as a transparent pane over live text;
                // `color-mix` keeps it theme-correct rather than hardcoding black.
                tint: "color-mix(in srgb, var(--background) 90%, transparent)", className: "z-panel" }), _jsx("div", { "aria-hidden": true, className: cn(
                // `-bottom-[2px]` + 2px extra height: the fade OVERSHOOTS the
                // container edge. At fractional UI scales the fade's bottom and the
                // scroller's bottom can round to different device pixels, and during
                // scroll repaints a 1-2px hairline of text flashed through the seam
                // above the composer. The overshoot is solid `--background` over the
                // inter-panel gap — invisible, and it absorbs the rounding both ways.
                "pointer-events-none absolute -bottom-[2px] left-0 right-0 z-panel h-[44px] transition-opacity duration-200", more ? "opacity-100" : "opacity-0"), style: {
                    // The last ~quarter is FULLY solid: a plain two-stop gradient only
                    // reaches 100% opacity at the very last pixel, and the ~97%-opaque
                    // band just above the composer let white text ghost through the
                    // seam (subtle but visible on AMOLED black).
                    background: "linear-gradient(to bottom, transparent, var(--background) 72%, var(--background))",
                } })] }));
}
//# sourceMappingURL=transcript-view.js.map