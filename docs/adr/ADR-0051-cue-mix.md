# ADR-0051: Cue mix — blend master PGM into the headphone bus

## Status
Accepted (2026-10-04)

## Context
The headphone bus (ADR-0007) carries only pre-fader cue — while beat-
matching that's correct, but a DJ also wants the room program in their
ears to judge the transition as the floor hears it. Real mixers label
this CUE MIX / MONITOR: a knob blending PFL against PGM.

## Decision
A `pgmSend` GainNode taps `masterGain` into `cueDest`, parallel to the
cue `cueIn`. The `Cue mix` slider (0 = cue only, default — unchanged
behaviour) raises `pgmSend` to blend program in; it deliberately does
not attenuate the cue path — the knob *adds* PGM, which matches how
monitor knobs behave and keeps the cue signal always at full level.

The cue meter still reads `cueIn` (pre-mix) — it answers "what's on
the cue bus", while PGM is already visible on the master meter.

## Consequences
- Phones can monitor the program while a deck is cued — the standard
  club-headphone setup.
- PGM taps *before* the limiter node? No — `masterGain` is pre-limiter;
  cue phones hear the un-limited program. Acceptable: limiter is
  a protection stage, not a tonal one.
- No persistence, mixer-level state like the cue output selector.
