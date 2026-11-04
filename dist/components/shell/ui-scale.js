"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MinusIcon, PlusIcon, TypeIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { Button } from "../../ui/button.js";
import { Icon } from "../../ui/icon.js";
import { IconButton } from "../../ui/icon-button.js";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover.js";
/**
 * The interface-scale control: a stepper, the named presets with a preview
 * glyph, and Reset. Desktop's `UiScalePanel`, made props-only.
 *
 * It owns no state and applies nothing. HOW a scale is applied is the app's:
 * desktop sets the native WebView zoom, and a browser app wants CSS `zoom` on
 * the root (or the browser's own zoom). Scaling the root font size does not
 * work — the type scale, control heights and radii are px, so only the
 * rem-based spacing would grow.
 */
export const UI_SCALE_MIN = 0.5;
export const UI_SCALE_MAX = 2;
export const UI_SCALE_STEP = 0.1;
export const UI_SCALE_DEFAULT = 1;
/** The named steps. The stepper still moves on the `UI_SCALE_STEP` grid; a
 *  preset is just a shortcut to a size worth naming. */
export const UI_SCALE_PRESETS = [
    { value: 0.9, label: "Compact" },
    { value: 1, label: "Default" },
    { value: 1.15, label: "Large" },
    { value: 1.3, label: "Larger" },
];
/** Round to a clean grid and clamp, so repeated steps do not drift. */
export function clampUiScale(scale) {
    const clamped = Math.min(UI_SCALE_MAX, Math.max(UI_SCALE_MIN, scale));
    return Math.round(clamped * 100) / 100;
}
/** The preview glyph per preset, on the type scale rather than an inline
 *  `fontSize`, so the column shows real steps. */
const PREVIEW_CLASS = ["text-xs", "text-sm", "text-md", "text-lg"];
/** The panel itself, for a menu's submenu or a popover. */
function UiScalePanel({ scale, onScaleChange }) {
    const set = (next) => onScaleChange(clampUiScale(next));
    const pct = Math.round(scale * 100);
    return (_jsxs("div", { "data-slot": "ui-scale-panel", className: "flex flex-col p-0.5 select-none", children: [_jsxs("div", { className: "flex flex-col gap-0.5 px-1.5 pt-1 pb-2.5", children: [_jsx("span", { className: "label text-foreground", children: "Interface scale" }), _jsx("span", { className: "caption", children: "Everything grows together \u2014 type, controls, spacing." })] }), _jsxs("div", { className: "overflow-hidden rounded-lg border border-border bg-background", children: [_jsxs("div", { className: "flex items-center gap-2 border-b border-border-subtle px-2 py-1.5", children: [_jsx(IconButton, { icon: MinusIcon, label: "Smaller", size: "sm", variant: "outline", shape: "round", disabled: scale <= UI_SCALE_MIN, onClick: () => set(scale - UI_SCALE_STEP) }), _jsxs("span", { className: "flex-1 text-center text-xs font-medium text-foreground tabular-nums", children: [pct, "%"] }), _jsx(IconButton, { icon: PlusIcon, label: "Larger", size: "sm", variant: "outline", shape: "round", disabled: scale >= UI_SCALE_MAX, onClick: () => set(scale + UI_SCALE_STEP) })] }), _jsx("div", { className: "flex flex-col gap-px p-1", children: UI_SCALE_PRESETS.map((preset, i) => {
                            const active = Math.abs(preset.value - scale) < 0.001;
                            return (_jsxs("button", { type: "button", onClick: () => set(preset.value), className: cn("flex h-7 cursor-pointer items-center gap-2 rounded-md px-2 text-left text-xs", "transition-colors duration-fast ease-out-strong", active
                                    ? "bg-element-selected text-foreground"
                                    : "text-muted-foreground hover:bg-element-hover hover:text-foreground"), children: [_jsx("span", { className: cn("w-5 text-center leading-none font-semibold", PREVIEW_CLASS[i]), children: "A" }), _jsx("span", { className: "flex-1", children: preset.label }), _jsxs("span", { className: "text-2xs text-muted-foreground tabular-nums", children: [Math.round(preset.value * 100), "%"] })] }, preset.value));
                        }) })] }), _jsx("div", { className: "pt-1.5", children: _jsx(Button, { variant: "ghost", size: "sm", className: "w-full", disabled: scale === UI_SCALE_DEFAULT, onClick: () => set(UI_SCALE_DEFAULT), children: "Reset to default" }) })] }));
}
/** The panel behind a trigger, for a toolbar or a rail footer. */
function UiScaleControl({ scale, onScaleChange, className, iconOnly = false, }) {
    const pct = Math.round(scale * 100);
    return (_jsxs(Popover, { children: [_jsx(PopoverTrigger, { render: iconOnly ? (_jsx(IconButton, { icon: TypeIcon, label: `Interface scale, ${pct}%`, size: "sm", className: className })) : (_jsxs(Button, { variant: "ghost", size: "sm", className: cn("gap-1.5 text-muted-foreground", className), "aria-label": `Interface scale, ${pct}%`, children: [_jsx(Icon, { icon: TypeIcon, size: "sm" }), _jsxs("span", { className: "text-2xs tabular-nums", children: [pct, "%"] })] })) }), _jsx(PopoverContent, { align: "end", surface: "tinted", className: "w-60", children: _jsx(UiScalePanel, { scale: scale, onScaleChange: onScaleChange }) })] }));
}
export { UiScaleControl, UiScalePanel };
//# sourceMappingURL=ui-scale.js.map