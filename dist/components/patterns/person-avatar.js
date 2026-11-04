import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { initialsOf } from "../../lib/initials.js";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar.js";
/**
 * A person's avatar: their photo when there is one, their initials when
 * there is not (or while it loads).
 *
 * Every screen that shows a person goes through this, so a face is the same
 * face everywhere. Pass the user's `image` (better-auth's `user.image`).
 */
function PersonAvatar({ name, email, image, initials, size, className, }) {
    return (_jsxs(Avatar, { size: size, className: className, children: [image && _jsx(AvatarImage, { src: image, alt: "" }), _jsx(AvatarFallback, { children: initials ?? initialsOf(name, email) })] }));
}
export { PersonAvatar };
//# sourceMappingURL=person-avatar.js.map