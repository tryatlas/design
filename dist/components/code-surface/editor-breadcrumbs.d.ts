export interface EditorBreadcrumbsProps {
    /** The path's parts, root first: `pathSegments(path, root)`. */
    segments: readonly string[];
    /** Crumbs shown before the middle collapses into one ellipsis. */
    maxVisible?: number;
    /** The file has unsaved edits: a dot after its name. */
    dirty?: boolean;
    /** Makes every crumb but the file a button; gets the crumb's index in `segments`. */
    onSelect?: (index: number) => void;
    className?: string;
}
/**
 * The file view's path, desktop's `FileBreadcrumbs` in its looks: folders
 * muted, the file in the foreground, chevrons between. Each crumb truncates
 * on its own, and a long path keeps its first and last crumbs and folds the
 * middle into an ellipsis whose tooltip lists what it hides. The `nav`'s
 * tooltip is the whole path.
 *
 * Desktop's folder menus (the chevron that lists a folder's entries) read the
 * filesystem, so they stay in the app.
 */
export declare function EditorBreadcrumbs({ segments, maxVisible, dirty, onSelect, className, }: EditorBreadcrumbsProps): import("react").JSX.Element | null;
//# sourceMappingURL=editor-breadcrumbs.d.ts.map