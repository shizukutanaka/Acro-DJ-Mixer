# ADR-0028: BPM Octave Correction (½ / 2×)

## Status
Accepted

## Context

The autocorrelation + octave guard picks the fastest plausible tempo,
but real music still misreads by an octave (half-time reads on
double-time feel tracks and vice versa). With no correction path, a
wrong-octave grid poisons Sync, quantize, loops, and the phase meter
for the whole set — every downstream consumer derives from
`grid.bpm`.

## Decision

- `½` and `2×` buttons beside the BPM readout call `scaleBpm(f)`,
  which multiplies `grid.bpm`, refreshes the readout, re-draws beat
  ticks, and persists via `tagLib({ bpm })` — the library keeps the
  correction across reloads.
- Range clamp 40–400 BPM: generous enough to pass through odd
  intermediates (e.g. 256 on the way down from a double-misread)
  while stopping runaway clicks.
- `beatOff` is untouched — doubling tempo halves beat spacing but the
  same phase still anchors the grid.

## Consequences

- One click fixes every grid consumer at once; a misread no longer
  requires reloading the track.
- `grid.bpm` stays fractional (ADR-0027) — corrections multiply the
  precise value, not the rounded display.

## Rejected alternatives

- Tap tempo: useful for unanalysable tracks, but a different feature —
  tapping sets tempo from scratch rather than correcting an estimate.
  Possible future addition on the same row.
- Re-running detection at 2×: the detector already considered that
  hypothesis and rejected it; trusting the user's ears is the correct
  override, not another heuristic layer.
