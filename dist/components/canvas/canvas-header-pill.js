"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDownIcon, CrosshairIcon, Maximize2Icon, Minimize2Icon, MinusIcon, PlusIcon, } from "lucide-react";
import { RailGlyph } from "../../ui/animated-icon.js";
import { iconButtonVariants } from "../../ui/icon-button-variants.js";
import { cn } from "../../lib/utils.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger, } from "../../ui/dropdown-menu.js";
import { Icon } from "../../ui/icon.js";
import { Hint, Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip.js";
import { Spinner } from "../ui/spinner.js";
import { CanvasPill, CanvasPillButton, CanvasPillDivider } from "./canvas-chrome.js";
/** What the dot says when the app gives no `statusLabel`. */
const STATUS_WORDS = {
    live: "Live",
    syncing: "Reconnecting",
    offline: "Offline",
    archived: "Archived, read-only",
    viewing: "Viewing, not sharing",
};
const STATUS_DOT = {
    live: "bg-success",
    offline: "bg-warning",
    archived: "bg-muted-foreground",
    viewing: "bg-info",
};
/** The offline dot's tones: see `offlineTone`. */
const OFFLINE_DOT = { warning: "bg-warning", error: "bg-error" };
/**
 * The top-left pill: the pages toggle, where the canvas stands with the
 * room, the page you are on (also the shorthand page switcher, when `pages`
 * is given: a canvas is usually two clicks from another page), the zoom
 * readout, fit, and fullscreen. Each section renders only when its props
 * are given; `onFit` is the one control every canvas has.
 */
export function CanvasHeaderPill({ pageName, pageIcon, pages, activePageId, onOpenPage, emptyPagesLabel = "No pages yet.", status, statusLabel, offlineTone = "warning", pagesOpen, onTogglePages, zoom, onZoomIn, onZoomOut, onZoomReset, onFit, fullscreen, onToggleFullscreen, className, }) {
    const name = (_jsxs("span", { className: "min-w-0 max-w-44 truncate text-sm font-semibold text-foreground", children: [pageIcon && _jsx("span", { className: "mr-1.5", children: pageIcon }), pageName || "Untitled"] }));
    return (_jsxs(CanvasPill, { corner: "top-left", className: className, children: [_jsx(Hint, { label: pagesOpen ? "Hide pages" : "Show pages", children: _jsx("button", { type: "button", "aria-pressed": pagesOpen, onClick: onTogglePages, className: iconButtonVariants({ size: "sm" }), children: _jsx(RailGlyph, { open: pagesOpen, size: "md" }) }) }), _jsx(CanvasPillDivider, {}), status && _jsx(StatusDot, { status: status, label: statusLabel, offlineTone: offlineTone }), pages ? (_jsxs(DropdownMenu, { children: [_jsxs(DropdownMenuTrigger, { "aria-label": `${pageName || "Untitled"}, switch page`, className: "flex h-6 min-w-0 shrink items-center gap-1 rounded-md px-1 transition-colors duration-fast hover:bg-element-hover aria-expanded:bg-element-active", children: [name, _jsx(Icon, { icon: ChevronDownIcon, size: "xs", className: "shrink-0 text-muted-foreground" })] }), _jsx(DropdownMenuContent, { align: "start", sideOffset: 8, className: "w-56", children: _jsxs(DropdownMenuGroup, { children: [_jsx(DropdownMenuLabel, { children: "Pages" }), pages.length === 0 && (_jsx(DropdownMenuItem, { disabled: true, children: emptyPagesLabel })), _jsx(DropdownMenuRadioGroup, { value: activePageId ?? "", onValueChange: (id) => onOpenPage?.(String(id)), children: pages.map((p) => (_jsx(DropdownMenuRadioItem, { value: p.id, children: _jsxs("span", { className: "min-w-0 flex-1 truncate", children: [p.icon && _jsx("span", { className: "mr-1.5", children: p.icon }), p.name || "Untitled"] }) }, p.id))) })] }) })] })) : (_jsx("span", { className: "flex min-w-0 px-1", children: name })), zoom !== undefined && (_jsxs(_Fragment, { children: [_jsx(CanvasPillDivider, {}), onZoomOut && _jsx(CanvasPillButton, { icon: MinusIcon, label: "Zoom out", onClick: onZoomOut }), _jsx(Hint, { label: "Reset zoom to 100%", children: _jsxs("button", { type: "button", onClick: onZoomReset, disabled: !onZoomReset, "aria-label": `Zoom ${Math.round(zoom * 100)}%, reset to 100%`, className: "flex h-6 min-w-10 items-center justify-center rounded-md px-1 text-xs text-secondary-foreground tabular-nums transition-colors duration-fast hover:bg-element-hover hover:text-foreground disabled:pointer-events-none", children: [Math.round(zoom * 100), "%"] }) }), onZoomIn && _jsx(CanvasPillButton, { icon: PlusIcon, label: "Zoom in", onClick: onZoomIn })] })), _jsx(CanvasPillDivider, {}), _jsx(CanvasPillButton, { icon: CrosshairIcon, label: "Fit to view", onClick: onFit }), onToggleFullscreen && (_jsx(CanvasPillButton, { icon: fullscreen ? Minimize2Icon : Maximize2Icon, label: fullscreen ? "Exit fullscreen" : "Fullscreen", onClick: onToggleFullscreen }))] }));
}
/** Where the canvas stands with the room: a dot, or a spinner while it reconnects. */
function StatusDot({ status, label, offlineTone, }) {
    const glyph = (_jsx("span", { "data-status": status, role: "img", "aria-label": label ?? STATUS_WORDS[status], className: "flex size-4 shrink-0 items-center justify-center", children: status === "syncing" ? (_jsx(Spinner, { size: "xs", label: "" })) : (_jsx("span", { className: cn("size-1.5 rounded-full transition-colors duration-fast", status === "offline" ? OFFLINE_DOT[offlineTone] : STATUS_DOT[status]) })) }));
    if (!label)
        return glyph;
    return (_jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { render: glyph }), _jsx(TooltipContent, { side: "bottom", sideOffset: 4, children: label })] }));
}
//# sourceMappingURL=canvas-header-pill.js.map