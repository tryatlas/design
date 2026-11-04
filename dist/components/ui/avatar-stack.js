"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Children, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../lib/utils.js";
/**
 * Overlapping faces that ripple when you move across them.
 *
 * On entering a face, every face lifts by `LIFT × FALLOFF^distance` and the
 * hovered one grows a little, so the row ripples outward from the pointer.
 * Motion by springs, as everywhere else, and both critically damped
 * (damping = 2·√stiffness): a hover is not a throw, so nothing overshoots.
 * The lift is quick (`LIFT_SPRING`); the return is softer (`SETTLE_SPRING`),
 * so the row lands rather than snaps. Reduced motion holds every face still.
 *
 * Bring your own faces: pass `<Avatar>`s (and a trailing count) as
 * children. Each is wrapped, and the wrapper — not the avatar — carries the
 * ring that separates overlapping faces.
 */
const LIFT = -4;
const FALLOFF = 0.45;
const SCALE = 1.05;
const LIFT_SPRING = { type: "spring", stiffness: 520, damping: 46 };
const SETTLE_SPRING = { type: "spring", stiffness: 380, damping: 39 };
function AvatarStack({ className, children }) {
    const [active, setActive] = useState(null);
    const still = useReducedMotion();
    return (_jsx("div", { "data-slot": "avatar-stack", onMouseLeave: () => setActive(null), className: cn("flex items-center -space-x-1.5", className), children: Children.toArray(children).map((child, i) => {
            const distance = active === null ? null : Math.abs(i - active);
            const y = still || distance === null ? 0 : LIFT * Math.pow(FALLOFF, distance);
            const scale = !still && distance === 0 ? SCALE : 1;
            return (_jsx(motion.div, { onMouseEnter: () => setActive(i), animate: { y, scale }, transition: active === null ? SETTLE_SPRING : LIFT_SPRING, className: "relative rounded-full ring-2 ring-background", children: child }, i));
        }) }));
}
export { AvatarStack };
//# sourceMappingURL=avatar-stack.js.map