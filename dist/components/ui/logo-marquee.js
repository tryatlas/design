import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
import { InfiniteSlider } from "../blocks/infinite-slider.js";
function LogoMarquee({ logos, label = "Trusted by engineers at", className, trackClassName, }) {
    return (_jsxs("div", { "data-slot": "logo-marquee", className: cn("flex flex-col gap-4", className), children: [label && _jsx("p", { className: "eyebrow", children: label }), _jsx("div", { className: cn("mask-x-from-[calc(100%-6rem)] mask-x-to-100%", trackClassName), children: _jsx(InfiniteSlider, { gap: 56, speed: 40, speedOnHover: 12, children: logos.map((logo) => (_jsx("span", { role: "img", "aria-label": logo.name, className: cn("flex shrink-0 items-center text-muted-foreground", "opacity-90 transition-opacity duration-base ease-out-strong hover:opacity-100"), children: logo.mark }, logo.name))) }) })] }));
}
export { LogoMarquee };
//# sourceMappingURL=logo-marquee.js.map