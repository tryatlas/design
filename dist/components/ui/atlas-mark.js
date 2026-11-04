import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
/**
 * The Atlas mark: three rising strokes.
 *
 * `currentColor`, so it takes the ink of whatever it sits in — a rail item,
 * a login header, a workspace switcher trigger. Our own mark, unlike the
 * third-party ones in `brand-marks.tsx`, has no fixed colour.
 */
function AtlasMark({ className, ...props }) {
    return (_jsx("svg", { viewBox: "0 0 24 24", width: "24", height: "24", fill: "currentColor", "aria-hidden": "true", className: cn("shrink-0", className), ...props, children: _jsx("path", { d: "M7.4 4h3.1L6.6 20H3.5zM13.2 4h3.1l-3.9 16H9.3zM19 4h3.1l-3.9 16h-3.1z" }) }));
}
function AtlasBadge({ className, tone = "theme", ...props }) {
    return (_jsx("div", { "data-tone": tone === "theme" ? undefined : tone, className: cn("flex size-8 items-center justify-center rounded-lg bg-foreground text-background", 
        // ratchet-allow: the app icon's tile is black and its mark white in
        // every theme; it is the icon in the Dock, not a themed surface.
        tone === "app-icon" && "bg-black text-white", className), ...props, children: _jsx(AtlasMark, { className: "size-4" }) }));
}
/** Mark plus name, for a footer or a nav. */
function AtlasWordmark({ className, ...props }) {
    return (_jsxs("div", { className: cn("flex items-center gap-1.5 text-foreground", className), ...props, children: [_jsx(AtlasMark, { className: "size-3.5" }), _jsx("span", { className: "text-xs font-semibold tracking-tight", children: "Atlas" })] }));
}
export { AtlasBadge, AtlasMark, AtlasWordmark };
//# sourceMappingURL=atlas-mark.js.map