# ADR-0264: An old preview's onended can't kill the new preview

## Status
Accepted.

## Context
`previewTrack` stopped and disconnected the outgoing source, then
replaced `previewSrc`. But `stop()` fires `onended` asynchronously,
and the handler closed over the *global* — `if (previewSrc) {
previewSrc.disconnect(); previewSrc = null; ... }`. A rapid switch
(let A's stop land between B's assignment and A's onended) made A's
dead source disconnect and null B's live preview: the audition went
silent while the row still believed something was playing. The deck
player already got this right — `src !== this.source` — the library
preview was the one unchecked instance.

## Decision
Bind the handler to its own source and compare identity:
`if (previewSrc === src)` — a dead source can only clean up after
itself. Same pattern the deck and sampler pads already use.

## Consequences
Rapid row-switching can no longer silently kill the new audition.
Complements the preview token (ADR-0260) — token prevents layered
decodes, this prevents a stale onended from tearing down the graph.

## Round
Improvement round 264.
