// The session entry (`@tryatlas/design/session`): the transcript (its row
// model, the rows, the frame around them and the helpers that name tool work),
// `StreamingMarkdown`, and the `SessionView` types `SessionPipeline` draws. A
// separate entry because `StreamingMarkdown` needs `react-markdown`,
// `remark-gfm`, `remark-parse` and `unified`, optional peers an app without
// session views never installs; the root entry imports none of them.
//
// Desktop and web each project their own session data onto the transcript's
// rows (`transcript/model.ts`) and render them with these, so the two look
// the same by construction.

export * from "./components/session/markdown-blocks.ts";
export * from "./components/session/session-pipeline.tsx";
export * from "./components/session/session-view-helpers.ts";
export * from "./components/session/session-view.ts";
export * from "./components/session/streaming-markdown.tsx";

export * from "./components/session/transcript/context.tsx";
export * from "./components/session/transcript/injected-row.tsx";
export * from "./components/session/transcript/interruption-row.tsx";
export * from "./components/session/transcript/jump-to-bottom-pill.tsx";
export * from "./components/session/transcript/labels.ts";
export * from "./components/session/transcript/loading-state.tsx";
export * from "./components/session/transcript/marker-rows.tsx";
export * from "./components/session/transcript/model.ts";
export * from "./components/session/transcript/parse-shell-command.ts";
export * from "./components/session/transcript/parts.tsx";
export * from "./components/session/transcript/projection.ts";
export * from "./components/session/transcript/prose-row.tsx";
export * from "./components/session/transcript/row.tsx";
export * from "./components/session/transcript/thinking-row.tsx";
export * from "./components/session/transcript/thought-headline.ts";
export * from "./components/session/transcript/tool-glyph.tsx";
export * from "./components/session/transcript/transcript-loading.tsx";
export * from "./components/session/transcript/transcript-view.tsx";
export * from "./components/session/transcript/turn-rows.tsx";
export * from "./components/session/transcript/user-row.tsx";
export * from "./components/session/transcript/visible-animation.ts";
export * from "./components/session/transcript/working-indicator.tsx";
