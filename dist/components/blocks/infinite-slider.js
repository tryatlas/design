"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { animate, motion, useMotionValue } from "motion/react";
import { cn } from "../../lib/utils.js";
import { useMeasure } from "../../lib/use-measure.js";
function InfiniteSlider({ children, gap = 16, speed = 100, speedOnHover, direction = "horizontal", reverse = false, className, }) {
    const [currentSpeed, setCurrentSpeed] = useState(speed);
    const [ref, { width, height }] = useMeasure();
    const translation = useMotionValue(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [key, setKey] = useState(0);
    useEffect(() => {
        let controls;
        const size = direction === "horizontal" ? width : height;
        if (!size)
            return;
        const contentSize = size + gap;
        const from = reverse ? -contentSize / 2 : 0;
        const to = reverse ? 0 : -contentSize / 2;
        const duration = Math.abs(to - from) / currentSpeed;
        if (isTransitioning) {
            const remaining = Math.abs(translation.get() - to);
            controls = animate(translation, [translation.get(), to], {
                ease: "linear",
                duration: remaining / currentSpeed,
                onComplete: () => {
                    setIsTransitioning(false);
                    setKey((k) => k + 1);
                },
            });
        }
        else {
            controls = animate(translation, [from, to], {
                ease: "linear",
                duration,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 0,
                onRepeat: () => translation.set(from),
            });
        }
        return () => controls.stop();
    }, [key, translation, currentSpeed, width, height, gap, isTransitioning, direction, reverse]);
    const hoverProps = speedOnHover
        ? {
            onHoverStart: () => {
                setIsTransitioning(true);
                setCurrentSpeed(speedOnHover);
            },
            onHoverEnd: () => {
                setIsTransitioning(true);
                setCurrentSpeed(speed);
            },
        }
        : {};
    return (_jsx("div", { className: cn("overflow-hidden", className), children: _jsxs(motion.div, { ref: ref, className: "flex w-max", style: {
                ...(direction === "horizontal" ? { x: translation } : { y: translation }),
                gap: `${gap}px`,
                flexDirection: direction === "horizontal" ? "row" : "column",
            }, ...hoverProps, children: [children, children] }) }));
}
export { InfiniteSlider };
//# sourceMappingURL=infinite-slider.js.map