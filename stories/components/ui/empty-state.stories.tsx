import type { Meta, StoryObj } from "@storybook/react-vite";
import { Inbox, MessageSquare, SearchX } from "lucide-react";
import { expect, within } from "storybook/test";
import { EmptyState } from "../../../src/components/ui/empty-state.tsx";
import { AnthropicMark } from "../../../src/components/ui/provider-marks.tsx";
import { Button } from "../../../src/ui/button.tsx";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  args: {
    icon: MessageSquare,
    title: "No sessions in the last 7 days",
    description: "Sessions you start or that are shared with you show up here.",
  },
  argTypes: { icon: { control: false }, action: { control: false } },
  render: (args) => (
    <div className="w-96 rounded-md border border-border">
      <EmptyState {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "What a pane says when it has nothing to show: one dim glyph, one sentence, and one action only when there is a real next step. Say what would be here, not that there is nothing.",
      },
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithAction: Story = {
  args: { action: <Button size="sm">New session</Button> },
};
export const TitleOnly: Story = { args: { icon: undefined, description: undefined } };
export const NoResults: Story = {
  args: {
    icon: SearchX,
    title: "No sessions match “settngs”",
    description: "Check the spelling, or search every project.",
    action: (
      <Button size="sm" variant="outline">
        Search everywhere
      </Button>
    ),
  },
};
export const LongText: Story = {
  args: {
    icon: Inbox,
    title: "No pull requests waiting for your review in any project attached to this session",
    description:
      "Requests from teammates land here as soon as GitHub tells us about them. Connect another organisation in Settings if you expected to see something.",
  },
};

/** `icon` as an element: a provider logo in the same box a Lucide glyph gets.
 *  Pass `title=""` so the mark is hidden; the title says what is missing. */
export const CustomIcon: Story = {
  render: () => (
    <div className="w-96 rounded-md border border-border">
      <EmptyState
        icon={<AnthropicMark title="" className="size-4" />}
        title="No Anthropic models yet"
        description="Add an API key in Settings and its models show up here."
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="empty-state"]')!;
    const mark = root.querySelector("svg")!;
    await expect(mark).toHaveAttribute("aria-hidden", "true");
    // Drawn as given: not re-wrapped in Icon, so it keeps its own size.
    await expect(mark.getAttribute("class")).toContain("size-4");
    await expect(within(canvasElement).getByText("No Anthropic models yet")).toBeVisible();
  },
};

/** `size="page"`: a whole page with nothing on it yet. More room, and the title a step up. */
export const Page: Story = {
  args: { size: "page" },
  parameters: { layout: "fullscreen" },
};
