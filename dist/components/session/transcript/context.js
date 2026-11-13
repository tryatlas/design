"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const TranscriptContext = createContext(null);
export function TranscriptProvider({ value, children, }) {
    return _jsx(TranscriptContext.Provider, { value: value, children: children });
}
/** The transcript's context. Throws outside a `TranscriptProvider`. */
export function useTranscript() {
    const value = useContext(TranscriptContext);
    if (!value)
        throw new Error("A transcript row rendered outside <TranscriptProvider>.");
    return value;
}
const notDiscussed = () => false;
/** `useRowDiscussed`, or never discussed when the app has no comments. */
export function useRowDiscussed(anchorId) {
    const use = useTranscript().useRowDiscussed ?? notDiscussed;
    return use(anchorId);
}
/** `useGroupDiscussed`, or never discussed when the app has no comments. */
export function useGroupDiscussed(anchorIds) {
    const use = useTranscript().useGroupDiscussed ?? notDiscussed;
    return use(anchorIds);
}
//# sourceMappingURL=context.js.map