# ADR-0218: Alt+Loop traps the last N beats — loop-back capture

## Context
Loop arming always reached forward: N beats starting at the next
beat boundary. You could never capture the phrase you just heard —
the Serato loop-back / capture idiom — without marking in/out by
hand.

## Decision
`toggleLoop` takes `back`; the same bounds math is flipped around
the playhead: `end` becomes the boundary it would have started
from, `start` sits N beats earlier. Playback stays inside the
trapped region. Honest failure when there isn't N beats of track
behind. Qtz and the beats select apply identically — freehand
without a grid, snapped with one.

## Consequences
- One modifier closes the "catch what just played" move — the
  last direction the loop grammar was missing.
