"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "../../lib/utils.ts";
import { CopyGlyph } from "../../ui/animated-icon.tsx";
import { IconButton } from "../../ui/icon-button.tsx";

/** How long the button shows that it copied. */
const COPIED_MS = 1200;

/**
 * A value to hand on (an invite link, a token, a slug) with a copy button at
 * its end. The value is monospace and truncates on one line; the button's
 * glyph draws a check once the value is on the clipboard (`CopyGlyph`), and
 * only then: a refusal leaves it as it was.
 *
 * `onCopy` puts the text on the clipboard and resolves `true` when it did,
 * for an app that copies through its own bridge. Without it the field uses
 * the browser's clipboard.
 */
function CopyField({
  value,
  onCopy,
  label = "Copy",
  copiedLabel = "Copied",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  value: string;
  onCopy?: (value: string) => boolean | Promise<boolean>;
  /** The button's name. */
  label?: string;
  /** The button's name for a moment after it copied. */
  copiedLabel?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    let ok = false;
    try {
      ok = onCopy
        ? (await onCopy(value)) === true
        : await navigator.clipboard.writeText(value).then(() => true);
    } catch {
      ok = false;
    }
    if (!ok) return;
    clearTimeout(timer.current);
    setCopied(true);
    timer.current = setTimeout(() => setCopied(false), COPIED_MS);
  };

  return (
    <div
      data-slot="copy-field"
      className={cn(
        "flex min-w-0 items-center gap-1 rounded-md bg-muted py-1 pr-1 pl-2",
        className,
      )}
      {...props}
    >
      <code className="min-w-0 flex-1 truncate code text-secondary-foreground">{value}</code>
      <IconButton
        size="sm"
        icon={<CopyGlyph copied={copied} size="sm" />}
        label={copied ? copiedLabel : label}
        onClick={() => void copy()}
      />
      {/* The button's new name is not announced everywhere; this is. */}
      <span role="status" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </div>
  );
}

export { CopyField };
