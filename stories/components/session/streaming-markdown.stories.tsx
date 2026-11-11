import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import rehypeHighlight from "rehype-highlight";
import { expect, within } from "storybook/test";

import { StreamingMarkdown } from "../../../src/components/session/streaming-markdown.tsx";
import { streamingSource } from "./fixtures.ts";
import { contrastExempt } from "../../lib/a11y.ts";

const REHYPE = [rehypeHighlight];

const STATIC_SOURCE = [
  "# Sorting sessions",
  "",
  "Pinned sessions now sort **first**, then unread, then the rest by `lastActivityAt`.",
  "",
  "## What changed",
  "",
  "- The sort moved into `sortSessions`",
  "  - the list reads it",
  "  - so does the jump menu",
  "- Snoozed sessions sink to the end",
  "",
  "1. Pin a session",
  "2. Reload",
  "",
  "- [x] Port the sort",
  "- [ ] Remove the old comparator",
  "",
  "| Group | Order | Notes |",
  "| --- | --- | --- |",
  "| Pinned | 1 | in pin order |",
  "| Unread | 2 | newest first |",
  "| Snoozed | 3 | until they wake |",
  "",
  "> The jump menu used to keep its own copy of the comparator, which is how the two drifted.",
  "",
  "```ts",
  "export function sortSessions(rows: Row[]): Row[] {",
  "  // Pinned, then unread, then everything else.",
  "  return [...rows].sort((a, b) => rank(a) - rank(b) || b.at - a.at)",
  "}",
  "```",
  "",
  "```rust",
  "fn rank(row: &Row) -> u8 {",
  "    if row.pinned { 0 } else if row.unread { 1 } else { 2 }",
  "}",
  "```",
  "",
  "```bash",
  "bun run test src/features/sidebar/sort.test.ts --reporter=dot",
  "```",
  "",
  "See [the sidebar decision](https://example.com/adr/sidebar) for why.",
].join("\n");

const meta = {
  title: "Session/StreamingMarkdown",
  component: StreamingMarkdown,
  args: { source: STATIC_SOURCE, rehypePlugins: REHYPE, className: "max-w-2xl" },
  argTypes: { rehypePlugins: { control: false }, components: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          "Markdown that formats live as it streams. Finished blocks never re-parse; only the trailing block does, and an open code fence stays plain until it closes. Code is coloured by the consumer's `rehype-highlight` and the theme's `syntax.*` keys.",
      },
    },
  },
} satisfies Meta<typeof StreamingMarkdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = {
  parameters: contrastExempt("code-content"),
  // A task's checkbox is named for its item.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("checkbox", { name: "Port the sort" })).toBeChecked();
    await expect(
      canvas.getByRole("checkbox", { name: "Remove the old comparator" }),
    ).not.toBeChecked();
  },
};

/** Appends 12 characters every 30ms and starts over at the end. */
function Streamer({ rehypePlugins }: { rehypePlugins?: typeof REHYPE }) {
  const [length, setLength] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setLength((n) => (n >= streamingSource.length ? 0 : n + 12)), 30);
    return () => clearInterval(id);
  }, []);
  return (
    <StreamingMarkdown
      source={streamingSource.slice(0, length)}
      streaming={length < streamingSource.length}
      rehypePlugins={rehypePlugins}
      className="max-w-2xl"
    />
  );
}

export const Streaming: Story = {
  render: (args) => <Streamer rehypePlugins={args.rehypePlugins as typeof REHYPE} />,
};

export const Long: Story = {
  args: { source: Array.from({ length: 12 }, () => streamingSource).join("\n\n---\n\n") },
};

export const UntrustedInput: Story = {
  args: {
    source:
      'Raw HTML renders as text: <img src="x" onerror="alert(1)">.\n\nA [javascript: link](javascript:alert(1)) loses its href.',
  },
};
