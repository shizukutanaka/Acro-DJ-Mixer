# ADR-0123: Master cut — transformer button

## Status
Accepted (2026-10-04)

## Context
The only way to silence the mix for a beat was the master fader —
a slow, two-position gesture. The transformer's cut (momentary
mute button) is the scratch-DJ staple that chops the master on a
beat with one finger.

## Decision
`cutGain` sits between `monoNode` and the limiter — decks, mic,
and sampler all pass through it, so the cut is a true master
kill. The `Cut` button on the Phones row is momentary only:
pointerdown ramps to 0 in ~3 ms, release/`pointercancel`/
`pointerleave` restores in ~5 ms. No latch — a cut that stays
down after a missed pointerup would silence the set.

## Consequences
- Beat-accurate chop is a one-finger gesture.
- The record path sees the cut too (it taps the limiter), so
  transforms land in the recording.
