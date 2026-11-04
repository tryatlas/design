import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
/**
 * An identity mark.
 *
 * Sizes are the control ladder, so an avatar in a 28px row is exactly as tall
 * as the button beside it. The fallback is initials on `bg-muted` — never a
 * generated hue, because a members table with eight colours in it reads as
 * eight categories rather than eight people.
 */
type AvatarSize = "xs" | "sm" | "md" | "lg";
declare function Avatar({ className, size, ...props }: AvatarPrimitive.Root.Props & {
    size?: AvatarSize;
}): import("react").JSX.Element;
declare function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props): import("react").JSX.Element;
declare function AvatarFallback({ className, ...props }: AvatarPrimitive.Fallback.Props): import("react").JSX.Element;
/**
 * Overlapping avatars. The gap is an outline in the page background, not a
 * border, so it reads as a gap rather than an outline. An outline rather than
 * a ring because the avatar's own hairline is an inset ring: overriding it
 * would draw the background inside the face, and the faces would run together.
 */
declare function AvatarGroup({ className, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
/** The "+3" cap at the end of a group. */
declare function AvatarGroupCount({ className, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
export { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage };
//# sourceMappingURL=avatar.d.ts.map