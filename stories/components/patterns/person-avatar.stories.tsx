import type { Meta, StoryObj } from "@storybook/react-vite";
import { PersonAvatar } from "../../../src/components/patterns/person-avatar.tsx";

/** A photo as a data URI, so the story never reaches the network. */
const PHOTO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    // ratchet-allow: the fixture photo is an image file, and an image carries its own colours.
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#6b7a8f"/><circle cx="20" cy="16" r="7" fill="#d9c7b0"/><rect x="8" y="26" width="24" height="14" rx="7" fill="#d9c7b0"/></svg>`,
  );

const SIZES = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"] as const;

const meta = {
  title: "Patterns/PersonAvatar",
  component: PersonAvatar,
  args: { name: "Maya Chen", email: "maya@tryatlas.dev", size: "md" },
  argTypes: { size: { control: "inline-radio", options: SIZES } },
  parameters: {
    docs: {
      description: {
        component:
          "A person's avatar: the photo when there is one, initials otherwise (and while it loads). Every screen that shows a person goes through this.",
      },
    },
  },
} satisfies Meta<typeof PersonAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithPhoto: Story = { args: { image: PHOTO } };
/** A broken photo URL falls back to initials. */
export const Error: Story = { args: { image: "/does-not-exist.png" } };
export const EmailOnly: Story = { args: { name: "", email: "sam.okafor@tryatlas.dev" } };
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      {SIZES.map((size) => (
        <PersonAvatar key={size} {...args} size={size} />
      ))}
    </div>
  ),
};
export const LongText: Story = {
  args: { name: "Maximiliana Wolfeschlegelsteinhausenberger-Okonkwo" },
};

/** `image={null}`: no photo, so initials. */
export const NullImage: Story = { args: { image: null } };

/** `art`: a guest's generated art in place of the initials. */
export const GuestArt: Story = {
  args: {
    name: "Guest",
    size: "xl",
    art: (
      <span
        aria-hidden="true"
        className="bg-linear-to-br from-hue-purple via-hue-blue to-hue-cyan"
      />
    ),
  },
};
