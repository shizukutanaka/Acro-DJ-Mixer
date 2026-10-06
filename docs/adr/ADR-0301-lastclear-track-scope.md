# ADR-0301: Cleared-cue undo resets with the track

## Context

`_lastClear` stashes the last shift-cleared hot cue so right-click
on the empty pad restores it — but nothing ever reset it. Clear a
cue on track A, load track B, and right-clicking an empty pad
restored *A's* cue onto B's grid and re-tagged it onto B's library
record. A cue borrowed from another track is worse than no undo:
it lands at a plausible-looking position and corrupts the record.

Every other undo stash (`_prevCueIn`, `_prevGrid`, `_prevLoopMem`)
already resets on load/eject for exactly this reason; `_lastClear`
predated the rule and was missed.

## Decision

`_lastClear = null` on load (beside the `_prevCueIn` reset) and on
eject (beside the pad reset). The undo belongs to the track it was
taken from.

## Consequences

- Cross-track cue resurrection is impossible; same-track undo is
  unchanged.
