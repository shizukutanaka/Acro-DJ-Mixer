# ADR-0265: A brake ramp can't outlive its owner

## Status
Accepted.

## Context
`stopPlayback()` never cleared `_spinTimer`. A vinyl-brake ramp in
flight when its owner disappeared — eject during spin-down, or cue
during the ramp — kept ticking: posting `rate` to the worklet port,
mutating `spinMul` on a dead deck, and firing `done()` which touched
playback state again. Bounded (~600 ms) and mostly self-healing on
the next play, but wrong: a timer should die with the stop that
invalidated it.

## Decision
`stopPlayback()` clears `_spinTimer` and resets `spinMul` — the same
three lines `play()` already ran for its own re-entry. `eject()` and
`cue()` inherit the cleanup since both go through `stopPlayback()`.
The spin-down `done()` callback still runs *after* the timer cleared
itself, so the reset is a no-op there.

## Consequences
Eject or cue mid-brake cancels the ramp instantly instead of letting
it decay on a dead deck; subsequent loads/plays see a clean `spinMul`.

## Round
Improvement round 265.
