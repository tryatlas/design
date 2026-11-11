import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  BellGlyph,
  CheckGlyph,
  CopyGlyph,
  MenuGlyph,
  PlusMinusGlyph,
  RailGlyph,
  SendGlyph,
  TrashGlyph,
} from "../../src/ui/animated-icon.tsx";
import { ICON_SIZES, type IconSize } from "../../src/ui/icon.tsx";

const SIZES = Object.keys(ICON_SIZES) as IconSize[];

interface GalleryProps {
  on?: boolean;
  size?: IconSize;
}

/** Every glyph, driven by one flag so the controls flip them together. */
function Gallery({ on = false, size = "lg" }: GalleryProps) {
  const cells = [
    ["CopyGlyph", <CopyGlyph copied={on} size={size} />],
    ["TrashGlyph", <TrashGlyph armed={on} size={size} />],
    ["RailGlyph", <RailGlyph open={on} size={size} />],
    ["MenuGlyph", <MenuGlyph active={on} size={size} />],
    ["PlusMinusGlyph", <PlusMinusGlyph open={on} size={size} />],
    ["BellGlyph", <BellGlyph muted={on} size={size} />],
  ] as const;
  return (
    <div className="grid w-fit grid-cols-3 gap-2">
      {cells.map(([name, glyph]) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 rounded-md border border-border px-4 py-3"
        >
          {glyph}
          <span className="caption">{name}</span>
        </div>
      ))}
    </div>
  );
}

const meta = {
  title: "Primitives/AnimatedIcon",
  component: Gallery,
  args: { on: false, size: "lg" },
  argTypes: { size: { control: "inline-radio", options: SIZES } },
  parameters: {
    docs: {
      description: {
        component:
          "Glyphs that carry a state change: copy → check, the trash lid, the rail, the menu bars, plus/minus, the muted bell. All CSS, all controlled. Toggle `on`.",
      },
    },
  },
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};
export const On: Story = { args: { on: true } };

/** Click to play the one-shot keyframes: send and ring. */
export const OneShots: Story = {
  render: () => {
    const [sending, setSending] = useState(false);
    const [ringing, setRinging] = useState(false);
    return (
      <div className="flex gap-3">
        <button
          type="button"
          className="label flex items-center gap-2 rounded border border-border px-3 py-1.5 hover:bg-element-hover"
          onClick={() => setSending(true)}
        >
          <SendGlyph sending={sending} onAnimationEnd={() => setSending(false)} />
          Send
        </button>
        <button
          type="button"
          className="label flex items-center gap-2 rounded border border-border px-3 py-1.5 hover:bg-element-hover"
          onClick={() => setRinging(true)}
        >
          <BellGlyph ringing={ringing} onAnimationEnd={() => setRinging(false)} />
          Ring
        </button>
      </div>
    );
  },
};

/** `CheckGlyph`: draws itself on as it mounts, for a completion the user waited for. */
export const Check: Story = {
  render: () => {
    const [run, setRun] = useState(0);
    return (
      <div className="flex items-center gap-3">
        <span className="text-success">
          <CheckGlyph key={run} size="xl" />
        </span>
        <button
          type="button"
          className="label rounded border border-border px-3 py-1.5 hover:bg-element-hover"
          onClick={() => setRun((n) => n + 1)}
        >
          Draw again
        </button>
      </div>
    );
  },
};
