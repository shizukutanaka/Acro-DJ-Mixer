# ADR-0164: Mini-overview click seek

## Context
The overview strip (ADR-0162) answered "where am I" but not "take
me there" — its other canonical job on every DJ display. Deep in a
zoom, getting back out meant wheeling or scrubbing blindly.

## Decision
`pointerdown` on `.wave-mini` seeks to `fraction * duration` — the
mini's own scale is always the whole track, so it works whatever
the main wave's zoom is. Seeks refresh the drawn pos like
`seekFromEvent` does.

## Consequences
- One click jumps anywhere in the track from any zoom depth.
- The strip is now both read and write: see the position, grab it.
