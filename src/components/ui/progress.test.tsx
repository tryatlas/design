// @vitest-environment happy-dom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Progress } from "./progress.tsx";

afterEach(cleanup);

function indicator(container: HTMLElement) {
  return container.querySelector<HTMLElement>('[data-slot="progress-indicator"]')!;
}

describe("Progress tone", () => {
  it("leaves the default indicator on the primary ink, with no tone attribute", () => {
    const { container } = render(<Progress value={40} aria-label="Indexing" />);
    expect(indicator(container).hasAttribute("data-tone")).toBe(false);
    expect(indicator(container).className).toContain("bg-primary");
  });

  it.each([
    ["success", "bg-success"],
    ["warning", "bg-warning"],
    ["error", "bg-error"],
  ] as const)("%s swaps the primary ink for %s", (tone, ink) => {
    const { container } = render(<Progress value={40} tone={tone} aria-label="Quota" />);
    const el = indicator(container);
    expect(el.dataset.tone).toBe(tone);
    expect(el.className).toContain(ink);
    expect(el.className).not.toContain("bg-primary");
  });
});

describe("Progress motion", () => {
  it("moves the fill by transform, not width", () => {
    const { container } = render(<Progress value={40} aria-label="Indexing" />);
    const el = indicator(container);
    expect(el.style.transform).toBe("translateX(-60%)");
    expect(el.style.width).toBe("");
    expect(el.className).toContain("transition-transform");
    expect(el.className).toContain("motion-reduce:transition-none");
  });

  it("a full bar sits at translateX(0)", () => {
    const { container } = render(<Progress value={100} aria-label="Indexing" />);
    expect(indicator(container).style.transform).toBe("translateX(0%)");
  });
});
