import { DERIVED_VAR_REGISTRY, THEME_KEY_REGISTRY } from "../theme/theme-key-registry.js";
const ROLE_RENAMES = {
    hairline: { variable: "border-subtle", utility: "border-subtle" },
    surface: { variable: "panel-background", utility: "panel" },
    "shell-canvas": { variable: "sidebar", utility: "sidebar" },
    "shell-edge": { variable: "sidebar-border", utility: "sidebar-border" },
    "segment-thumb": { variable: "element-active", utility: "element-active" },
    success: { variable: "status-success-foreground", utility: "success" },
    warning: { variable: "status-warning-foreground", utility: "warning" },
    error: { variable: "status-error-foreground", utility: "error" },
    info: { variable: "status-info-foreground", utility: "info" },
    "success-muted": { variable: "status-success-background", utility: "success-muted" },
    "warning-muted": { variable: "status-warning-background", utility: "warning-muted" },
    "error-muted": { variable: "status-error-background", utility: "error-muted" },
    "info-muted": { variable: "status-info-background", utility: "info-muted" },
    selection: { variable: "selection-background", utility: null },
    "scrollbar-thumb": { variable: "scrollbar-thumb-background", utility: null },
    "diff-added": { variable: "diff-added-background", utility: null },
    "diff-removed": { variable: "diff-removed-background", utility: null },
    "diff-added-foreground": { variable: "diff-added-text", utility: null },
    "diff-removed-foreground": { variable: "diff-removed-text", utility: null },
};
const PREFIX_DROPS = Object.fromEntries([...THEME_KEY_REGISTRY, ...DERIVED_VAR_REGISTRY].map(({ cssVar }) => {
    const name = cssVar.slice(2);
    return [`atlas-${name}`, { variable: name, utility: null }];
}));
export const D23_RENAMES = Object.freeze({
    ...ROLE_RENAMES,
    ...PREFIX_DROPS,
});
//# sourceMappingURL=d23-renames.js.map