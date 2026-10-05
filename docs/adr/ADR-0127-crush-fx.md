# ADR-0127: Crush FX — staircase lo-fi on the dry path

## Status
Accepted (2026-10-04)

## Context
Four FX existed, all clean. The other canonical transition tool
is the lo-fi crush (SP-404 vinyl sim / DJM-derivative crushers):
degrade the channel on purpose for a breakdown, then release.

## Decision
`crush` joins `fxSel` as the fifth option — a dry-path processor
like Trans. A `WaveShaperNode` sits between `gate` and `xfGain`;
the knob maps to a staircase curve quantizing amplitude into
62→2 levels (heavier crush as it opens), 2× oversampling to tame
the aliasing the quantization itself makes. Off/other FX = a
linear curve, so the node is transparent when parked. Send taps
(delay, flanger, channel meter) stay on `filter` — echoes of a
crushed phrase decay clean, matching send-FX convention.

## Consequences
- Breakdown lo-fi without touching EQ or loading a degraded file.
- Pure amplitude crush (no sample-rate decimation — that needs a
  worklet); the staircase reads as bit-crush on program material.
