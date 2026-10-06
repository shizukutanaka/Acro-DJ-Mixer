# ADR-0328: Track swap abandons held slip/roll bookkeeping

## Context

`_slip`, `_roll`, `_loopT`, and `_loopEnterPos` are the dead-reckoning
records for momentary maneuvers — they must survive a pause (release
while paused resolves cleanly), but they must not survive a track
swap. `load()` cleared none of them and `eject()` only cleared the
loop pair, so a held slip cue or loop roll leaked onto the new track:

- a stale `_slip` blocked `slipCueStart` (it refuses while `_slip` is
  set) and drew the ghost playhead against the new buffer;
- a late `stopRoll` release restored `r.saved` — the OLD track's
  loop bounds — onto the new track and `tagLib`'d them into its
  library prep;
- a stale `_loopT`/`_loopEnterPos` made the slip-resume math compute
  a landing from the old track's timeline;
- `rollBtn` stayed lit on an empty deck.

## Decision

`load()` and `eject()` null all four fields and unlight `rollBtn`
in their reset clusters — no `saved` restore, since both paths
disarm the loop anyway. `stopPlayback()` is deliberately NOT the
funnel: pause mid-maneuver is legal and the release resolves it.

## Consequences

- A late release after a swap is a clean no-op; the ghost, the lit
  button, and the next slip/roll all reflect the new track only.
