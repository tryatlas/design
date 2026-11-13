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
export * from "./components/session/markdown-blocks.js";
export * from "./components/session/session-pipeline.js";
export * from "./components/session/session-view-helpers.js";
export * from "./components/session/session-view.js";
export * from "./components/session/streaming-markdown.js";
export * from "./components/session/transcript/context.js";
export * from "./components/session/transcript/injected-row.js";
export * from "./components/session/transcript/interruption-row.js";
export * from "./components/session/transcript/jump-to-bottom-pill.js";
export * from "./components/session/transcript/labels.js";
export * from "./components/session/transcript/loading-state.js";
export * from "./components/session/transcript/marker-rows.js";
export * from "./components/session/transcript/model.js";
export * from "./components/session/transcript/parse-shell-command.js";
export * from "./components/session/transcript/parts.js";
export * from "./components/session/transcript/projection.js";
export * from "./components/session/transcript/prose-row.js";
export * from "./components/session/transcript/row.js";
export * from "./components/session/transcript/thinking-row.js";
export * from "./components/session/transcript/thought-headline.js";
export * from "./components/session/transcript/tool-glyph.js";
export * from "./components/session/transcript/transcript-loading.js";
export * from "./components/session/transcript/transcript-view.js";
export * from "./components/session/transcript/turn-rows.js";
export * from "./components/session/transcript/user-row.js";
export * from "./components/session/transcript/visible-animation.js";
export * from "./components/session/transcript/working-indicator.js";
//# sourceMappingURL=session.js.map