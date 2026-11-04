"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HUD } from "../../ui/hud.js";
import { Kbd } from "../../ui/kbd.js";
import { HINT_ALPHABET, HINT_OVERLAY_ATTR, activateHintTarget, generateHintLabels, scanHintTargets, } from "./hint-targets.js";
/**
 * Hint mode: a keycap over every clickable thing on screen; type its letters
 * to click it, or hold ⌥ to focus it instead. Copied from desktop's
 * `features/hint-nav/components/hint-overlay.tsx` (ADR-0027), with the store
 * and the trigger left with the host: `open` is controlled, and the host
 * binds the key that toggles it (desktop's ⌘⌥Space).
 *
 * While open it owns the keyboard: a capture-phase window listener that
 * stops every key before the app, a focused field or a terminal sees it.
 * `ignoreKey` lets one through untouched — the host's trigger, so the same
 * chord closes hint mode again.
 *
 * Nothing animates: hint mode is a keyboard action used many times a day,
 * and keycaps that faded in would lag the hands typing them.
 */
/** A letter from the physical key, so ⌥ (which turns `f` into `ƒ` on macOS)
 *  and non-US layouts still type the label's letters. */
function charFromEvent(e) {
    if (/^Key[A-Z]$/.test(e.code))
        return e.code.slice(3).toLowerCase();
    if (/^Digit[0-9]$/.test(e.code))
        return e.code.slice(5);
    if (e.key.length === 1 && /[a-z0-9]/i.test(e.key))
        return e.key.toLowerCase();
    return null;
}
function HintOverlay({ open, onOpenChange, root, alphabet = HINT_ALPHABET, ignoreKey, onActivate, focusKeyLabel = "⌥", }) {
    const [targets, setTargets] = useState([]);
    const [labels, setLabels] = useState([]);
    const [typed, setTyped] = useState("");
    // The capture-phase handler reads the latest values through refs, so it
    // isn't re-subscribed on every keystroke.
    const latest = useRef({ targets, labels, typed, onOpenChange, ignoreKey, onActivate });
    latest.current = { targets, labels, typed, onOpenChange, ignoreKey, onActivate };
    // Scan and label on open, before paint so the keycaps arrive with the
    // overlay; clear on close.
    useLayoutEffect(() => {
        if (!open) {
            setTargets([]);
            setLabels([]);
            setTyped("");
            return;
        }
        const found = scanHintTargets(root ?? document);
        setTargets(found);
        setLabels(generateHintLabels(found.length, alphabet));
        setTyped("");
    }, [open, root, alphabet]);
    // Re-measure on scroll and resize, once a frame, so the keycaps follow.
    const remeasure = useCallback(() => {
        setTargets((prev) => prev.map((t) => ({ el: t.el, rect: t.el.getBoundingClientRect() })));
    }, []);
    useEffect(() => {
        if (!open)
            return;
        let raf = 0;
        const schedule = () => {
            if (raf)
                return;
            raf = requestAnimationFrame(() => {
                raf = 0;
                remeasure();
            });
        };
        // Capture, because scroll events from inner containers don't bubble.
        window.addEventListener("scroll", schedule, { capture: true, passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            if (raf)
                cancelAnimationFrame(raf);
            window.removeEventListener("scroll", schedule, { capture: true });
            window.removeEventListener("resize", schedule);
        };
    }, [open, remeasure]);
    // ↑/↓/PgUp/PgDn scroll whatever scrolls under the viewport's centre.
    const scrollActive = useCallback((dy) => {
        let node = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
        while (node && node !== document.body) {
            const style = getComputedStyle(node);
            if (/(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight) {
                node.scrollBy({ top: dy });
                return;
            }
            node = node.parentElement;
        }
        window.scrollBy({ top: dy });
    }, []);
    useEffect(() => {
        if (!open)
            return;
        const STEP = 120;
        const onKey = (e) => {
            const { ignoreKey, onOpenChange, onActivate } = latest.current;
            if (ignoreKey?.(e))
                return;
            e.preventDefault();
            e.stopImmediatePropagation();
            if (e.key === "Escape")
                return onOpenChange(false);
            if (e.key === "Backspace")
                return setTyped((t) => t.slice(0, -1));
            if (e.key === "ArrowDown")
                return scrollActive(STEP);
            if (e.key === "ArrowUp")
                return scrollActive(-STEP);
            if (e.key === "PageDown")
                return scrollActive(window.innerHeight * 0.9);
            if (e.key === "PageUp")
                return scrollActive(-window.innerHeight * 0.9);
            const ch = charFromEvent(e);
            if (!ch)
                return;
            const next = latest.current.typed + ch;
            const matches = [];
            latest.current.labels.forEach((label, i) => {
                if (label.startsWith(next))
                    matches.push(i);
            });
            if (matches.length === 0)
                return; // A dead end: ignore the key.
            if (matches.length === 1) {
                const target = latest.current.targets[matches[0]];
                onOpenChange(false);
                if (target) {
                    activateHintTarget(target.el, { focusOnly: e.altKey });
                    onActivate?.(target.el, e.altKey ? "focus" : "click");
                }
                return;
            }
            setTyped(next);
        };
        window.addEventListener("keydown", onKey, { capture: true });
        return () => window.removeEventListener("keydown", onKey, { capture: true });
    }, [open, scrollActive]);
    if (!open)
        return null;
    return createPortal(_jsxs("div", { [HINT_OVERLAY_ATTR]: "", 
        // z-drag (500) sits above tooltips (z-tooltip, 400): a keycap must be
        // readable over whatever is open.
        className: "pointer-events-none fixed inset-0 z-drag overflow-hidden", children: [targets.map((t, i) => {
                const label = labels[i];
                if (!label || (typed && !label.startsWith(typed)))
                    return null;
                return (_jsxs("span", { "data-hint-label": label, className: `absolute inline-flex h-4 items-center rounded-full px-1.5 font-sans text-2xs font-semibold uppercase tracking-wide text-foreground ${HUD}`, style: {
                        left: Math.max(0, t.rect.left),
                        top: Math.max(0, t.rect.top),
                        transform: "translate(-2px, -2px)",
                    }, children: [typed && _jsx("span", { className: "text-muted-foreground", children: label.slice(0, typed.length) }), _jsx("span", { children: label.slice(typed.length) })] }, i));
            }), _jsx("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2", children: _jsxs("div", { className: `flex items-center gap-3 rounded-2xl px-3.5 py-2.5 ${HUD}`, children: [_jsx("span", { className: "font-mono text-sm text-foreground", children: typed ? (_jsx("span", { className: "tracking-widest", children: typed.toUpperCase() })) : (_jsxs("span", { className: "text-muted-foreground", children: [targets.length, " targets \u2014 type the letters"] })) }), _jsxs("span", { className: "flex items-center gap-1.5 text-2xs text-muted-foreground", children: [_jsx(Kbd, { children: focusKeyLabel }), " focus", _jsx(Kbd, { children: "esc" }), " close"] })] }) })] }), document.body);
}
export { HintOverlay };
//# sourceMappingURL=hint-overlay.js.map