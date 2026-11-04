"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { Textarea } from "./textarea.js";
function InputGroup({ className, ...props }) {
    return (_jsx("div", { "data-slot": "input-group", role: "group", className: cn("group/input-group relative flex h-control-md w-full min-w-0 items-center rounded border border-border bg-panel-input transition-colors duration-fast ease-out-strong outline-none in-data-[slot=combobox-content]:focus-within:border-inherit has-[[data-slot=input-group-control]:focus]:border-border-strong has-[[data-slot=input-group-control]:focus-visible]:outline-2 has-[[data-slot=input-group-control]:focus-visible]:outline-offset-1 has-[[data-slot=input-group-control]:focus-visible]:outline-ring has-[[data-slot=input-group-control]:focus-visible]:outline-solid has-[[data-slot][aria-invalid=true]]:border-destructive has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5", className), ...props }));
}
const inputGroupAddonVariants = cva("flex h-auto cursor-text items-center justify-center gap-1 py-1.5 text-xs font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>svg:not([class*='size-'])]:size-3.5", {
    variants: {
        align: {
            "inline-start": "order-first pl-2 has-[>button]:ml-[-0.275rem] has-[>kbd]:ml-[-0.275rem]",
            "inline-end": "order-last pr-2 has-[>button]:mr-[-0.275rem] has-[>kbd]:mr-[-0.275rem]",
            "block-start": "order-first w-full justify-start px-2 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
            "block-end": "order-last w-full justify-start px-2 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
        },
    },
    defaultVariants: {
        align: "inline-start",
    },
});
function InputGroupAddon({ className, align = "inline-start", ...props }) {
    return (_jsx("div", { role: "group", "data-slot": "input-group-addon", "data-align": align, className: cn(inputGroupAddonVariants({ align }), className), onClick: (e) => {
            if (e.target.closest("button")) {
                return;
            }
            e.currentTarget.parentElement?.querySelector("input")?.focus();
        }, ...props }));
}
const inputGroupButtonVariants = cva("flex items-center gap-2 rounded text-xs", {
    variants: {
        size: {
            xs: "h-control-xs gap-1 px-1 [&>svg:not([class*='size-'])]:size-3",
            sm: "gap-1",
            "icon-xs": "size-control-sm p-0 has-[>svg]:p-0",
            "icon-sm": "size-control-md p-0 has-[>svg]:p-0",
        },
    },
    defaultVariants: {
        size: "xs",
    },
});
function InputGroupButton({ className, type = "button", variant = "ghost", size = "xs", ...props }) {
    return (_jsx(Button, { type: type, "data-size": size, variant: variant, className: cn(inputGroupButtonVariants({ size }), className), ...props }));
}
function InputGroupText({ className, ...props }) {
    return (_jsx("span", { className: cn("flex items-center gap-2 text-xs text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4", className), ...props }));
}
// The group is what shows focus: its border lifts to `--border-strong`, and
// on keyboard focus it carries the global ring (2px of `--ring`, offset 1px)
// around the whole field. The control opts out of that ring
// (`focus-ring-none`), which would otherwise draw a second one inside the
// group's border.
function InputGroupInput({ className, ...props }) {
    return (_jsx(Input, { "data-slot": "input-group-control", className: cn("flex-1 rounded-none border-0 bg-transparent focus:border-0 focus-ring-none", className), ...props }));
}
function InputGroupTextarea({ className, ...props }) {
    return (_jsx(Textarea, { "data-slot": "input-group-control", className: cn("flex-1 resize-none rounded-none border-0 bg-transparent py-1.5 focus-ring-none", className), ...props }));
}
export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput, InputGroupTextarea, };
//# sourceMappingURL=input-group.js.map