"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useImperativeHandle } from "react";
import { motion, useAnimationControls } from "motion/react";
import { cn } from "../../lib/utils.js";
const FLAG = {
    normal: {
        rotate: 0,
        transition: { type: "spring", stiffness: 300, damping: 35 },
    },
    animate: {
        rotate: -90,
        transition: { type: "spring", stiffness: 280, damping: 34, mass: 1 },
    },
};
const MailboxIcon = forwardRef(function MailboxIcon({ size = 20, strokeWidth = 1.5, controlled = false, className, onMouseEnter, onMouseLeave, ...props }, ref) {
    const controls = useAnimationControls();
    useImperativeHandle(ref, () => ({
        startAnimation: () => void controls.start("animate"),
        stopAnimation: () => void controls.start("normal"),
    }), [controls]);
    return (_jsx("span", { "data-slot": "mailbox-icon", "aria-hidden": "true", className: cn("inline-flex shrink-0", className), onMouseEnter: (e) => {
            if (!controlled)
                void controls.start("animate");
            onMouseEnter?.(e);
        }, onMouseLeave: (e) => {
            if (!controlled)
                void controls.start("normal");
            onMouseLeave?.(e);
        }, ...props, children: _jsxs("svg", { className: "overflow-visible", fill: "none", width: size, height: size, viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" }), _jsx(motion.path, { d: "M18 11V9H15", initial: "normal", animate: controls, variants: FLAG, style: { transformOrigin: "18px 11px" } }), _jsx("path", { d: "M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2" }), _jsx("line", { x1: "6", x2: "7", y1: "10", y2: "10" })] }) }));
});
export { MailboxIcon };
//# sourceMappingURL=mailbox-icon.js.map