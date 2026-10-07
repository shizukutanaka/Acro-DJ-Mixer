# ADR-0377: One crossfade law, two consumers

## Context
`ensureNodes` seeded `xfGain` from the deck's *physical* side and a
plain cos/sin law — it ignored both channel assign and the CUT
curve. With assign persisted across sessions, a deck assigned B
(or Thru) could boot with the wrong fader level and keep it until
the fader next moved. The law existed twice: once here (wrong),
once in `applyCrossfade` (right).

## Decision
`xfGainFor(sel)` holds the whole law — fader position, hamster
mirror, CUT vs smooth curve, A/B/Thru assign — shared by
`applyCrossfade` (fader moves) and `ensureNodes` (node creation).
`ensureNodes` writes `.value` directly: `setTargetAtTime` doesn't
tick while the AudioContext is suspended, so pre-gesture loads
still get the correct level.

## Consequences
Any future change to the fader law edits one function; restored
sessions can't inherit a stale crossfade position.
Also: tests/smoke.mjs clears localStorage before load — the app's
session persistence made the gate order-dependent (a run that left
non-default assign/curve behind would seed the next run).
