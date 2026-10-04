# ADR-0027: Fractional BPM via Sub-Lag Interpolation

## Status
Accepted

## Context

`estimateBpm` quantized the beat period to the ODF frame grid
(~0.5–1% tempo error — a true 128 BPM read as 129). Rounded display
hid it, but `beatLen` consumed the error internally: over a 4-minute
track at 128 BPM (~205 beats), 0.9% error drifts the grid almost two
full beats by the end — visibly breaking quantize, loops, and the
phase meter on anything but short files.

## Decision

- Parabolic interpolation on the autocorrelation score around
  `bestLag` — `lag = bestLag + 0.5·(s[l−1]−s[l+1]) / (s[l−1]−2s[l]+s[l+1])`,
  applied only when `bestLag` is an interior local maximum and clamped
  to ±0.5 frames.
- `grid.bpm` is now fractional (`fps·60/lag`); UI still rounds to an
  integer (deck readout and library rows) — the DJ convention.
- Beat-phase comb still walks integer frames; the ADR-0025 energy-rise
  pass refines phase independently.

## Consequences

- test128: 129 → 128.23 BPM internally; end-of-track grid error shrinks
  by an order of magnitude.
- `needRate` in Sync and the harmonic-fit ratio now compare true
  tempos, not quantized ones.
- Library records keep fractional `bpm` — old integer records still
  work (display rounds; ratio checks unaffected).

## Rejected alternatives

- Smaller ODF hop: whole-analysis cost for one number; two-phase
  coarse→fine is the cheaper classic pattern (consistent with ADR-0025).
- Displaying decimals: extra precision the eye can't use mid-set; the
  value matters to the grid, not the readout.
