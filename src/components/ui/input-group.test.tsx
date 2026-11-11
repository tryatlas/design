// @vitest-environment happy-dom
import { readFileSync } from "node:fs";
import path from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { InputGroup, InputGroupInput, InputGroupTextarea } from "./input-group.tsx";

afterEach(cleanup);

describe("InputGroup", () => {
  it("shows focus on the group: its border lifts, and no control draws a ring", () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="Search" />
        <InputGroupTextarea aria-label="Note" />
      </InputGroup>,
    );
    for (const name of ["Search", "Note"]) {
      expect(screen.getByLabelText(name).className.split(/\s+/)).toContain("focus-ring-none");
    }
    const group = screen.getByLabelText("Search").closest('[data-slot="input-group"]')!;
    // A text field draws no outline (decision 31): the group's border, in the
    // ring's colour, is the one indicator (the Autofocused and Clicked stories
    // check the drawn result).
    expect(group.className).toContain(
      "has-[[data-slot=input-group-control]:focus:not([aria-invalid=true])]:border-ring",
    );
    expect(group.className).not.toContain("outline-ring");
  });

  it("focus-ring-none removes the :focus-visible outline", () => {
    const css = readFileSync(path.join(import.meta.dirname, "../../styles/utilities.css"), "utf8");
    expect(css).toMatch(/@utility focus-ring-none \{\s*&:focus-visible \{\s*outline: none;/);
  });
});
