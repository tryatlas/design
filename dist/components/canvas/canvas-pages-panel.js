"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronRightIcon, FilePlus2Icon, FolderPlusIcon, Trash2Icon } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "../../lib/utils.js";
import { HintGroup, HintItem } from "../../ui/hint-group.js";
import { Icon } from "../../ui/icon.js";
import { IconButton } from "../../ui/icon-button.js";
import { Hint, Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip.js";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar.js";
/** Buttons inside a row act alone: no open, no fold, no drag start. */
const stop = (e) => e.stopPropagation();
const ownEvents = { onClick: stop, onPointerDown: stop, onKeyDown: stop, onDoubleClick: stop };
function firstName(name) {
    return name.trim().split(/\s+/)[0] || "Unknown";
}
/**
 * The pages column beside a canvas: a quiet "Pages" header with create
 * buttons, then one row per page or folder, already flattened by the app
 * (collapsed folders' children left out, `depth` set).
 *
 * Presentational. Reordering is the app's: it spreads its pointer handlers
 * on each row through `getRowProps` and passes back `dropIndicator`. Rename
 * is controlled when `renamingId` is given, else the panel keeps it.
 *
 * Without the optional props (authors, row actions, `deleteMode`) it is the
 * local canvas's panel; Spaces turns them on.
 */
export function CanvasPagesPanel({ rows, activeId, collapsedIds, onToggleFolder, onOpen, onCreate, allowFolders = false, renamingId: renamingIdProp, onRenamingChange, onRename, onDelete, onIconClick, dropIndicator, getRowProps, header, emptyLabel = "No pages yet.", rowActions, deleteMode = "hover", deleteLabel, lastPageLabel = "The last page cannot be deleted.", pageCount: pageCountProp, className, }) {
    const [ownRenaming, setOwnRenaming] = useState(null);
    const renamingId = renamingIdProp !== undefined ? renamingIdProp : ownRenaming;
    const setRenaming = (id) => {
        if (renamingIdProp === undefined)
            setOwnRenaming(id);
        onRenamingChange?.(id);
    };
    const pageCount = pageCountProp ?? rows.filter((r) => r.kind === "page").length;
    return (_jsxs("div", { "data-slot": "canvas-pages-panel", className: cn("flex h-full w-80 shrink-0 flex-col border-r border-border bg-card", className), children: [header, _jsxs("div", { className: "flex h-8 shrink-0 items-center gap-1 pr-2 pl-3", children: [_jsx("span", { className: "eyebrow flex-1 leading-none", children: "Pages" }), onCreate && (_jsxs(HintGroup, { children: [_jsx(HintItem, { label: "New page", children: _jsx(IconButton, { icon: FilePlus2Icon, label: "New page", variant: "outline", shape: "round", size: "xs", className: "text-secondary-foreground", onClick: () => onCreate("page") }) }), allowFolders && (_jsx(HintItem, { label: "New folder", children: _jsx(IconButton, { icon: FolderPlusIcon, label: "New folder", variant: "outline", shape: "round", size: "xs", className: "text-secondary-foreground", onClick: () => onCreate("folder") }) }))] }))] }), _jsxs("div", { className: "min-h-0 flex-1 overflow-y-auto px-1.5 py-1 [scrollbar-width:none]", children: [rows.map((row) => (_jsx(PageRow, { row: row, active: row.id === activeId, collapsed: collapsedIds?.has(row.id) ?? false, lastPage: row.kind === "page" && pageCount <= 1, renaming: renamingId === row.id, onOpen: onOpen, onToggleFolder: onToggleFolder, onStartRename: onRename ? () => setRenaming(row.id) : undefined, onCommitRename: (name) => {
                            setRenaming(null);
                            if (name && name !== row.name)
                                onRename?.(row.id, name);
                        }, onCancelRename: () => setRenaming(null), onDelete: onDelete, onIconClick: onIconClick, drop: dropIndicator?.id === row.id ? dropIndicator.where : null, rowProps: getRowProps?.(row.id), actions: rowActions?.(row) ?? [], deleteMode: deleteMode, lastPageLabel: lastPageLabel, deleteLabel: deleteLabel?.(row) ??
                            (row.kind === "folder" ? `Delete folder “${row.name}”` : `Delete “${row.name}”`) }, row.id))), rows.length === 0 && (_jsx("div", { className: "px-2 py-3 text-2xs text-muted-foreground", children: emptyLabel }))] })] }));
}
function PageRow({ row, active, collapsed, lastPage, renaming, onOpen, onToggleFolder, onStartRename, onCommitRename, onCancelRename, onDelete, onIconClick, drop, rowProps, actions, deleteMode, deleteLabel, lastPageLabel, }) {
    const folder = row.kind === "folder";
    const activate = () => (folder ? onToggleFolder?.(row.id) : onOpen(row.id));
    // Escape cancels, and the blur that follows must not commit.
    const cancelled = useRef(false);
    const icon = row.icon &&
        (onIconClick ? (_jsx(Hint, { label: "Change icon", children: _jsx("button", { type: "button", ...ownEvents, onClick: (e) => {
                    e.stopPropagation();
                    onIconClick(row.id, e.currentTarget.getBoundingClientRect());
                }, className: "flex size-5 shrink-0 items-center justify-center rounded text-xs leading-none transition-colors duration-fast hover:bg-element-hover", children: row.icon }) })) : (_jsx("span", { "aria-hidden": "true", className: "flex size-5 shrink-0 items-center justify-center text-xs leading-none", children: row.icon })));
    const showDelete = onDelete && !renaming && (deleteMode === "always" || !lastPage);
    return (_jsxs("div", { "data-page-id": row.id, ...rowProps, className: cn("relative", rowProps?.className), children: [drop && drop !== "into" && (_jsx("div", { "aria-hidden": "true", className: cn("pointer-events-none absolute inset-x-1 z-10 h-0.5 rounded-full bg-primary", drop === "before" ? "top-0" : "bottom-0") })), _jsxs("div", { onClick: renaming ? undefined : activate, className: cn("group/row flex cursor-pointer items-center gap-1.5 rounded px-1.5 text-xs", row.subtitle ? "py-2" : "min-h-control-md", active
                    ? "bg-element-selected text-foreground"
                    : "text-secondary-foreground hover:bg-element-hover", drop === "into" && "ring-1 ring-primary"), style: row.depth ? { paddingLeft: `calc(0.375rem + ${row.depth * 12}px)` } : undefined, children: [folder && (_jsx(Icon, { icon: ChevronRightIcon, size: "xs", className: cn("shrink-0 text-muted-foreground transition-transform duration-fast ease-out-strong", !collapsed && "rotate-90") })), icon, renaming ? (_jsx("input", { autoFocus: true, "aria-label": folder ? "Folder name" : "Page name", defaultValue: row.name, onFocus: (e) => e.currentTarget.select(), onClick: stop, onPointerDown: stop, onBlur: (e) => {
                            if (cancelled.current) {
                                cancelled.current = false;
                                return;
                            }
                            onCommitRename(e.currentTarget.value.trim());
                        }, onKeyDown: (e) => {
                            e.stopPropagation();
                            if (e.key === "Enter")
                                e.currentTarget.blur();
                            else if (e.key === "Escape") {
                                cancelled.current = true;
                                onCancelRename();
                            }
                        }, className: "focus-ring-none h-6 w-full min-w-0 flex-1 rounded bg-panel-input px-1 text-xs text-foreground ring-1 ring-primary outline-none" })) : (_jsxs("div", { role: "button", tabIndex: 0, "aria-current": active ? "page" : undefined, "aria-expanded": folder ? !collapsed : undefined, onKeyDown: (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                activate();
                            }
                        }, onDoubleClick: onStartRename
                            ? (e) => {
                                e.stopPropagation();
                                onStartRename();
                            }
                            : undefined, className: "flex min-w-0 flex-1 items-center gap-1.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring", children: [_jsxs("span", { className: "min-w-0 flex-1", children: [_jsx("span", { className: cn("block truncate", row.subtitle && "text-sm leading-snug font-medium"), children: row.name || "Untitled" }), row.subtitle && (_jsx("span", { className: "block truncate text-2xs leading-snug text-muted-foreground", children: row.subtitle }))] }), row.author && (_jsxs(Tooltip, { children: [_jsxs(TooltipTrigger, { render: _jsx("span", { className: "flex min-w-0 shrink-0 items-center gap-1" }), children: [_jsxs(Avatar, { size: "xs", "aria-hidden": "true", children: [row.author.image && _jsx(AvatarImage, { src: row.author.image, alt: "" }), _jsx(AvatarFallback, { children: firstName(row.author.name).charAt(0).toUpperCase() })] }), _jsx("span", { className: "max-w-16 truncate text-2xs text-muted-foreground", children: firstName(row.author.name) })] }), _jsxs(TooltipContent, { side: "top", sideOffset: 4, children: ["Created by ", row.author.name] })] }))] })), !renaming && actions.length > 0 && (_jsx("span", { className: "flex shrink-0 items-center gap-1", children: actions.map((a) => (_jsx(Hint, { label: a.label, children: _jsx(IconButton, { icon: a.icon, label: a.label, variant: "ghost", size: "xs", ...ownEvents, onClick: (e) => {
                                    e.stopPropagation();
                                    a.onSelect(row.id);
                                }, className: "rounded-full border border-border opacity-0 group-focus-within/row:opacity-100 group-hover/row:opacity-100 focus-visible:opacity-100" }) }, a.id))) })), showDelete &&
                        (deleteMode === "always" ? (_jsx(Hint, { label: lastPage ? lastPageLabel : deleteLabel, wrap: true, children: _jsx(IconButton, { icon: Trash2Icon, label: deleteLabel, variant: "outline", shape: "round", size: "xs", disabled: lastPage, ...ownEvents, onClick: (e) => {
                                    e.stopPropagation();
                                    onDelete(row.id);
                                }, className: "shrink-0 text-muted-foreground hover:text-error" }) })) : (_jsx(Hint, { label: deleteLabel, children: _jsx(IconButton, { icon: Trash2Icon, label: deleteLabel, variant: "ghost-destructive", size: "xs", ...ownEvents, onClick: (e) => {
                                    e.stopPropagation();
                                    onDelete(row.id);
                                }, className: "shrink-0 opacity-0 group-focus-within/row:opacity-100 group-hover/row:opacity-100 focus-visible:opacity-100" }) })))] })] }));
}
//# sourceMappingURL=canvas-pages-panel.js.map