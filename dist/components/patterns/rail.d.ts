import type { CSSProperties, ReactNode } from "react";
interface RailProps {
    /** What hangs in the gutter: a `RailNode`, a face, a status glyph. 32px across. */
    node: ReactNode;
    /** The first row: the hairline starts at its node. */
    first?: boolean;
    /** The last row: the hairline stops at its node. */
    last?: boolean;
    className?: string;
    style?: CSSProperties;
    /** The content column's classes; its `pb-4` is the space between rows. */
    contentClassName?: string;
    children: ReactNode;
}
/** One row on the rail: its node in the gutter and its slice of the hairline, half-height at the ends. */
declare function Rail({ node, first, last, className, style, contentClassName, children, }: RailProps): import("react").JSX.Element;
/** The round node a row hangs from: 32px, a quiet border, opaque over the hairline. */
declare function RailNode({ children, className }: {
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
export { Rail, RailNode };
export type { RailProps };
//# sourceMappingURL=rail.d.ts.map