import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeIcon, EyeIcon, RefreshCwIcon, WrapTextIcon } from "lucide-react";
import { useState } from "react";
import { fn } from "storybook/test";

import { pathSegments } from "../../../src/components/code-surface/code-surface.ts";
import { EditorBreadcrumbs } from "../../../src/components/code-surface/editor-breadcrumbs.tsx";
import { EditorFrame } from "../../../src/components/code-surface/editor-frame.tsx";
import { EditorPreview } from "../../../src/components/code-surface/editor-preview.tsx";
import { EditorStatusBar } from "../../../src/components/code-surface/editor-status-bar.tsx";
import { FindBar } from "../../../src/components/code-surface/find-bar.tsx";
import { Button } from "../../../src/ui/button.tsx";
import { IconButton } from "../../../src/ui/icon-button.tsx";
import { Icon } from "../../../src/ui/icon.tsx";
import { Hint } from "../../../src/ui/tooltip.tsx";
import { SAMPLE } from "./editor.fixtures.ts";
import { contrastExempt } from "../../lib/a11y.ts";

const ROOT = "/Users/me/atlas";
const crumbs = (path: string, dirty?: boolean) => (
  <EditorBreadcrumbs
    segments={pathSegments(`${ROOT}/${path}`, ROOT)}
    dirty={dirty}
    onSelect={fn()}
  />
);

function Action(props: {
  label: string;
  icon: typeof WrapTextIcon;
  pressed?: boolean;
  onClick?: () => void;
}) {
  return (
    <Hint label={props.label}>
      <IconButton
        size="sm"
        icon={props.icon}
        label={props.label}
        aria-pressed={props.pressed}
        onClick={props.onClick}
      />
    </Hint>
  );
}

const body = <EditorPreview lines={SAMPLE} startLine={1} activeLine={3} className="h-full" />;
const status = (
  <EditorStatusBar line={3} column={14} language="TypeScript" eol="LF" indent="Spaces: 2" />
);

const meta = {
  title: "Patterns/EditorFrame",
  component: EditorFrame,
  args: {
    breadcrumbs: crumbs("src/features/terminal/lib/format-duration.ts"),
    actions: <Action label="Enable word wrap" icon={WrapTextIcon} pressed={false} />,
    statusBar: status,
    children: body,
  },
  decorators: [
    (Story) => (
      <div className="h-80 max-w-2xl overflow-hidden rounded-md border border-border">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EditorFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: contrastExempt("code-content"),
};

export const Dirty: Story = {
  parameters: contrastExempt("code-content"),
  args: { breadcrumbs: crumbs("src/features/terminal/lib/format-duration.ts", true) },
};

/** The file changed on disk under unsaved edits. */
export const DiskChanged: Story = {
  parameters: contrastExempt("code-content"),
  args: {
    breadcrumbs: crumbs("src/features/terminal/lib/format-duration.ts", true),
    actions: (
      <>
        <Button
          variant="outline"
          size="xs"
          title="This file changed on disk. Reload discards your unsaved edits."
        >
          <Icon icon={RefreshCwIcon} size="xs" /> Disk changed · Reload
        </Button>
        <Action label="Enable word wrap" icon={WrapTextIcon} pressed={false} />
      </>
    ),
  },
};

function MarkdownToggleFrame() {
  const [rendered, setRendered] = useState(false);
  return (
    <EditorFrame
      breadcrumbs={crumbs("docs/adr/0027-one-design-package.md")}
      actions={
        <Action
          label={rendered ? "Show source" : "Show preview"}
          icon={rendered ? CodeIcon : EyeIcon}
          pressed={rendered}
          onClick={() => setRendered((r) => !r)}
        />
      }
      notice="Large file (2.4 MB): shown read-only, without highlighting."
    >
      {rendered ? (
        <div className="prose-session overflow-auto px-6 py-5 text-sm">
          <h1>One design package</h1>
          <p>Desktop is the source of truth.</p>
        </div>
      ) : (
        <EditorPreview
          lines={[
            { tokens: [{ text: "# One design package", role: "function" }] },
            { tokens: [] },
            { tokens: [{ text: "Desktop is the source of truth." }] },
          ]}
        />
      )}
    </EditorFrame>
  );
}

/** The preview toggle a markdown file gets, and the notice row. */
export const MarkdownToggle: Story = { render: () => <MarkdownToggleFrame /> };

export const WithFind: Story = {
  args: {
    findBar: (
      <FindBar
        query="ms"
        matchCount={5}
        matchIndex={1}
        onQueryChange={fn()}
        onNext={fn()}
        onPrevious={fn()}
        onClose={fn()}
        onToggle={fn()}
        onSelectAll={fn()}
      />
    ),
  },
};

export const WithReplace: Story = {
  args: {
    findBar: (
      <FindBar
        query="ms"
        matchCount={5}
        matchIndex={1}
        onQueryChange={fn()}
        onNext={fn()}
        onPrevious={fn()}
        onClose={fn()}
        onToggle={fn()}
        replace="millis"
        onReplaceChange={fn()}
        replaceOpen
        onReplace={fn()}
        onReplaceAll={fn()}
      />
    ),
  },
};

export const LongPath: Story = {
  parameters: contrastExempt("code-content"),
  args: {
    breadcrumbs: crumbs(
      "src/features/editor/components/settings/a-very-deeply-nested-folder/file-surface-chrome-with-a-long-name.tsx",
      true,
    ),
  },
};

export const Phone: Story = {
  parameters: contrastExempt("code-content"),
  ...WithFind,
  args: {
    ...WithFind.args,
    breadcrumbs: crumbs("src/features/editor/components/settings/file-surface-chrome.tsx", true),
  },
  globals: { viewport: { value: "phone" } },
};
