# ADR-0141: Trans chop rate follows the BEAT division

## Context
The trans gate (ADR-0097) chopped exactly once per beat — a fixed
stutter rate that ignored the `fxBeat` division select driving echo
time (ADR-0094) and the flanger sweep (ADR-0138). DJs reach for the
BEAT parameter precisely to vary chop density: ¼ divisions are the
fast machine-gun stutter, whole beats are the slow chop.

## Decision
`gateOsc.frequency = 1 / (div * beat)` — the same division variable
_syncDelay already computes. At 120 BPM: ¼ → 8 Hz stutter, ½ → 4 Hz,
¾ → ~2.7 Hz, 1 → 2 Hz (the old fixed rate).

## Consequences
- All three beat-class effects now respect the division select:
  echo spaces, flange breathes, trans stutters.
- The 1-beat default reproduces the previous behaviour at BEAT=1 —
  the standard chop moves to ¾ default (2.7 Hz), a hair faster, which
  matches how the DJM trans actually sounds at its default division.
