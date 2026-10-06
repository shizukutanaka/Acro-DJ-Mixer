# ADR-0191: Cancelling a fade rolls the fader and incoming deck back

## Context
Clicking Auto mid-fade restored the filter, echo send, and bass
swap — but left the crossfader wherever it had ridden and left the
incoming deck playing inaudibly underneath. The visible symptom:
"why is nothing coming out" plus a track silently burning.

## Decision
Cancel now also writes `xfader.value = fade.fromX` (the outgoing
deck's side) and pauses the incoming deck — the audible state
rolls back to before the transition fired, matching what "abort"
means on the floor.

## Consequences
- A cancelled transition is a true undo, not a half-applied mix.
- The incoming deck pauses rather than playing under silence; the
  DJ presses play if they meant to keep it.
