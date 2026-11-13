import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
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
/** The "+3" cap at the end of a group. `size` matches the avatars beside it. */
declare function AvatarGroupCount({ className, size, ...props }: React.ComponentProps<"div"> & {
    size?: "md" | "lg";
}): import("react").JSX.Element;
export { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage };
export type { AvatarSize };
//# sourceMappingURL=avatar.d.ts.map