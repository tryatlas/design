/**
 * A theme from its TOML, already parsed into plain objects by any TOML reader
 * (the generator uses `smol-toml`; this module takes no dependency on one).
 *
 * It mirrors what desktop's Rust `parse_theme` hands the frontend: nested
 * tables flatten to dotted names, the shared `[base]` is merged under each
 * variant's own, and a key written as `{ color = "…" }` stays a table. Rust
 * remains the validator of user themes; this only has to read the built-ins
 * and anything a web consumer chooses to load.
 */
export function themeFromToml(raw) {
    if (!isTable(raw))
        throw new Error("a theme must be a TOML table");
    const { schema, id, name, author, license } = raw;
    if (schema !== 1)
        throw new Error(`unsupported schema ${String(schema)}; expected 1`);
    if (typeof id !== "string" || !id.trim() || typeof name !== "string" || !name.trim()) {
        throw new Error("id and name must not be empty");
    }
    const shared = flattenStrings(raw.base, "base");
    const theme = {
        schema,
        id,
        name,
        author: typeof author === "string" ? author : "",
        license: typeof license === "string" ? license : "",
    };
    if (Object.keys(shared).length > 0)
        theme.base = shared;
    for (const appearance of ["dark", "light"]) {
        if (raw[appearance] !== undefined) {
            theme[appearance] = variantOf(raw[appearance], shared, appearance);
        }
    }
    if (!theme.dark && !theme.light) {
        throw new Error(`theme "${id}": at least one of [dark] or [light] is required`);
    }
    return theme;
}
function variantOf(value, shared, appearance) {
    if (!isTable(value))
        throw new Error(`[${appearance}] must be a table`);
    const unknown = Object.keys(value).filter((key) => !["base", "palette", "keys"].includes(key));
    if (unknown.length > 0) {
        throw new Error(`unknown ${appearance} field(s): ${unknown.join(", ")}`);
    }
    return {
        base: { ...shared, ...flattenStrings(value.base, `${appearance}.base`) },
        palette: flattenStrings(value.palette, `${appearance}.palette`),
        keys: flattenKeys(value.keys, `${appearance}.keys`),
    };
}
function flattenStrings(value, field) {
    const out = {};
    walk(value, "", field, (key, leaf) => {
        if (typeof leaf !== "string")
            throw new Error(`${field}.${key} must be a string`);
        out[key] = leaf;
    });
    return out;
}
function flattenKeys(value, field) {
    const out = {};
    walk(value, "", field, (key, leaf) => {
        if (typeof leaf === "string")
            out[key] = leaf;
        else if (isStyle(leaf))
            out[key] = { color: leaf.color };
        else
            throw new Error(`${field}.${key} must be a colour or { color = "…" }`);
    });
    return out;
}
function walk(value, prefix, field, leaf) {
    if (value === undefined)
        return;
    if (!isTable(value))
        throw new Error(`${field} must be a table`);
    for (const [name, child] of Object.entries(value)) {
        const key = prefix ? `${prefix}.${name}` : name;
        if (isTable(child) && !isStyle(child))
            walk(child, key, field, leaf);
        else
            leaf(key, child);
    }
}
function isStyle(value) {
    return (isTable(value) &&
        typeof value.color === "string" &&
        Object.keys(value).every((key) => key === "color"));
}
function isTable(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
//# sourceMappingURL=parse-theme.js.map