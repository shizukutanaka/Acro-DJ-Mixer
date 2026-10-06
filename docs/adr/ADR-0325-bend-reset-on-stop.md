# ADR-0325: A held pitch bend dies with the stop

## Context

`bendMul` is finger state: it lives only while a bend button is
held. But the restore path ran solely on
`pointerup`/`pointerleave`/`pointercancel` — a window blur or a
stop arriving mid-hold (pause, cue, load, eject) left `bendMul`
latched at 0.95/1.05, so the *next* play ran ±5% off with no UI
hint. The button's `.on` light stayed lit too, backing a lie.

## Decision

`stopPlayback()` — the funnel every stop path already goes through —
now resets `bendMul` to 1 and clears both bend buttons' `.on`, the
same rule `_spinTimer`/`spinMul` already follow there. A release
that arrives afterwards is a no-op (`bendMul === 1` early-returns).

## Consequences

- The pitch multiplier can never outlive the playback it belonged
  to — pause, cue set, load and eject all hand a clean rate to the
  next play.
