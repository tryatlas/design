"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useImperativeHandle } from "react";
import { motion, useAnimationControls } from "motion/react";
import { cn } from "../../lib/utils.js";
import { ICON_STROKE_WIDTH } from "../../ui/icon.js";
const ARROW = {
    normal: { y: 0 },
    animate: {
        y: -2,
        transition: { type: "spring", stiffness: 200, damping: 10, mass: 1 },
    },
};
const UploadIcon = forwardRef(function UploadIcon({ size = 14, strokeWidth = ICON_STROKE_WIDTH, controlled = false, className, onMouseEnter, onMouseLeave, ...props }, ref) {
    const controls = useAnimationControls();
    useImperativeHandle(ref, () => ({
        startAnimation: () => void controls.start("animate"),
        stopAnimation: () => void controls.start("normal"),
    }), [controls]);
    return (_jsx("span", { "data-slot": "upload-icon", "aria-hidden": "true", className: cn("inline-flex shrink-0", className), onMouseEnter: (e) => {
            if (!controlled)
                void controls.start("animate");
            onMouseEnter?.(e);
        }, onMouseLeave: (e) => {
            if (!controlled)
                void controls.start("normal");
            onMouseLeave?.(e);
        }, ...props, children: _jsxs("svg", { fill: "none", width: size, height: size, viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", className: "overflow-visible", children: [_jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), _jsxs(motion.g, { animate: controls, initial: "normal", variants: ARROW, children: [_jsx("polyline", { points: "17 8 12 3 7 8" }), _jsx("line", { x1: "12", x2: "12", y1: "3", y2: "15" })] })] }) }));
});
export { UploadIcon };
//# sourceMappingURL=upload-icon.js.map