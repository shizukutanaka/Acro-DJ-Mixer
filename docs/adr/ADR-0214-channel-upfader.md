# ADR-0214: Channel upfader per deck

## Context
The surface had a crossfader but no channel faders — the only
post-EQ channel level was the Gain trim knob, so the classic
"ride the upfader" move (and the standard signal-flow mental
model of a DJ mixer) was missing. The audit listed channel
faders as the largest remaining structural gap.

## Decision
A `Fader` row under Gain on each deck drives a new `fader`
GainNode between `crusher` (the end of the channel strip) and
`xfGain` (the crossfader stage). The channel meter stays tapped
at `filter` — pre-fader, because a meter that dies with the
fader tells you nothing. Same idioms as Gain: input handler +
setTargetAtTime, double-click reset to unity, session
persisted.

## Consequences
- The deck now has the full mixer path:
  trim → EQ/filter/FX → upfader → crossfader → master.
- Post-fader FX sends (pre/post tap, ADR-0134) now have a real
  second fader to reference.
