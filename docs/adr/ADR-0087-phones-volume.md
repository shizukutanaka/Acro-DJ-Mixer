# ADR-0087: Phones volume — master level for the headphone bus

## Status
Accepted (2026-10-04)

## Context
Cue mix blended PFL with PGM but nothing set the headphone loudness
itself — cue output ran at whatever level the deck pushed, which on
real mixers is the `PHONES LEVEL` knob.

## Decision
A `phonesOut` gain sits between the cue/PGM panners and `cueDest` —
both sources sum through it, so one `Phones` slider (0–100%)
controls the whole bus regardless of the mix position. The cue-bus
meter still taps `cueIn` upstream, so PFL metering doesn't follow the
volume knob (matching hardware meter convention).

## Consequences
- Default 100% preserves previous behavior.
