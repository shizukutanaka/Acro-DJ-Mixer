# ADR-0327: The unload guard covers paused and flushing takes

## Context

`beforeunload` only prompted while `recorder.state === 'recording'`.
Shift+Rec pauses a take — and a paused take holds the same unsaved
chunks, yet closing the tab asked nothing. The flush window between
`stop()` and `onstop` (where the take is actually saved) was also
unguarded.

## Decision

Guard on `recorder` being non-null instead: `recorder` is only
cleared inside `onstop`, once the take has been committed to the
library. Non-null therefore means exactly "unsaved chunks exist" —
recording, paused, or mid-flush.

## Consequences

- No path that can lose a take closes silently anymore; the prompt
  appears for every state that still owns audio.
