/**
 * The tab and toolbar shapes `Segmented` (src/ui) does not cover. A choice
 * among a few views is `Segmented`; these are a page's section tabs, a
 * filter pill and a cluster of tools. Each draws on the same track — a
 * hairline `border` round a `rounded-full` row — so they read as one family.
 */
export type UnderlineTabOption<T extends string> = {
    value: T;
    label: React.ReactNode;
    count?: React.ReactNode;
    icon?: React.ReactNode;
};
/**
 * Page-level tabs with a sliding underline. The active rule is ONE
 * shared-`layoutId` element that slides between tabs on `SPRING_INDICATOR`,
 * rather than two rules cross-fading.
 */
declare function UnderlineTabs<T extends string>({ options, value, onChange, className, }: {
    options: Array<UnderlineTabOption<T>>;
    value: T;
    onChange: (value: T) => void;
    className?: string;
}): import("react").JSX.Element;
/** The `muted label │ value ⌄` toolbar pill. */
declare function CompoundFilter({ label, children, className, onClick, }: {
    label: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}): import("react").JSX.Element;
/**
 * Icon buttons set into one track — the same hairline pill as `Segmented`,
 * for a cluster of related tools rather than a choice between views. Each
 * child is its own button; a pressed one (`aria-pressed`) takes the
 * selected fill, as `IconButton` already does.
 */
declare function SegmentedIconGroup({ orientation, className, ...props }: React.ComponentProps<"div"> & {
    orientation?: "horizontal" | "vertical";
}): import("react").JSX.Element;
export { CompoundFilter, SegmentedIconGroup, UnderlineTabs };
//# sourceMappingURL=segmented.d.ts.map