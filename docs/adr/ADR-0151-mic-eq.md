# ADR-0151: Two-band mic EQ

## Context
The mic chain had a fixed HPF and a level knob — voice shaping was
impossible. Every DJM mic section carries HI/LOW EQ between the
level and the master, because an untrimmed vocal either booms over
the lows or disappears under the highs.

## Decision
Two shelving biquads between `micHp` and `monoNode`:
`lowshelf 200 Hz` and `highshelf 4 kHz`, each ±12 dB driven by its
own slider (same ±1 → ×12 dB mapping as the deck EQ, dblclick
reset). Nodes are built with the mic chain and torn down with it;
sliders only write gains when the chain exists.

## Consequences
- Voice sits in the master with the same tonal control a hardware
  mic section gives — cut mud at 200 Hz, lift presence at 4 kHz.
- The input-level tap still reads pre-EQ: the button indicator
  shows what the mic hears, not what the EQ makes of it.
