import { cva } from "class-variance-authority";
/**
 * `IconButton`'s class recipe, without `"use client"` so a server component
 * can call it. See `icon-button.tsx` for the component and its rules.
 */
const iconButtonVariants = cva([
    "inline-flex shrink-0 items-center justify-center",
    "rounded border border-transparent select-none",
    // The press dip, the same as `Button`'s (see `button-variants.ts`).
    "transition-[color,background-color,border-color,opacity,scale] duration-fast ease-out-strong",
    "motion-safe:not-data-disabled:active:scale-97 active:duration-instant",
    "data-disabled:cursor-not-allowed data-disabled:opacity-50",
    // A toggle (`aria-pressed`) that is on reads as selected, in any variant.
    "aria-pressed:bg-element-selected aria-pressed:text-foreground",
    "[&_svg]:pointer-events-none",
], {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary-hover",
            destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
            outline: "border-border bg-transparent text-foreground hover:bg-element-hover",
            secondary: "bg-card text-foreground hover:bg-element-hover",
            ghost: "bg-transparent text-muted-foreground hover:bg-element-hover hover:text-foreground",
            // The row affordance that throws work away (discard, delete): ghost at
            // rest, the error tone only under the pointer.
            "ghost-destructive": "bg-transparent text-muted-foreground hover:bg-error-muted hover:text-error",
            // `hairline` is the rail footer's pair (help, interface scale): a
            // quiet glyph inside a subtle ring, so the controls read as present
            // but sit back from the card. Both open a popup, and stay lit while
            // it is open (`aria-expanded`, which only popup triggers set — a
            // tooltip's own open state must not light it).
            hairline: [
                "border-border-subtle bg-transparent text-muted-foreground",
                "hover:bg-element-hover hover:text-foreground",
                "aria-expanded:bg-element-hover aria-expanded:text-foreground",
            ],
            // `floating` sits over content rather than on a surface: the remove
            // button pinned to an image tile's corner. Opaque (`bg-card`) so the
            // image does not show through the glyph, and bordered so it reads as
            // a separate object at the tile's edge. Pair it with `shape="round"`,
            // as desktop's tile does.
            floating: "border-border bg-card text-secondary-foreground hover:text-foreground",
            // A control that is on and says so loudly: a muted microphone, a
            // camera that is off in a call. The error tint, not the error fill.
            alert: "bg-error-muted text-error hover:opacity-90",
            // A control floating over a page (a call dock, a scroll-to-bottom):
            // the one floating material, `glass-bar`, round, and lit while the
            // menu it opens is open.
            glass: [
                "rounded-full border-border glass-bar text-muted-foreground",
                "hover:text-foreground data-popup-open:text-foreground",
            ],
        },
        size: {
            // Below the control ladder: a 16px affordance pinned to the corner of
            // a tile (the remove button on an image attachment). px, like the
            // ladder, because the app's root font size moves `rem` — the same
            // reason `Avatar`'s `2xs` is px.
            "2xs": "size-[16px]",
            xs: "size-control-xs",
            sm: "size-control-sm",
            md: "size-control-md",
            lg: "size-control-lg",
            // Above the ladder: the call dock's 48px controls, a touch target
            // first. The glyph is 20px. px, as `2xs`, so the target stays 48px
            // at any root font size.
            xl: "size-[48px] [&_svg]:size-5",
        },
        // `round` is the stepper's shape (the −/+ either side of a value), where a
        // pair of circles reads as one control rather than two square buttons.
        shape: {
            square: "",
            round: "rounded-full",
        },
        // `active` is a control whose setting is on at rest — a filter that is
        // narrowing the list — so the square keeps the active fill rather than
        // only lighting on hover. It is a look, not a toggle: a menu trigger
        // carrying it is still a menu trigger, so no `aria-pressed`.
        active: {
            true: "bg-element-active text-foreground",
            false: "",
        },
        // `reveal` is a row affordance that waits for the row: hidden until the
        // pointer is over the nearest `group` (or focus is inside it), and
        // shown while it has focus or its popup is open. Opacity, never
        // `display: none`, so it keeps its place in the tab order and the
        // accessibility tree. A touch screen has no hover, so it always shows.
        reveal: {
            true: [
                "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
                "focus-visible:opacity-100 aria-expanded:opacity-100 data-popup-open:opacity-100",
                "pointer-coarse:opacity-100",
            ],
            false: "",
        },
    },
    defaultVariants: {
        variant: "ghost",
        size: "md",
        shape: "square",
        active: false,
        reveal: false,
    },
});
export { iconButtonVariants };
//# sourceMappingURL=icon-button-variants.js.map