/**
 * A transcript whose rows are still loading: a structural skeleton over the
 * transcript-width column, so opening a recorded session reads as "loading
 * messages" instead of a blank spinner. The bars are static (no animation),
 * with a slight width variation so they read as a list rather than a grid of
 * identical bars.
 */
export function LoadingTranscriptState({ rows = 6 }: { rows?: number }) {
  return (
    <div className="h-full overflow-hidden">
      <div className="mx-auto w-full max-w-(--transcript-column)">
        <TranscriptSkeleton rows={rows} />
      </div>
    </div>
  );
}

/** The skeleton's rows alone, for a frame of the app's own. */
export function TranscriptSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div role="status" aria-label="Loading" className="h-full flex flex-col gap-2 p-3">
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-6 rounded-md bg-card opacity-50"
            // ratchet-allow: a per-row width from the row index, not a scale value.
            style={{ width: `${78 + ((i * 13) % 22)}%` }}
          />
        ))}
      </div>
    </div>
  );
}
