// @vitest-environment happy-dom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Dialog, DialogContent, DialogTitle } from "./dialog.tsx";

afterEach(cleanup);

function open(props: React.ComponentProps<typeof DialogContent>) {
  render(
    <Dialog defaultOpen>
      <DialogContent {...props}>
        <DialogTitle>Choose a layout</DialogTitle>
      </DialogContent>
    </Dialog>,
  );
  return {
    popup: screen.getByRole("dialog"),
    scrim: document.querySelector<HTMLElement>('[data-slot="dialog-overlay"]')!,
  };
}

describe("DialogContent size and blur", () => {
  it("leaves the default dialog unsized and its scrim clear", () => {
    const { popup, scrim } = open({});
    expect(popup.hasAttribute("data-size")).toBe(false);
    expect(popup.className).toContain("max-w-[min(32rem,calc(var(--app-vw,100vw)-2rem))]");
    expect(scrim.className).not.toContain("backdrop-blur");
  });

  it("widens to 44rem at lg, replacing the default width", () => {
    const { popup } = open({ size: "lg" });
    expect(popup.dataset.size).toBe("lg");
    expect(popup.className).toContain("max-w-[min(44rem,calc(var(--app-vw,100vw)-2rem))]");
    expect(popup.className).not.toContain("max-w-[min(32rem");
  });

  it("narrows to 24rem at sm, replacing the default width", () => {
    const { popup } = open({ size: "sm" });
    expect(popup.dataset.size).toBe("sm");
    expect(popup.className).toContain("max-w-[min(24rem,calc(var(--app-vw,100vw)-2rem))]");
    expect(popup.className).not.toContain("max-w-[min(32rem");
  });

  it("drops the entrance and exit, scrim included, when instant", () => {
    const { popup, scrim } = open({ instant: true });
    for (const el of [popup, scrim]) {
      expect(el.className).toContain("animate-none");
      expect(el.className).not.toMatch(/animate-(?:scale|fade)-(?:in|out)/);
    }
  });

  it("does not size a media dialog", () => {
    const { popup } = open({ size: "lg", variant: "media" });
    expect(popup.hasAttribute("data-size")).toBe(false);
    expect(popup.className).not.toContain("44rem");
  });

  it("frosts the scrim with blur", () => {
    const { scrim } = open({ blur: true });
    expect(scrim.className).toContain("backdrop-blur-sm");
  });
});
