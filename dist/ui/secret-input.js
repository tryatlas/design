"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Input } from "./input.js";
export function SecretInput({ configured = false, placeholder, onCommit, onBlur, onKeyDown, ...props }) {
    const [draft, setDraft] = useState("");
    const commit = () => {
        const value = draft.trim();
        if (!value)
            return;
        setDraft("");
        onCommit(value);
    };
    return (_jsx(Input, { ...props, type: "password", autoComplete: "off", spellCheck: false, value: draft, placeholder: configured ? "Stored. Type to replace" : (placeholder ?? "Not set"), onChange: (event) => setDraft(event.target.value), onBlur: (event) => {
            commit();
            onBlur?.(event);
        }, onKeyDown: (event) => {
            if (event.key === "Enter")
                commit();
            if (event.key === "Escape" && draft) {
                event.preventDefault();
                event.stopPropagation();
                setDraft("");
            }
            onKeyDown?.(event);
        } }));
}
//# sourceMappingURL=secret-input.js.map