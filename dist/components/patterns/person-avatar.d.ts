import { type AvatarSize } from "../ui/avatar.tsx";
/**
 * A person's avatar: their photo when there is one, their initials when
 * there is not (or while it loads).
 *
 * Every screen that shows a person goes through this, so a face is the same
 * face everywhere. Pass the user's `image` (better-auth's `user.image`);
 * `null` and `undefined` both mean none.
 *
 * `art` stands in for the initials when there is no photo: a guest's
 * generated art, say. It fills the circle and is drawn as given; keep it
 * `aria-hidden`, since the avatar names no one by itself.
 */
declare function PersonAvatar({ name, email, image, initials, art, size, className, }: {
    name: string;
    email?: string;
    /** The photo URL; absent or `null` means initials (or `art`). */
    image?: string | null;
    /** Fallback initials, when the caller already has them. */
    initials?: string;
    /** Drawn in place of the initials when there is no photo. */
    art?: React.ReactNode;
    /** `2xs` (16px) for a face inside a line of text; `xl` and `2xl` for a profile. */
    size?: Exclude<AvatarSize, "3xs">;
    className?: string;
}): import("react").JSX.Element;
export { PersonAvatar };
//# sourceMappingURL=person-avatar.d.ts.map