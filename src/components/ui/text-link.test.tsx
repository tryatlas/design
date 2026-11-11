// @vitest-environment happy-dom
import { readFileSync } from "node:fs";
import path from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { LinkProvider, type LinkProps } from "../../lib/link.tsx";
import { buttonVariants } from "../../ui/button-variants.ts";
import { TextLink, linkVariants } from "./text-link.tsx";

afterEach(cleanup);

const classes = (s: string) => s.split(/\s+/);

describe("the link underline rule", () => {
  it("a standalone link has no underline at rest, and one on hover and keyboard focus", () => {
    for (const cls of [
      linkVariants(),
      linkVariants({ tone: "muted" }),
      buttonVariants({ variant: "link" }),
    ]) {
      expect(classes(cls)).not.toContain("underline");
      expect(classes(cls)).toContain("hover:underline");
      expect(classes(cls)).toContain("focus-visible:underline");
    }
  });

  it("variant inline keeps its underline at rest, for a link the app sets in a sentence", () => {
    const cls = classes(linkVariants({ variant: "inline" }));
    expect(cls).toContain("underline");
    expect(cls).not.toContain("no-underline");
    render(
      <TextLink href="/docs" variant="inline">
        the docs
      </TextLink>,
    );
    expect(classes(screen.getByRole("link").className)).toContain("underline");
  });

  it("a link in prose keeps its underline at rest", () => {
    const css = readFileSync(path.join(import.meta.dirname, "../../styles/session.css"), "utf8");
    const rest = css.slice(css.indexOf(".prose-session a {"));
    expect(rest.slice(0, rest.indexOf("}"))).toMatch(/text-decoration-line:\s*underline/);
  });
});

describe("TextLink", () => {
  it("is a plain anchor without a provider", () => {
    render(<TextLink href="/docs">Docs</TextLink>);
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link.getAttribute("href")).toBe("/docs");
    expect(link.dataset.slot).toBe("text-link");
  });

  it("renders through the app's Link", () => {
    const Routed = ({ href, ...props }: LinkProps) => (
      <a data-routed href={`#${href}`} {...props} />
    );
    render(
      <LinkProvider Link={Routed}>
        <TextLink href="/docs" tone="muted">
          Docs
        </TextLink>
      </LinkProvider>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link.hasAttribute("data-routed")).toBe(true);
    expect(link.getAttribute("href")).toBe("#/docs");
    expect(link.className).toContain("text-secondary-foreground");
  });
});
