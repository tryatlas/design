import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  SYNTAX_TEXT_CLASS,
  type SyntaxRole,
} from "../../../src/components/code-surface/code-surface.ts";
import { EditorPreview } from "../../../src/components/code-surface/editor-preview.tsx";
import { SAMPLE } from "./editor.fixtures.ts";
import { contrastExempt } from "../../lib/a11y.ts";

const meta = {
  title: "Patterns/EditorPreview",
  component: EditorPreview,
  args: { lines: SAMPLE },
  parameters: {
    // Every story here is syntax-coloured code and its gutter.
    ...contrastExempt("code-content"),
    docs: {
      description: {
        component:
          "A static excerpt drawn the way desktop's CodeMirror theme draws a file. The reference look the editor is held to.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl overflow-hidden rounded-md border border-border">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EditorPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

const ROLES = Object.keys(SYNTAX_TEXT_CLASS) as SyntaxRole[];

/** Every `syntax.*` key, each named in its own colour. */
export const AllSyntaxRoles: Story = {
  args: { lines: ROLES.map((role) => ({ tokens: [{ text: `syntax.${role}`, role }] })) },
};

/** Change bars (added, modified, deleted above), the fold gutter and the active line. */
export const Gutter: Story = {
  args: {
    startLine: 41,
    activeLine: 43,
    lines: [...SAMPLE.slice(0, 5), { ...SAMPLE[5]!, fold: "closed" }],
  },
};

export const SelectionAndMatches: Story = {
  args: {
    activeLine: 3,
    lines: [
      {
        tokens: [
          { text: "const", role: "keyword" },
          { text: " " },
          { text: "duration", role: "definition", selected: true },
          { text: " = ", role: "operator", selected: true },
          { text: "format", role: "function", selected: true },
          { text: "(", role: "operator", bracket: true },
          { text: "ms", role: "variable" },
          { text: ")", role: "operator", bracket: true, caret: true },
          { text: ";", role: "operator" },
        ],
      },
      {
        tokens: [
          { text: "// ", role: "comment" },
          { text: "format", role: "comment", match: "match" },
          { text: " once, then ", role: "comment" },
          { text: "format", role: "comment", match: "active" },
          { text: " again", role: "comment" },
        ],
      },
      {
        tokens: [
          { text: "return", role: "keyword" },
          { text: " duration;", role: "variable" },
        ],
      },
    ],
  },
};
