import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Button } from "../../src/ui/button.tsx";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../../src/ui/popover.tsx";
import { Switch } from "../../src/ui/switch.tsx";
import { expectPopupExit } from "../lib/popup-exit.ts";

interface DemoProps {
  defaultOpen?: boolean;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  arrow?: boolean;
  surface?: "default" | "tinted" | "glass";
  flush?: boolean;
  instant?: boolean;
  /** Busy content behind the trigger, so a translucent surface shows. */
  backdrop?: boolean;
  body?: string;
}

function Demo({
  defaultOpen,
  side,
  align,
  arrow,
  surface,
  flush,
  instant,
  body,
  backdrop,
}: DemoProps) {
  return (
    <div className="relative flex min-h-64 items-start justify-center pt-4">
      {backdrop && (
        <div aria-hidden="true" className="absolute inset-x-0 top-14 flex flex-col gap-1.5 px-6">
          {Array.from({ length: 8 }, (_, i) => (
            <p key={i} className="text-sm text-muted-foreground">
              Maya: the session from this morning is ready for review, line {i + 1}
            </p>
          ))}
        </div>
      )}
      <Popover defaultOpen={defaultOpen}>
        <PopoverTrigger render={<Button variant="outline" />}>Notifications</PopoverTrigger>
        <PopoverContent
          side={side}
          align={align}
          arrow={arrow}
          surface={surface}
          flush={flush}
          instant={instant}
        >
          <PopoverHeader>
            <PopoverTitle>Notifications</PopoverTitle>
            <PopoverDescription>{body}</PopoverDescription>
          </PopoverHeader>
          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="label">Desktop alerts</span>
            <Switch checked onCheckedChange={() => {}} aria-label="Desktop alerts" />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

const meta = {
  title: "Primitives/Popover",
  component: Demo,
  args: {
    defaultOpen: false,
    side: "bottom",
    align: "center",
    arrow: false,
    surface: "default",
    body: "Choose when Atlas tells you a run needs you.",
  },
  argTypes: {
    side: { control: "inline-radio", options: ["top", "bottom", "left", "right"] },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    surface: { control: "inline-radio", options: ["default", "tinted", "glass"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Anchored content that is not a list of commands. `rounded-lg`, `shadow-md`, `z-popover` on the Positioner.",
      },
    },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Open: Story = { args: { defaultOpen: true }, tags: ["!autodocs"] };
export const WithArrow: Story = { args: { defaultOpen: true, arrow: true }, tags: ["!autodocs"] };
export const Tinted: Story = {
  args: { defaultOpen: true, surface: "tinted" },
  tags: ["!autodocs"],
};
/** Desktop's team-chat menus: translucent card, the one glass blur, the
 *  top radius step. Over a column of messages, so the blur reads. */
export const Glass: Story = {
  args: { defaultOpen: true, surface: "glass", backdrop: true },
  tags: ["!autodocs"],
  play: async () => {
    const popup = document.querySelector<HTMLElement>("[data-slot=popover-content]")!;
    const style = getComputedStyle(popup);
    await expect(style.backdropFilter).toContain("blur");
    // One step above the default popup's `rounded-lg`.
    const probe = document.createElement("div");
    probe.className = "rounded-lg";
    document.body.append(probe);
    const lg = parseFloat(getComputedStyle(probe).borderTopLeftRadius);
    probe.remove();
    await expect(parseFloat(style.borderTopLeftRadius)).toBeGreaterThan(lg);
  },
};
export const LongText: Story = {
  args: {
    defaultOpen: true,
    body: "Atlas tells you when a run is waiting for approval, when a long build finishes, when a teammate mentions you in a shared session, and when a scheduled task fails. Each of these can be turned off on its own in Settings.",
  },
  tags: ["!autodocs"],
};
/** Closing plays the entrance backwards (`scale-out`, 120ms) into the
 *  trigger, then unmounts. Under reduced motion it only fades. */
export const Exit: Story = {
  args: { defaultOpen: true },
  tags: ["!autodocs"],
  play: () => expectPopupExit("popover-content"),
};

/** `flush`: no padding, so a list with its own rows runs to the popup's edge. */
export const Flush: Story = {
  args: { defaultOpen: true, flush: true },
  tags: ["!autodocs"],
  play: async () => {
    const popup = document.querySelector<HTMLElement>("[data-slot=popover-content]")!;
    await expect(getComputedStyle(popup).paddingTop).toBe("0px");
  },
};

/**
 * `instant`: no scale-in and no exit, for a popup opened by typing (an
 * @-mention list, a slash picker) that would otherwise replay its entrance
 * on every keystroke.
 */
export const Instant: Story = {
  args: { defaultOpen: true, instant: true },
  tags: ["!autodocs"],
  play: async () => {
    const popup = document.querySelector<HTMLElement>("[data-slot=popover-content]")!;
    await expect(getComputedStyle(popup).animationName).toBe("none");
  },
};
