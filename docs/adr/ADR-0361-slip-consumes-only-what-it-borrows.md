# ADR-0361: Slip consumes a pad press only when it engages

## Context
With Slip on, `click` skipped `padCue` unconditionally — but
`slipCueStart` only engages while the deck is playing and the cue
is set. A stopped deck's pads went dead (no seek), and an empty pad
couldn't even set a cue, while the keyboard pads (z/x/c/v) bypassed
slip entirely and worked. Two input paths, two semantics.

## Decision
pointerdown records `pad._slipped = this._slip != null` — whether
slip actually borrowed the output. Click falls back to `padCue`
whenever slip didn't engage: stopped deck, unset cue, slip off. A
quick tap still round-trips (the flag survives the pointerup that
clears `_slip`).

## Consequences
Slip-mode pads match the keyboard pads and hardware: press-and-hold
slips, everything else is a normal hot cue.
