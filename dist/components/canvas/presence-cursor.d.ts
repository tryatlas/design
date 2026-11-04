import type { CSSProperties, ReactNode, Ref } from "react";
import type { LabelTone } from "../../lib/types.ts";
/**
 * A collaborator's cursor: the arrow in their hue, and their first name on a
 * label of the same hue.
 *
 * Static on purpose. A peer's position arrives at the network's rate, and
 * each app eases it toward the newest target in its own animation-frame
 * loop, writing `style.transform` straight onto this element through `ref`:
 * no React render per frame. The root sits at the layer's origin
 * (`left-0 top-0`), so a `translate3d(x, y, 0)` is the whole position.
 */
export declare function PresenceCursor({ name, hue, ref, style, className, }: {
    name: string;
    hue: LabelTone;
    ref?: Ref<HTMLDivElement>;
    style?: CSSProperties;
    className?: string;
}): import("react").JSX.Element;
/**
 * The layer cursors live in: the canvas's full size, ignoring the pointer,
 * hidden from assistive tech (presence is in the action pill). No z-index:
 * placed after the nodes in the DOM it paints above them, and below the
 * `z-panel` pills.
 */
export declare function PresenceLayer({ children, className, }: {
    children?: ReactNode;
    className?: string;
}): import("react").JSX.Element;
//# sourceMappingURL=presence-cursor.d.ts.map