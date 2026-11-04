import { type LucideIcon } from "lucide-react";
import type { PresencePeer } from "./types.ts";
export interface CanvasExportFormat {
    id: string;
    label: string;
    icon: LucideIcon;
}
/** The four formats both canvases export. */
export declare const CANVAS_EXPORT_FORMATS: CanvasExportFormat[];
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
export declare function CanvasActionPill({ peers, self, maxVisible, following, onFollow, followers, external, exportFormats, onExport, exporting, exportLabel, className, }: {
    peers?: PresencePeer[];
    self?: {
        name: string;
        image?: string | null;
    };
    /** Faces shown before the rest fold into "+N". */
    maxVisible?: number;
    /** The peer whose view you are riding. */
    following?: string | null;
    onFollow?: (id: string | null) => void;
    /** How many people are riding your view. */
    followers?: number;
    external?: {
        label: string;
        onOpen: () => void;
    };
    exportFormats?: CanvasExportFormat[];
    onExport?: (formatId: string) => void;
    exporting?: boolean;
    /**
     * The export button's visible label ("Export"). Unset, it is an icon
     * alone, named by its tooltip. While exporting the label stays, after a
     * spinner in place of the icon, so the pill does not change width.
     */
    exportLabel?: string;
    className?: string;
}): import("react").JSX.Element | null;
//# sourceMappingURL=canvas-action-pill.d.ts.map