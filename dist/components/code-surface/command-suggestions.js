"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { FileTextIcon, FolderIcon, SquareTerminalIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { Icon } from "../../ui/icon.js";
/** The option element's id, for the field's `aria-activedescendant`. */
export function commandSuggestionId(id, index) {
    return `${id}-option-${index}`;
}
const GLYPH = { dir: FolderIcon, command: SquareTerminalIcon, file: FileTextIcon };
/**
 * The terminal's completion list, floating above the command field
 * (desktop's `command-suggestions.tsx`). Controlled: the app owns the items
 * and the active row, which follows Tab. It never takes focus, and a press on
 * a row is cancelled, so typing carries on in the field; a press on the field
 * itself does not close it. It follows Tab and arrow keys, so it does not
 * animate.
 */
export function CommandSuggestions({ id, open, items, activeIndex, anchor, onSelect, onOpenChange, }) {
    const activeRow = React.useRef(null);
    const shown = open && items.length > 0 && anchor !== null;
    // Keep the highlighted row in view as Tab cycles past the edge.
    React.useEffect(() => {
        if (shown)
            activeRow.current?.scrollIntoView?.({ block: "nearest" });
    }, [shown, activeIndex]);
    return (_jsx(PopoverPrimitive.Root, { open: shown, modal: false, onOpenChange: (next, details) => {
            if (!next &&
                details.reason === "outside-press" &&
                anchor &&
                details.event.target instanceof Node &&
                anchor.contains(details.event.target)) {
                details.cancel();
                return;
            }
            onOpenChange(next);
        }, children: _jsx(PopoverPrimitive.Portal, { children: _jsx(PopoverPrimitive.Positioner, { anchor: anchor, side: "top", align: "start", sideOffset: 6, className: "isolate z-popover", children: _jsxs(PopoverPrimitive.Popup, { "aria-label": "Completions", initialFocus: false, finalFocus: false, onMouseDown: (e) => e.preventDefault(), className: "flex w-(--anchor-width) max-w-[460px] min-w-[260px] flex-col overflow-hidden rounded-md border border-border bg-popover shadow-md outline-none", children: [_jsx("div", { id: id, role: "listbox", "aria-label": "Completions", className: "max-h-[248px] overflow-y-auto py-1", children: items.map((item, i) => {
                                const active = i === activeIndex;
                                return (_jsxs("div", { id: commandSuggestionId(id, i), ref: active ? activeRow : undefined, role: "option", "aria-selected": active, onMouseDown: (e) => {
                                        e.preventDefault();
                                        onSelect(item);
                                    }, className: cn("flex h-control-sm cursor-pointer items-center gap-2 px-2.5 font-mono text-sm", active
                                        ? "bg-element-selected text-foreground"
                                        : "text-secondary-foreground hover:bg-element-hover"), children: [_jsx(Icon, { icon: GLYPH[item.kind], size: "xs", className: item.kind === "dir" ? "text-primary" : "text-muted-foreground" }), _jsxs("span", { className: "truncate", children: [item.name, item.kind === "dir" ? "/" : ""] })] }, `${item.kind}:${item.name}`));
                            }) }), _jsx("div", { className: "flex h-control-sm shrink-0 items-center justify-end border-t border-border px-2.5 text-3xs tracking-wider text-muted-foreground uppercase", children: "\u21E5 \u2191\u2193 cycle \u00B7 \u21B5 run \u00B7 \u238B" })] }) }) }) }));
}
//# sourceMappingURL=command-suggestions.js.map