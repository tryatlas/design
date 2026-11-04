import type { CanvasLinkStatus } from "./types.ts";
/**
 * The top-left pill: the pages toggle, where the canvas stands with the
 * room, the page you are on (also the shorthand page switcher, when `pages`
 * is given: a canvas is usually two clicks from another page), the zoom
 * readout, fit, and fullscreen. Each section renders only when its props
 * are given; `onFit` is the one control every canvas has.
 */
export declare function CanvasHeaderPill({ pageName, pageIcon, pages, activePageId, onOpenPage, status, statusLabel, pagesOpen, onTogglePages, zoom, onZoomIn, onZoomOut, onZoomReset, onFit, fullscreen, onToggleFullscreen, className, }: {
    pageName: string;
    /** An emoji before the name. */
    pageIcon?: string;
    /** The pages to switch between; without it the name is plain text. */
    pages?: Array<{
        id: string;
        name: string;
        icon?: string;
    }>;
    activePageId?: string | null;
    onOpenPage?: (id: string) => void;
    status?: CanvasLinkStatus;
    /** What the status means in words, shown on hover. */
    statusLabel?: string;
    pagesOpen: boolean;
    onTogglePages: () => void;
    /** The current zoom, 1 = 100%. The readout renders only when set. */
    zoom?: number;
    onZoomIn?: () => void;
    onZoomOut?: () => void;
    onZoomReset?: () => void;
    onFit: () => void;
    fullscreen?: boolean;
    onToggleFullscreen?: () => void;
    className?: string;
}): import("react").JSX.Element;
//# sourceMappingURL=canvas-header-pill.d.ts.map