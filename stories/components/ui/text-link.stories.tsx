import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextLink } from "../../../src/components/ui/text-link.tsx";

const meta = {
  title: "Components/TextLink",
  component: TextLink,
  args: { href: "#", children: "View all sessions", tone: "default" },
  argTypes: { tone: { control: "inline-radio", options: ["default", "muted"] } },
  parameters: {
    docs: {
      description: {
        component:
          "A standalone link: no underline at rest, underlined on hover and keyboard focus. A link inside running text (prose, markdown, a field's description) keeps its underline at rest, because there the underline is what tells it from the words around it.",
      },
    },
  },
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Muted: Story = { args: { tone: "muted", children: "Privacy" } };

/** The two rules side by side: the footer links stand alone, the paragraph's is in prose. */
export const StandaloneAndProse: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4 text-sm">
      <div className="flex gap-4">
        <TextLink href="#">View all</TextLink>
        <TextLink href="#" tone="muted">
          Privacy
        </TextLink>
        <TextLink href="#" tone="muted">
          Terms
        </TextLink>
      </div>
      <div className="prose-session">
        <p>
          Sessions settle after a week without activity. Read <a href="#">how settling works</a>{" "}
          before you change the default.
        </p>
      </div>
    </div>
  ),
};

/** `variant="inline"`: a link the app sets inside a sentence keeps its underline at rest. */
export const Inline: Story = {
  render: () => (
    <p className="max-w-md text-sm text-secondary-foreground">
      Only an admin can change which models are on.{" "}
      <TextLink href="#" variant="inline">
        See who your admins are
      </TextLink>
      .
    </p>
  ),
};
