"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DownloadIcon, ExternalLinkIcon, EyeIcon, FileImageIcon, FileTextIcon, FileType2Icon, } from "lucide-react";
import { Fragment } from "react";
import { PEER_INK } from "../../lib/actor-hue.js";
import { cn } from "../../lib/utils.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, } from "../../ui/dropdown-menu.js";
import { Button } from "../../ui/button.js";
import { Icon } from "../../ui/icon.js";
import { IconButton } from "../../ui/icon-button.js";
import { Hint } from "../../ui/tooltip.js";
import { PersonAvatar } from "../patterns/person-avatar.js";
import { Spinner } from "../ui/spinner.js";
import { CanvasPill, CanvasPillButton, CanvasPillDivider } from "./canvas-chrome.js";
/** The four formats both canvases export. */
export const CANVAS_EXPORT_FORMATS = [
    { id: "png", label: "PNG", icon: FileImageIcon },
    { id: "jpeg", label: "JPEG", icon: FileImageIcon },
    { id: "svg", label: "SVG", icon: FileType2Icon },
    { id: "pdf", label: "PDF", icon: FileTextIcon },
];
/**
 * The top-right pill: who is here, the link out, and export, divided rather
 * than scattered across the corner. Peers come first and you last: an empty
 * corner reads as "nobody is here", which is never true while you are. Each
 * peer's face is ringed in their hue, so the avatar and their cursor read as
 * the same person; with `onFollow` a face is also the follow toggle.
 *
 * Every section, and the divider before it, renders only when its props are
 * given, so the local canvas passes export alone.
 */
export function CanvasActionPill({ peers, self, maxVisible = 4, following, onFollow, followers, external, exportFormats, onExport, exporting = false, exportLabel, className, }) {
    const sections = [];
    const visible = peers?.slice(0, maxVisible) ?? [];
    const hidden = peers?.slice(maxVisible) ?? [];
    if (visible.length > 0 || self || (followers ?? 0) > 0) {
        sections.push(_jsxs("div", { className: "flex items-center pr-0.5 pl-0.5", children: [_jsxs("div", { className: "flex items-center -space-x-1", children: [visible.map((p) => (_jsx(PeerFace, { peer: p, riding: following === p.id, onFollow: onFollow }, p.id))), self && (_jsx(Hint, { label: `${self.name} (you)`, children: _jsx("span", { role: "img", className: "inline-flex rounded-full ring-2 ring-card", children: _jsx(PersonAvatar, { name: self.name, image: self.image ?? undefined, size: "xs" }) }) }))] }), hidden.length > 0 && (_jsx(Hint, { label: `${hidden.length} more: ${hidden.map((p) => p.name).join(", ")}`, children: _jsxs("span", { role: "img", className: "pl-1.5 text-2xs text-muted-foreground tabular-nums", children: ["+", hidden.length] }) })), (followers ?? 0) > 0 && (_jsx(Hint, { label: followers === 1
                        ? "1 person is following your view"
                        : `${followers} people are following your view`, children: _jsxs("span", { role: "img", className: "ml-1.5 flex h-5 items-center gap-1 rounded-full bg-primary/15 px-1.5 text-2xs font-medium text-primary tabular-nums", children: [_jsx(Icon, { icon: EyeIcon, size: "xs" }), followers] }) }))] }, "presence"));
    }
    if (external) {
        sections.push(_jsx(CanvasPillButton, { icon: ExternalLinkIcon, label: external.label, onClick: external.onOpen }, "external"));
    }
    if (exportFormats && exportFormats.length > 0 && onExport) {
        sections.push(_jsxs(DropdownMenu, { children: [_jsx(Hint, { label: exporting ? "Exporting…" : "Export canvas", children: _jsx(DropdownMenuTrigger, { disabled: exporting, render: exportLabel ? (_jsxs(Button, { variant: "ghost", size: "sm", "aria-label": exportLabel, "aria-busy": exporting || undefined, className: "gap-1.5 px-1.5", children: [exporting ? (_jsx(Spinner, { size: "sm", label: "" })) : (_jsx(Icon, { icon: DownloadIcon, size: "sm" })), exportLabel] })) : exporting ? (_jsx("button", { type: "button", "aria-label": "Exporting\u2026", className: "flex size-control-sm items-center justify-center rounded", children: _jsx(Spinner, { size: "sm", label: "" }) })) : (_jsx(IconButton, { icon: DownloadIcon, label: "Export canvas", size: "sm" })) }) }), _jsx(DropdownMenuContent, { align: "end", sideOffset: 8, className: "w-36", children: _jsxs(DropdownMenuGroup, { children: [_jsx(DropdownMenuLabel, { children: "Export as" }), exportFormats.map((f) => (_jsxs(DropdownMenuItem, { onClick: () => onExport(f.id), children: [_jsx(Icon, { icon: f.icon, size: "sm", className: "text-muted-foreground" }), f.label] }, f.id)))] }) })] }, "export"));
    }
    if (sections.length === 0)
        return null;
    return (_jsx(CanvasPill, { corner: "top-right", className: cn("px-1.5", className), children: sections.map((section, i) => (_jsxs(Fragment, { children: [i > 0 && _jsx(CanvasPillDivider, {}), section] }, i))) }));
}
/** A peer's face, ringed in their hue; the follow toggle when the app can follow. */
function PeerFace({ peer, riding, onFollow, }) {
    const face = _jsx(PersonAvatar, { name: peer.name, image: peer.image, size: "xs" });
    const ring = cn("relative inline-flex rounded-full ring-2", riding ? "z-10 scale-110 ring-primary ring-offset-2 ring-offset-card" : PEER_INK[peer.hue].ring);
    if (!onFollow) {
        return (_jsx(Hint, { label: peer.name, children: _jsx("span", { role: "img", className: ring, children: face }) }));
    }
    // The button lies over the face rather than around it: the initials are
    // the face, not the control's words, and a button named "Follow Ana Ruiz"
    // whose text reads "AR" is a mismatch to a screen reader user.
    return (_jsxs("span", { className: cn(ring, "transition-transform duration-fast ease-out-strong hover:z-10 motion-safe:hover:scale-110 motion-safe:has-active:scale-95"), children: [face, _jsx(Hint, { label: riding ? `Stop following ${peer.name}` : `Follow ${peer.name}`, children: _jsx("button", { type: "button", "aria-pressed": riding, "aria-label": `Follow ${peer.name}`, onClick: () => onFollow(riding ? null : peer.id), className: "absolute inset-0 cursor-pointer rounded-full" }) })] }));
}
//# sourceMappingURL=canvas-action-pill.js.map