# ADR-0395: The held Cue-preview dies with the track too

## Context
Track swaps abandon every in-flight gesture bookkeeping —
`_slip`, `_roll`, `_slice` are cleared in both the load and eject
paths (ADR-0328), and a held Phones cue-hold got the same treatment
in ADR-0383. `_cuePreview` — the flag armed by holding the deck Cue
button on a stopped deck — was missed. Armed and left stale, the
next `pointerleave`/`pointerup`/`pointercancel` on that button runs
`pause()` + `cue()` on the *new* track: hover off the button and a
playing deck phantom-stops and snaps to its cue point.

## Decision
Both swap-abandonment blocks (the `_slip`/`_roll`/`_slice` clears in
load and eject) now clear `_cuePreview` too. No release-side
transport runs — the load's own stopPlayback already ended the
preview playback, and restoring the old track's cue point on a new
buffer would be meaningless.

## Consequences
A held Cue preview interrupted by load/eject leaves no latch:
the next touch of the Cue button behaves like a first touch.
