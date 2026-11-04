import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "./utils.js";
function BrandMarkSvg({ title, defaultTitle, className, children, ...props }) {
    const label = title ?? defaultTitle;
    return (_jsxs("svg", { viewBox: "0 0 24 24", width: "16", height: "16", ...(label ? { role: "img" } : { "aria-hidden": "true" }), className: cn("shrink-0", className), ...props, children: [label ? _jsx("title", { children: label }) : null, children] }));
}
export { BrandMarkSvg };
//# sourceMappingURL=brand-mark-svg.js.map