# ADR-0257: Play after a natural end restarts at the cue point

## Status
Accepted.

## Context
When a track plays to its end, the worklet processor parks its
internal position at the buffer's tail. Pressing Play again set
`this.offset = 0` — bookkeeping only — then posted `play`. The
processor resumed *at the end of the buffer* and ended again on
the next block: Play-after-end silently did nothing on the
default engine. The file://-only buffer source path happened to
work because each `source.start()` is created from the offset.

## Decision
The end-wrap now (a) lands on `cueIn` — the same point the deck
loaded to, so lead-in silence stays skipped on a replay — and
(b) posts an explicit `seek` to the worklet so the processor's
position and `offset` agree. `cue()` was already the one place
that kept the two in sync; `play()` shares that contract.

## Consequences
Replay-after-end actually restarts, and it restarts where a
re-cued track would. No change mid-track.

## Round
Improvement round 257.
