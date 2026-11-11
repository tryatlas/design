import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen } from "storybook/test";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../src/components/ui/sheet.tsx";
import { Button } from "../../../src/ui/button.tsx";
import { Input } from "../../../src/ui/input.tsx";

interface DemoProps {
  defaultOpen?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  size?: "sm" | "md" | "lg";
  flush?: boolean;
  instant?: boolean;
  surface?: "card" | "background";
  divided?: boolean;
  compact?: boolean;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
}

function Demo({
  defaultOpen = false,
  side = "right",
  size = "sm",
  flush = false,
  instant = false,
  surface = "card",
  divided = false,
  compact = false,
  title = "Session details",
  description = "The name, projects and access for this session.",
  showCloseButton = true,
}: DemoProps) {
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger>
      <SheetContent
        side={side}
        size={size}
        flush={flush}
        instant={instant}
        surface={surface}
        showCloseButton={showCloseButton}
      >
        <SheetHeader divided={divided} compact={compact}>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className={divided ? "flex flex-col gap-1.5 p-4" : "flex flex-col gap-1.5 px-4"}>
          <span className="label">Name</span>
          <Input defaultValue="Refactor the settings panel" aria-label="Name" />
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="ghost" />}>Cancel</SheetClose>
          <Button>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const meta = {
  title: "Components/Sheet",
  component: Demo,
  args: {
    defaultOpen: false,
    side: "right",
    size: "sm",
    flush: false,
    instant: false,
    surface: "card",
    divided: false,
    compact: false,
    showCloseButton: true,
  },
  argTypes: {
    side: { control: "inline-radio", options: ["top", "right", "bottom", "left"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    surface: { control: "inline-radio", options: ["card", "background"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A panel that slides in from an edge, on the `z-drawer` layer over a soft scrim. For a task that needs the page behind it in view; a decision that blocks is a `Dialog`. It travels its whole width in (`duration-slow`, `ease-drawer`) and leaves faster (`duration-base`); under reduced motion it only fades. `size` sets a side sheet's width from `sm` up: `sm` 24rem, `md` 28rem, `lg` 42rem; below `sm` it is full width.",
      },
    },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Open on load, for screenshots. */
export const Open: Story = { args: { defaultOpen: true }, tags: ["!autodocs"] };
export const Left: Story = { args: { defaultOpen: true, side: "left" }, tags: ["!autodocs"] };
/** A bottom sheet: rounded top corners, at least half the screen, at most five sixths. */
export const Bottom: Story = { args: { defaultOpen: true, side: "bottom" }, tags: ["!autodocs"] };
/** `size="md"`, 28rem. */
export const Medium: Story = { args: { defaultOpen: true, size: "md" }, tags: ["!autodocs"] };
/** `size="lg"`, 42rem: a sheet with a table or a preview in it. */
export const Large: Story = { args: { defaultOpen: true, size: "lg" }, tags: ["!autodocs"] };
/** `flush`: no padding or gap on the panel itself; the header and footer keep theirs. */
export const Flush: Story = { args: { defaultOpen: true, flush: true }, tags: ["!autodocs"] };
/** `instant`: no slide and no fade, scrim included, for a sheet toggled from the keyboard. */
export const Instant: Story = {
  args: { instant: true },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open sheet" }));
    const popup = await screen.findByRole("dialog");
    await expect(getComputedStyle(popup).transitionDuration).toBe("0s");
  },
};
export const LongText: Story = {
  args: {
    defaultOpen: true,
    title: "Allow this agent to read every project attached to the session?",
    description:
      "Access is read-only. The agent asks again before it writes anything, and you can revoke access from the session's project list at any time. Projects added later inherit this choice until you change it.",
  },
  tags: ["!autodocs"],
};

/** `surface="background"`: the page's own fill, for a sheet that carries a page. */
export const BackgroundSurface: Story = {
  args: { defaultOpen: true, surface: "background" },
  tags: ["!autodocs"],
};
/** A `flush` detail panel with a `divided` header ruled off from its body. */
export const DividedHeader: Story = {
  args: { defaultOpen: true, flush: true, divided: true, size: "lg" },
  tags: ["!autodocs"],
};
/** A `compact` header over a list, on a bottom sheet. */
export const CompactHeader: Story = {
  args: { defaultOpen: true, side: "bottom", compact: true },
  tags: ["!autodocs"],
};
