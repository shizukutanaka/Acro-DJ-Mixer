# ADR-0188: Drag a loop's edges on the waveform

## Context
Once armed, a loop's bounds could only move by the ‹ › beat-step
buttons — whole-length slides or one-beat trims. rekordbox/CDJ loop
adjust is a drag: grab the edge marker and pull it to the right
transient.

## Decision
While a loop is armed, pointerdown within 8 px of an edge marker
captures that edge instead of starting a scrub: the drag writes
`loopStart`/`loopEnd` live (`quantize()` snaps when Qtz is on),
clamped ≥50 ms apart and inside the buffer. Pointer-up persists via
`tagLib`, like every other loop edit. Middle-of-band presses still
scrub; shift+drag jog and mini-overview seek are untouched.

## Consequences
- Loop adjustment is a single gesture on the waveform itself —
  no counting ‹› presses.
- The hit-test only engages inside an armed band's edges, so the
  scrub surface is unchanged for non-looping play.
