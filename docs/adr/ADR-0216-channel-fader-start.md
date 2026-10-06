# ADR-0216: Channel fader start — off zero starts the deck

## Context
ADR-0068 gave the crossfader FADER START (sweep fully into a
stopped deck's side and it plays), but the channel upfader
added in ADR-0214 didn't have the same idiom — on a CDJ/DJM rig
pulling a channel fader off zero starts the cued deck, and a
user reaching for the upfader would expect it.

## Decision
The fader input handler tracks `_faderPrev`; a 0 → >0 edge
while `buffer` exists and the deck is stopped calls `play()`.
Edge-triggered like the crossfader version so nudging a parked
fader doesn't retrigger, and a deck parked past its end stays
put.

## Consequences
- Both faders on the channel now honour FADER START — the
  classic cue-fire path works whichever fader the DJ reaches
  for.
