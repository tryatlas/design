"use client";
import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { Callout } from "../ui/callout.js";
import { Button } from "../../ui/button.js";
function NextPage({ root, hasNext, fetching, failed, onNext, skeleton = null, failure, retryLabel = "Try again", rootMargin = "0px 0px 400px 0px", }) {
    const sentinel = useRef(null);
    // The latest `onNext`, so an inline arrow does not re-observe (and, while
    // the end is in view, re-ask) on every render.
    const next = useRef(onNext);
    useEffect(() => {
        next.current = onNext;
    }, [onNext]);
    useEffect(() => {
        const el = sentinel.current;
        if (!el || !hasNext || fetching || failed)
            return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry?.isIntersecting)
                next.current();
        }, { root: root?.current ?? null, rootMargin });
        observer.observe(el);
        return () => observer.disconnect();
    }, [root, rootMargin, hasNext, fetching, failed]);
    if (failed) {
        return (_jsx(Callout, { "data-slot": "next-page", tone: "error", role: "alert", action: _jsx(Button, { variant: "secondary", size: "sm", onClick: () => onNext(), children: retryLabel }), children: failure }));
    }
    if (fetching)
        return _jsx(_Fragment, { children: skeleton });
    return hasNext ? (_jsx("div", { ref: sentinel, "data-slot": "next-page", "aria-hidden": "true", className: "h-px" })) : null;
}
export { NextPage };
//# sourceMappingURL=next-page.js.map