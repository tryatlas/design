"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { infiniteAnimationFps } from "../../lib/infinite-animations.js";
import { cn } from "../../lib/utils.js";
import { useMeasure } from "../../lib/use-measure.js";
/**
 * A seamless marquee.
 *
 * Children render twice and the track translates by exactly half its
 * measured width, so the second copy lands where the first began. Width is
 * measured, not assumed, so it survives font loading and scale changes.
 *
 * `speedOnHover` does not jump speeds: it animates the REMAINING distance at
 * the new speed, then re-keys the loop. A marquee that lurches when you
 * hover it is one you cannot read.
 *
 * With `--infinite-animation-fps` set (see `INFINITE_ANIMATIONS`), the track
 * moves in that many even steps a second instead of every frame: the easing
 * is still linear, only quantised in time, so the speed is unchanged.
 *
 * Under `prefers-reduced-motion` it does not move: the first copy sits at
 * the start and the loop never begins. `animate()` on a motion value is not
 * reached by `MotionConfig`, so the check is here.
 */
/** Linear, held flat between `count` evenly spaced steps. */
function steppedLinear(count) {
    const n = Math.max(1, Math.round(count));
    return (t) => (t >= 1 ? 1 : Math.floor(t * n) / n);
}
function InfiniteSlider({ children, gap = 16, speed = 100, speedOnHover, direction = "horizontal", reverse = false, className, }) {
    const [currentSpeed, setCurrentSpeed] = useState(speed);
    const [measure, { width, height }] = useMeasure();
    const track = useRef(null);
    const ref = useCallback((node) => {
        track.current = node;
        measure(node);
    }, [measure]);
    const translation = useMotionValue(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [key, setKey] = useState(0);
    const reduce = useReducedMotion();
    useEffect(() => {
        if (reduce) {
            translation.set(0);
            return;
        }
        let controls;
        const size = direction === "horizontal" ? width : height;
        if (!size)
            return;
        const contentSize = size + gap;
        const from = reverse ? -contentSize / 2 : 0;
        const to = reverse ? 0 : -contentSize / 2;
        const duration = Math.abs(to - from) / currentSpeed;
        const fps = track.current ? infiniteAnimationFps(track.current) : undefined;
        const ease = (seconds) => (fps ? steppedLinear(seconds * fps) : "linear");
        if (isTransitioning) {
            const remaining = Math.abs(translation.get() - to);
            controls = animate(translation, [translation.get(), to], {
                ease: ease(remaining / currentSpeed),
                duration: remaining / currentSpeed,
                onComplete: () => {
                    setIsTransitioning(false);
                    setKey((k) => k + 1);
                },
            });
        }
        else {
            controls = animate(translation, [from, to], {
                ease: ease(duration),
                duration,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 0,
                onRepeat: () => translation.set(from),
            });
        }
        return () => controls.stop();
    }, [
        key,
        translation,
        currentSpeed,
        width,
        height,
        gap,
        isTransitioning,
        direction,
        reverse,
        reduce,
    ]);
    const hoverProps = speedOnHover && !reduce
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