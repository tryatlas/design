import type { Meta, StoryObj } from "@storybook/react-vite";
import { Image as ImageIcon, X } from "lucide-react";
import { expect, screen, waitFor } from "storybook/test";
import { Button } from "../../src/ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../src/ui/dialog.tsx";
import { Icon } from "../../src/ui/icon.tsx";
import { IconButton } from "../../src/ui/icon-button.tsx";
import { Input } from "../../src/ui/input.tsx";
import { Kbd } from "../../src/ui/kbd.tsx";

interface DemoProps {
  defaultOpen?: boolean;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  destructive?: boolean;
  size?: "sm" | "default" | "lg";
  instant?: boolean;
}

function Demo({
  defaultOpen = false,
  title = "Rename session",
  description = "The name shows in the sidebar and in shared links.",
  showCloseButton = true,
  destructive = false,
  size = "default",
  instant = false,
}: DemoProps) {
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger render={<Button variant="outline" />}>Open dialog</DialogTrigger>
      <DialogContent showCloseButton={showCloseButton} size={size} instant={instant}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {!destructive && <Input defaultValue="Refactor the settings panel" aria-label="Name" />}
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
          <DialogClose render={<Button variant={destructive ? "destructive" : "default"} />}>
            {destructive ? "Delete" : "Save"}
            {!destructive && <Kbd variant="inverse">↵</Kbd>}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const meta = {
  title: "Primitives/Dialog",
  component: Demo,
  args: {
    defaultOpen: false,
    showCloseButton: true,
    destructive: false,
    size: "default",
    instant: false,
  },
  argTypes: { size: { control: "inline-radio", options: ["sm", "default", "lg"] } },
  parameters: {
    docs: {
      description: {
        component:
          "A centred modal: `rounded-xl`, `shadow-lg`, the `scrim` on `z-overlay` and the panel on `z-modal`. Compose `DialogContent` with `DialogHeader`, `DialogTitle`, `DialogDescription` and `DialogFooter`.",
      },
    },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Open on load, for screenshots. */
export const Open: Story = { args: { defaultOpen: true }, tags: ["!autodocs"] };

export const Destructive: Story = {
  args: {
    defaultOpen: true,
    destructive: true,
    title: "Delete this session?",
    description: "Its transcript and checkpoints go with it. This cannot be undone.",
  },
  tags: ["!autodocs"],
};

export const WithoutCloseButton: Story = {
  args: { defaultOpen: true, showCloseButton: false },
  tags: ["!autodocs"],
};

export const LongText: Story = {
  args: {
    defaultOpen: true,
    title:
      "Allow this agent to read every project attached to the session, including the ones added later?",
    description:
      "Access is read-only. The agent asks again before it writes anything, and you can revoke access from the session's project list at any time. Projects added later inherit this choice until you change it.",
  },
  tags: ["!autodocs"],
};

/** `variant="media"`: the full-bleed viewer desktop opens from an image tile.
 *  Centred by `inset-0 m-auto`, so the scale-in (or a caller's grow-from-tile)
 *  owns the transform; no padding; the page background, not the card. Its
 *  header names the file with `DialogTitle variant="quiet"`. */
export const Media: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="outline" />}>Open image</DialogTrigger>
      <DialogContent variant="media" showCloseButton={false} aria-describedby={undefined}>
        <div className="flex h-control-lg shrink-0 items-center gap-2 border-b border-border px-3">
          <DialogTitle variant="quiet">
            screenshot-2026-11-04-at-14.32.18-settings-page.png
          </DialogTitle>
          <DialogClose render={<IconButton icon={X} label="Close" size="sm" />} />
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center bg-muted text-muted-foreground">
          <Icon icon={ImageIcon} size="xl" />
        </div>
      </DialogContent>
    </Dialog>
  ),
  tags: ["!autodocs"],
  play: async () => {
    const popup = await screen.findByRole("dialog");
    await waitFor(() => expect(popup.getAnimations()).toHaveLength(0));
    const style = getComputedStyle(popup);
    // Centred by margins: neither `translate` nor `transform` is in use at rest.
    await expect(style.translate).toBe("none");
    await expect(style.transform).toBe("none");
    await expect(style.paddingTop).toBe("0px");
    const box = popup.getBoundingClientRect();
    const left = box.left;
    const right = window.innerWidth - box.right;
    await expect(Math.abs(left - right)).toBeLessThanOrEqual(1);
    await expect(popup).toHaveAttribute("data-variant", "media");
    await expect(screen.getByText(/settings-page\.png/)).toHaveAttribute("data-variant", "quiet");
  },
};

const LAYOUTS = ["Writing", "Review", "Pairing", "Terminal", "Research", "Focus"];

/**
 * `size="lg"` (44rem) for a dialog that holds a list or a grid, here the
 * layout switcher; and `blur`, which frosts the page behind the scrim, for a
 * dialog that should read as taking over rather than sitting on top.
 */
export const LargeBlurred: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="outline" />}>Choose a layout</DialogTrigger>
      <DialogContent size="lg" blur>
        <DialogHeader>
          <DialogTitle>Choose a layout</DialogTitle>
          <DialogDescription>
            Rearranges panels and tabs into a ready-made project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-3">
          {LAYOUTS.map((name) => (
            <div key={name} className="rounded-xl border border-border bg-background p-2.5">
              <div className="aspect-16/10 rounded-md border border-border-subtle bg-card" />
              <div className="mt-2 text-sm font-medium text-foreground">{name}</div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  ),
  tags: ["!autodocs"],
  play: async () => {
    const popup = await screen.findByRole("dialog");
    await waitFor(() => expect(popup.getAnimations()).toHaveLength(0));
    await expect(popup).toHaveAttribute("data-size", "lg");
    // 44rem at the preview's 13px root, or the window less 1rem a side.
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const expected = Math.min(44 * rem, window.innerWidth - 2 * rem);
    await expect(Math.abs(popup.getBoundingClientRect().width - expected)).toBeLessThanOrEqual(1);
    const scrim = document.querySelector('[data-slot="dialog-overlay"]')!;
    await expect(getComputedStyle(scrim).backdropFilter).not.toBe("none");
  },
};

/** `size="sm"`, 24rem: a confirm or a one-field prompt. */
export const Small: Story = {
  args: {
    defaultOpen: true,
    size: "sm",
    destructive: true,
    title: "Delete this link?",
    description: "Anyone who has it loses access.",
  },
  tags: ["!autodocs"],
  play: async () => {
    const popup = await screen.findByRole("dialog");
    await expect(popup.dataset.size).toBe("sm");
  },
};

/**
 * `instant`: no scale-in, no fade, scrim included. For a dialog opened from
 * the keyboard (a shortcuts sheet on `?`), where an entrance on every press
 * reads as latency.
 */
export const Instant: Story = {
  args: { instant: true },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));
    const popup = await screen.findByRole("dialog");
    await expect(getComputedStyle(popup).animationName).toBe("none");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  },
};
