import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import rehypeHighlight from "rehype-highlight";
import { expect, userEvent, within } from "storybook/test";

import {
  JumpToBottomPill,
  LoadingTranscriptState,
  StreamingMarkdown,
  TranscriptProvider,
  TranscriptRowItem,
  TranscriptView,
  type Row,
  type TranscriptChangedFilesProps,
  type TranscriptContextValue,
  type TranscriptMarkdownProps,
} from "../../../src/session.ts";
import { contrastExempt } from "../../lib/a11y.ts";
import {
  errorTurn,
  liveTurn,
  longSession,
  prose,
  settledTurn,
  user,
  withOpen,
  workingTurn,
} from "./transcript-fixtures.ts";
import { streamingSource } from "./fixtures.ts";

const REHYPE = [rehypeHighlight];

/** The app's markdown: here, the package's own renderer. */
function Markdown({ source, streaming, className }: TranscriptMarkdownProps) {
  return (
    <StreamingMarkdown
      source={source}
      streaming={streaming}
      rehypePlugins={REHYPE}
      className={className}
    />
  );
}

/** A stand-in for the app's changed-files card: the files and their counts. */
function ChangedFiles({ row }: TranscriptChangedFilesProps) {
  return (
    <ul className="rounded-lg border border-border-subtle bg-card px-3 py-2 text-xs">
      {row.files.map((file) => (
        <li key={file.path} className="flex h-6 items-center gap-2">
          <span className="min-w-0 flex-1 truncate font-mono text-secondary-foreground">
            {file.path}
          </span>
          <span className="font-mono text-2xs tabular-nums text-diff-added-text">
            +{file.added}
          </span>
          <span className="font-mono text-2xs tabular-nums text-error">−{file.removed}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * A transcript as an app mounts it: the provider, the frame, one
 * `TranscriptRowItem` per row, and the open state the app owns.
 */
function Transcript({
  rows,
  working = false,
  height = 640,
}: {
  rows: readonly Row[];
  working?: boolean;
  height?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set());
  const [more, setMore] = useState(false);
  const toggle = (set: typeof setExpanded) => (id: string) =>
    set((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(id)) nextSet.delete(id);
      else nextSet.add(id);
      return nextSet;
    });
  const value = useMemo<TranscriptContextValue>(
    () => ({
      Markdown,
      ChangedFiles,
      onToggleExpand: toggle(setExpanded),
      onToggleGroup: toggle(setOpen),
      onOpenMarker: () => {},
      onOpenSubagent: () => {},
      onRetry: () => {},
      onContinue: () => {},
    }),
    [],
  );
  const shown = useMemo(() => withOpen(rows, expanded, open), [rows, expanded, open]);
  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) setMore(el.scrollHeight - el.scrollTop - el.clientHeight > 4);
  }, []);
  useEffect(onScroll, [onScroll, shown]);
  return (
    // ratchet-allow: a story frame sized to the story's argument, not a scale value.
    <div className="flex flex-col bg-background" style={{ height }}>
      <TranscriptProvider value={value}>
        <TranscriptView
          scrollRef={scrollRef}
          contentRef={contentRef}
          onScroll={onScroll}
          topInset={0}
          empty={shown.length === 0 && !working}
          rowViews={shown.map((row, i) => (
            <TranscriptRowItem key={row.id} row={row} priority={i} agentLabel="Claude Code" />
          ))}
          turnInProgress={working}
          working={working}
          more={more}
        />
      </TranscriptProvider>
      <div className="relative h-12 shrink-0 border-t border-border-subtle">
        {more && (
          <JumpToBottomPill
            count={0}
            onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })}
          />
        )}
      </div>
    </div>
  );
}

/** Appends to a streaming answer every 40ms and starts over at the end. */
function Streaming() {
  const [length, setLength] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setLength((n) => (n >= streamingSource.length ? 0 : n + 14)), 40);
    return () => clearInterval(id);
  }, []);
  const rows = useMemo(() => {
    const base = settledTurn(1);
    const live = user("s", "Explain how the incremental split works.");
    const answer = {
      ...prose("s", streamingSource.slice(0, length), { header: true }),
      id: "p:stream",
      streaming: length < streamingSource.length,
    };
    return [...base, live, answer];
  }, [length]);
  return <Transcript rows={rows} />;
}

const meta = {
  title: "Session/Transcript",
  component: Transcript,
  args: { rows: [...settledTurn(1), ...workingTurn()] },
  argTypes: { rows: { control: false } },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A session's transcript: the row model (`Row`), the rows, and the frame they scroll in. Each app projects its own data onto the rows and hands the rest — markdown, actions, comments, the changed-files card, what a tool line opens — in through `TranscriptProvider`.",
      },
    },
  },
} satisfies Meta<typeof Transcript>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: contrastExempt("code-content"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // A folded block opens in place.
    const block = canvas.getByRole("button", { name: /Read 2 files and searched code once/ });
    await userEvent.click(block);
    await expect(block).toHaveAttribute("aria-expanded", "true");
    const opened = canvasElement.querySelector(
      `#${CSS.escape(block.getAttribute("aria-controls")!)}`,
    );
    await expect(opened).not.toBeNull();
    await expect(within(opened as HTMLElement).getByText("stores/sessions-store.ts")).toBeVisible();
  },
};

export const ManyToolCalls: Story = {
  args: { rows: workingTurn() },
  parameters: contrastExempt("code-content"),
};

export const Live: Story = {
  args: { rows: [...settledTurn(1), ...liveTurn()] },
  parameters: contrastExempt("code-content"),
};

export const StreamingAnswer: Story = {
  render: () => <Streaming />,
  parameters: contrastExempt("code-content"),
};

export const Errors: Story = {
  args: { rows: errorTurn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText(/Your computer slept for 21m and the reply was cut off/),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Details" }));
    await expect(canvas.getByText("error decoding response body")).toBeVisible();
  },
};

export const LongSession: Story = {
  args: { rows: longSession(40) },
  parameters: contrastExempt("code-content"),
};

export const WaitingForModel: Story = {
  args: { rows: [user("w", "Summarise the last three sessions.")], working: true },
};

export const Empty: Story = {
  args: { rows: [] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("No messages yet.")).toBeVisible();
  },
};

export const Loading: Story = {
  render: () => (
    <div className="h-160 bg-background">
      <LoadingTranscriptState />
    </div>
  ),
};
