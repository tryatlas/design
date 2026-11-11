import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "../../../src/components/ui/avatar.tsx";

const SIZES = ["3xs", "2xs", "xs", "sm", "md", "lg"] as const;
const PEOPLE = [
  "Ada Lovelace",
  "Grace Hopper",
  "Alan Turing",
  "Katherine Johnson",
  "Linus Pauling",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
}

/** A data-URI face, so the story needs no network. */
const PHOTO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    // ratchet-allow: a stand-in photograph, so its pixels are image content rather than theme colour.
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#8a8f98"/><circle cx="16" cy="13" r="6" fill="#d9dce1"/><rect x="6" y="22" width="20" height="12" rx="6" fill="#d9dce1"/></svg>',
  );

interface DemoProps {
  size?: (typeof SIZES)[number];
  name?: string;
  src?: string;
}

function Demo({ size = "md", name = "Ada Lovelace", src }: DemoProps) {
  return (
    <Avatar size={size}>
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback>{initials(name)}</AvatarFallback>
    </Avatar>
  );
}

const meta = {
  title: "Components/Avatar",
  component: Demo,
  args: { size: "md", name: "Ada Lovelace" },
  argTypes: { size: { control: "inline-radio", options: SIZES } },
  parameters: {
    docs: {
      description: {
        component:
          "An identity mark sized on the control ladder, so it is exactly as tall as the button beside it. The fallback is initials on `bg-muted`, never a generated hue.",
      },
    },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithImage: Story = { args: { src: PHOTO } };

/** A broken image falls back to initials. */
export const ErrorState: Story = { name: "Error", args: { src: "data:image/png;base64,broken" } };

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {SIZES.map((size) => (
        <Demo key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      {PEOPLE.slice(0, 3).map((name) => (
        <Avatar key={name}>
          <AvatarFallback>{initials(name)}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+2</AvatarGroupCount>
    </AvatarGroup>
  ),
};

export const ManyItems: Story = {
  render: () => (
    <AvatarGroup>
      {Array.from({ length: 12 }, (_, i) => PEOPLE[i % PEOPLE.length]!).map((name, i) => (
        <Avatar key={i}>
          <AvatarFallback>{initials(name)}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+38</AvatarGroupCount>
    </AvatarGroup>
  ),
};

/** `AvatarGroupCount size="lg"`, beside `lg` avatars. */
export const GroupLarge: Story = {
  render: () => (
    <AvatarGroup>
      {PEOPLE.slice(0, 3).map((name) => (
        <Avatar key={name} size="lg">
          <AvatarFallback>{initials(name)}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount size="lg">+2</AvatarGroupCount>
    </AvatarGroup>
  ),
};
