# ADR-0137: Deck mute — momentary channel on/off

## Context
Silencing a deck mid-set meant riding its gain knob to 0 and back
(two continuous moves, and the knob's position is lost), or pausing —
which freezes the playhead so the release lands off-beat. Mixers
solve this with a per-channel on/off switch: kill the audio, keep
the transport running.

## Decision
A `Mut` button on the Gain row, **momentary only** (hold = silent,
release = back). A dedicated `muteGain` stage sits between
`deckGain` and the mid/side splitter, so the gain knob's position
survives the silence untouched. ~3 ms attack / ~5 ms release —
sample-clean like the master Cut button (ADR-0123).

## Consequences
- One-finger channel kills for stutters and beat drops; the release
  always lands on beat because the source keeps playing.
- Distinct from master Cut: mute kills one deck pre-stem/EQ path
  (post-gain, pre-EQ), Cut kills the whole program post-master.
- No latch mode — a stuck mute on a deck is the same class of
  "silent channel" accident we guard elsewhere.
