"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cn } from "../../lib/utils.ts";

/**
 * An identity mark.
 *
 * Sizes are the control ladder, so an avatar in a 28px row is exactly as tall
 * as the button beside it. Below it, `2xs` (16px) and `3xs` (14px) are for a
 * face inside a line of text or a dense graph (desktop's commit graph); they
 * are px, like the ladder, because the app's root font size moves `rem`. Above
 * it, `xl` (40px) and `2xl` (64px) are a person's own page and profile
 * header, never a row. The fallback is initials on `bg-muted` — never a
 * generated hue, because a members table with eight colours in it reads as
 * eight categories rather than eight people.
 */

type AvatarSize = "3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

function Avatar({
  className,
  size = "md",
  ...props
}: AvatarPrimitive.Root.Props & { size?: AvatarSize }) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex shrink-0 overflow-hidden rounded-full select-none",
        "ring-1 ring-border ring-inset",
        "data-[size=3xs]:size-[14px]",
        "data-[size=2xs]:size-[16px]",
        "data-[size=xs]:size-control-xs",
        "data-[size=sm]:size-control-sm",
        "data-[size=md]:size-control-md",
        "data-[size=lg]:size-control-lg",
        "data-[size=xl]:size-10",
        "data-[size=2xl]:size-16",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center bg-muted font-medium text-secondary-foreground uppercase",
        "group-data-[size=3xs]/avatar:text-3xs",
        "group-data-[size=2xs]/avatar:text-3xs",
        "group-data-[size=xs]/avatar:text-3xs",
        "group-data-[size=sm]/avatar:text-3xs",
        "group-data-[size=md]/avatar:text-2xs",
        "group-data-[size=lg]/avatar:text-xs",
        "group-data-[size=xl]/avatar:text-sm",
        "group-data-[size=2xl]/avatar:text-xl",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Overlapping avatars. The gap is an outline in the page background, not a
 * border, so it reads as a gap rather than an outline. An outline rather than
 * a ring because the avatar's own hairline is an inset ring: overriding it
 * would draw the background inside the face, and the faces would run together.
 */
function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-1.5",
        "*:data-[slot=avatar]:outline-2 *:data-[slot=avatar]:outline-background",
        className,
      )}
      {...props}
    />
  );
}

/** The "+3" cap at the end of a group. `size` matches the avatars beside it. */
function AvatarGroupCount({
  className,
  size = "md",
  ...props
}: React.ComponentProps<"div"> & { size?: "md" | "lg" }) {
  return (
    <div
      data-slot="avatar-group-count"
      data-size={size}
      className={cn(
        "relative flex shrink-0 items-center justify-center",
        size === "lg" ? "size-control-lg text-xs" : "size-control-md text-2xs",
        "rounded-full bg-muted font-medium text-secondary-foreground",
        "ring-2 ring-background",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage };
export type { AvatarSize };
