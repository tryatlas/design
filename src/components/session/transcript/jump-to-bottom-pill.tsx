"use client";

import { memo } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "../../../lib/utils.ts";

/**
 * "Scroll to bottom" / "N new messages", floated above the composer stack.
 *
 * Positioned against its parent's top edge (`bottom-full`), so the app puts it
 * in the box the composer stack sits in. The wrapper is `pointer-events-none`
 * so the empty width either side of the pill never swallows clicks meant for
 * the transcript.
 */
export const JumpToBottomPill = memo(function JumpToBottomPill({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <div className="pointer-events-none absolute bottom-full inset-x-0 mb-2 z-20 flex justify-center">
      <button
        onClick={onClick}
        title="Jump to latest"
        className={cn(
          "pointer-events-auto atlas-pill-in inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
          "border border-[var(--border)] bg-[var(--card)]",
          "text-xs leading-none font-medium text-[var(--secondary-foreground)]",
          "shadow-sm cursor-pointer transition-colors",
          "hover:bg-element-hover hover:text-[var(--foreground)]",
        )}
      >
        <ChevronDown size={11} />
        <span>
          {count > 0 ? `${count} new message${count === 1 ? "" : "s"}` : "Scroll to bottom"}
        </span>
      </button>
    </div>
  );
});
