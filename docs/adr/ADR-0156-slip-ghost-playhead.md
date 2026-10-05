# ADR-0156: Slip ghost playhead

## Context
With Slip on, a held hot cue, roll, or armed loop borrows the output
while the timeline keeps running underneath — but the waveform only
drew the *audible* playhead. You couldn't see where you'd land on
release, which is the one question a slip maneuver raises.

## Decision
A dimmer second playhead (45 % white) drawn while `slip && playing`
and a slip maneuver is active, at the virtual position each slip
site already books: `_slip` (hot-cue hold), `_roll` (loop roll), and
`_loopT`/`_loopEnterPos` (armed loop, ADR-0143). Same draw pass, no
new state.

## Consequences
- During any slip borrow you can watch the real timeline walk ahead
  and release on the bar you want to land on.
- Closes the visual half of the slip doctrine: audio returns to the
  virtual position (ADR-0143), and now that position is visible.
