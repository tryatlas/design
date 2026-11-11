"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cn } from "../../lib/utils.js";
function Avatar({ className, size = "md", ...props }) {
    return (_jsx(AvatarPrimitive.Root, { "data-slot": "avatar", "data-size": size, className: cn("group/avatar relative flex shrink-0 overflow-hidden rounded-full select-none", "ring-1 ring-border ring-inset", "data-[size=3xs]:size-[14px]", "data-[size=2xs]:size-[16px]", "data-[size=xs]:size-control-xs", "data-[size=sm]:size-control-sm", "data-[size=md]:size-control-md", "data-[size=lg]:size-control-lg", "data-[size=xl]:size-10", "data-[size=2xl]:size-16", className), ...props }));
}
function AvatarImage({ className, ...props }) {
    return (_jsx(AvatarPrimitive.Image, { "data-slot": "avatar-image", className: cn("aspect-square size-full object-cover", className), ...props }));
}
function AvatarFallback({ className, ...props }) {
    return (_jsx(AvatarPrimitive.Fallback, { "data-slot": "avatar-fallback", className: cn("flex size-full items-center justify-center bg-muted font-medium text-secondary-foreground uppercase", "group-data-[size=3xs]/avatar:text-3xs", "group-data-[size=2xs]/avatar:text-3xs", "group-data-[size=xs]/avatar:text-3xs", "group-data-[size=sm]/avatar:text-3xs", "group-data-[size=md]/avatar:text-2xs", "group-data-[size=lg]/avatar:text-xs", "group-data-[size=xl]/avatar:text-sm", "group-data-[size=2xl]/avatar:text-xl", className), ...props }));
}
/**
 * Overlapping avatars. The gap is an outline in the page background, not a
 * border, so it reads as a gap rather than an outline. An outline rather than
 * a ring because the avatar's own hairline is an inset ring: overriding it
 * would draw the background inside the face, and the faces would run together.
 */
function AvatarGroup({ className, ...props }) {
    return (_jsx("div", { "data-slot": "avatar-group", className: cn("group/avatar-group flex -space-x-1.5", "*:data-[slot=avatar]:outline-2 *:data-[slot=avatar]:outline-background", className), ...props }));
}
/** The "+3" cap at the end of a group. `size` matches the avatars beside it. */
function AvatarGroupCount({ className, size = "md", ...props }) {
    return (_jsx("div", { "data-slot": "avatar-group-count", "data-size": size, className: cn("relative flex shrink-0 items-center justify-center", size === "lg" ? "size-control-lg text-xs" : "size-control-md text-2xs", "rounded-full bg-muted font-medium text-secondary-foreground", "ring-2 ring-background", className), ...props }));
}
export { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage };
//# sourceMappingURL=avatar.js.map