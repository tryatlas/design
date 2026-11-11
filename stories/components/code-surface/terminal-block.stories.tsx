import type { Meta, StoryObj } from "@storybook/react-vite";
import { LockIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { expect, fireEvent, fn, userEvent, within } from "storybook/test";

import {
  ANSI_NAMES,
  highlightRanges,
  type AnsiIndex,
  type TerminalLine,
  type TerminalSegment,
} from "../../../src/components/code-surface/code-surface.ts";
import {
  TerminalBlock,
  TerminalOutput,
} from "../../../src/components/code-surface/terminal-block.tsx";
import { Badge } from "../../../src/ui/badge.tsx";
import { Button } from "../../../src/ui/button.tsx";
import { Icon } from "../../../src/ui/icon.tsx";
import { INVERSE, LINKED, STYLED_RUNS } from "./terminal-output.fixtures.ts";
import { contrastExempt } from "../../lib/a11y.ts";

const BUILD = `vite v8.3.5 building for production...
transforming (412) src/features/terminal/components/block-terminal.tsx
✓ 1288 modules transformed.
dist/index.html                  0.62 kB │ gzip:  0.38 kB
dist/assets/index-3f9a1c.css    91.40 kB │ gzip: 15.02 kB
dist/assets/index-b7e2d4.js    612.18 kB │ gzip: 188.77 kB
✓ built in 4.21s`;

const meta = {
  title: "Patterns/TerminalBlock",
  component: TerminalBlock,
  args: {
    command: "bun run build",
    running: false,
    exitCode: 0,
    durationMs: 4210,
    cwd: "/Users/me/atlas",
    onCopy: fn(),
    onRerun: fn(),
    children: <TerminalOutput text={BUILD} />,
  },
  parameters: {
    docs: {
      description: {
        component:
          "One command and its output, as desktop's block terminal draws it. `TerminalOutput` is the output; each line renders through the memoised `TerminalOutputLine`.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex max-w-2xl flex-col gap-2">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TerminalBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Running: Story = {
  args: {
    running: true,
    exitCode: null,
    durationMs: undefined,
    children: <TerminalOutput text={BUILD.split("\n").slice(0, 2).join("\n")} />,
  },
};

export const Succeeded: Story = {
  play: async ({ canvasElement }) => {
    const command = within(canvasElement).getByRole("button", { name: "bun run build" });
    await userEvent.click(command);
    await expect(command).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(command);
  },
};

export const Failed: Story = {
  parameters: contrastExempt("code-content"),
  args: {
    command: "bun run test",
    exitCode: 1,
    durationMs: 72000,
    children: <TerminalOutput lines={STYLED_RUNS} />,
  },
};

export const Collapsed: Story = { args: { defaultCollapsed: true } };

/** Output before the shell's first prompt: no header, just the text. */
export const NoHeader: Story = {
  args: {
    command: "",
    children: <TerminalOutput text={"Last login: Tue Nov  4 09:12:44 on ttys004"} />,
  },
};

const ansiLines: TerminalLine[] = [0, 8].map((offset) => ({
  id: offset,
  segments: ANSI_NAMES.slice(offset, offset + 8).map((name, i): TerminalSegment => ({
    text: `${name} `,
    fg: (offset + i) as AnsiIndex,
  })),
}));

export const AnsiColours: Story = {
  parameters: contrastExempt("code-content"),
  args: { command: "colortest", children: <TerminalOutput lines={ansiLines} /> },
};

/** The notice row desktop shows when a block's early output was dropped. */
export const HiddenLines: Story = {
  args: {
    notice: "earlier output hidden — showing the latest 400 lines (Copy gets more)",
  },
};

export const LargeOutputBadge: Story = {
  args: {
    command: "yes",
    running: true,
    exitCode: null,
    badges: (
      <Badge
        variant="warning"
        size="sm"
        title="Large output — live view is throttled to keep the UI responsive"
      >
        large output · throttled
      </Badge>
    ),
  },
};

/** A password prompt in the footer slot: it stays even while the block is collapsed. */
export const PasswordPrompt: Story = {
  args: {
    command: "sudo bun install -g @tryatlas/cli",
    running: true,
    exitCode: null,
    children: <TerminalOutput text="Password:" />,
    footer: (
      <div className="flex items-center gap-2 border-t border-border-subtle bg-background px-3 py-2">
        <Icon icon={LockIcon} size="sm" className="text-primary" />
        <input
          type="password"
          aria-label="Password"
          placeholder="Enter password, then press Enter…"
          className="min-w-0 flex-1 bg-transparent font-mono text-base text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
    ),
  },
};

const longLines: TerminalLine[] = Array.from({ length: 300 }, (_, i) => ({
  id: i,
  segments: [
    { text: `${String(i + 1).padStart(3, " ")} `, dim: true },
    { text: `packages/app/src/module-${i}.ts` },
    { text: " ok", fg: 2 },
  ],
}));

export const LongOutput: Story = {
  parameters: contrastExempt("code-content"),
  args: { command: "find packages -name '*.ts'", children: <TerminalOutput lines={longLines} /> },
};

/** A web session's tool call: no rerun, no PTY behind it. */
export const FromToolCall: Story = {
  args: {
    command: "git log --oneline -3",
    onRerun: undefined,
    cwd: "/workspace/atlas",
    durationMs: 120,
    children: (
      <TerminalOutput
        text={
          "4066b885 code-surface: the terminal block\n2ade8a94 skills: the slash picker\nd66b6541 usage: the monthly meter"
        }
      />
    ),
  },
};

/** A terminal pane's history: several blocks in a column. */
export const Session: Story = {
  parameters: contrastExempt("code-content"),
  render: () => (
    <>
      <TerminalBlock command="" running={false}>
        <TerminalOutput text="Last login: Tue Nov  4 09:12:44 on ttys004" />
      </TerminalBlock>
      <TerminalBlock
        command="git status --short"
        running={false}
        exitCode={0}
        durationMs={84}
        cwd="/Users/me/atlas"
        onCopy={fn()}
        onRerun={fn()}
      >
        <TerminalOutput text={" M src/index.ts\n?? src/components/code-surface/"} />
      </TerminalBlock>
      <TerminalBlock
        command="bun run test"
        running={false}
        exitCode={1}
        durationMs={9950}
        cwd="/Users/me/atlas"
        onCopy={fn()}
        onRerun={fn()}
      >
        <TerminalOutput lines={STYLED_RUNS} />
      </TerminalBlock>
      <TerminalBlock command="bun run dev" running cwd="/Users/me/atlas" onCopy={fn()}>
        <TerminalOutput lines={LINKED} onLinkActivate={fn()} />
      </TerminalBlock>
    </>
  ),
};

export const StyledRuns: Story = {
  parameters: contrastExempt("code-content"),
  args: { command: "bun run test", exitCode: 1, children: <TerminalOutput lines={STYLED_RUNS} /> },
};

const onLinkActivate = fn().mockName("onLinkActivate");

export const Links: Story = {
  args: {
    command: "bun run dev",
    running: true,
    exitCode: null,
    children: <TerminalOutput lines={LINKED} onLinkActivate={onLinkActivate} />,
  },
  play: async ({ canvasElement }) => {
    onLinkActivate.mockClear();
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("5173/"));
    await expect(onLinkActivate).not.toHaveBeenCalled();
    // A modified click; each `userEvent` call starts with no keys held.
    fireEvent.click(canvas.getByText("http://localhost:"), { metaKey: true });
    fireEvent.click(canvas.getByText("5173/"), { metaKey: true });
    await expect(onLinkActivate).toHaveBeenNthCalledWith(1, "http://localhost:5173/", "url");
    await expect(onLinkActivate).toHaveBeenNthCalledWith(2, "http://localhost:5173/", "url");
  },
};

export const SearchHighlight: Story = {
  parameters: contrastExempt("code-content"),
  args: {
    command: "bun run build",
    commandHighlight: "dist",
    children: <TerminalOutput text={BUILD} highlight="dist" />,
  },
  play: async ({ canvasElement }) => {
    const output = canvasElement.querySelector('[data-slot="terminal-output"]')!;
    const expected = BUILD.split("\n").reduce(
      (n, line) => n + highlightRanges(line, "dist").length,
      0,
    );
    await expect(output.querySelectorAll("mark[data-term-match]")).toHaveLength(expected);
  },
};

export const Inverse: Story = {
  parameters: contrastExempt("code-content"),
  args: { command: "vim README.md", children: <TerminalOutput lines={INVERSE} /> },
};

const prepare = fn((segments: readonly TerminalSegment[]) => segments).mockName("prepareSegments");

/** Appending a line prepares only that line: `TerminalOutputLine` holds the others. */
function Streaming() {
  const [lines, setLines] = useState<TerminalLine[]>(() =>
    Array.from({ length: 3 }, (_, i) => ({ id: i, segments: [{ text: `line ${i + 1}` }] })),
  );
  const prepareSegments = useCallback(prepare, []);
  return (
    <TerminalBlock command="tail -f build.log" running onCopy={fn()}>
      <TerminalOutput lines={lines} prepareSegments={prepareSegments} />
      <div className="border-t border-border-subtle px-3 py-2">
        <Button
          size="xs"
          variant="outline"
          onClick={() =>
            setLines((l) => [...l, { id: l.length, segments: [{ text: `line ${l.length + 1}` }] }])
          }
        >
          Append a line
        </Button>
      </div>
    </TerminalBlock>
  );
}

export const MemoisedLines: Story = {
  render: () => <Streaming />,
  play: async ({ canvasElement }) => {
    await expect(prepare).toHaveBeenCalledTimes(3);
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Append a line" }));
    await expect(prepare).toHaveBeenCalledTimes(4);
  },
  beforeEach: () => {
    prepare.mockClear();
  },
};

export const CommandHighlight: Story = {
  args: { command: "git status --short", commandHighlight: "status" },
  play: async ({ canvasElement }) => {
    const command = within(canvasElement).getByTitle("git status --short");
    await expect(command.querySelector("mark[data-term-match]")).toHaveTextContent("status");
  },
};
