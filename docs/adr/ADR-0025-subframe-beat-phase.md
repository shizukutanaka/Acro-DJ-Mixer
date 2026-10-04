# ADR-0025: Sub-Frame Beat-Phase Refinement

## Status
Accepted

## Context

`estimateBpm` reported `beatOff` quantized to the ODF frame grid
(~11.6 ms at `ANALYSIS_SR`/hop 128) — the comb score cannot see inside
a frame because a kick's energy smears into whichever frame contains
it. Phase meter (ADR-0023) and Sync then inherit that jitter:
quantized loops land ~±6 ms off the transient on average.

## Decision

After the coarse comb picks `bestPhase`/`bestLag`, refine on the raw
mono signal: around each comb line (±lag/8 samples), locate the
position of steepest energy rise at ~1.5 ms steps (128-sample energy
window, 16-sample hop), then take the strength-weighted mean residual
in ODF-frame units. `beatOff` becomes `refined * hop / sr`.

## Consequences

- Beat-grid error on synthetic off-grid kicks: ~10 ms → ~4 ms.
- Cost: ~1–2 M extra ops per load — negligible beside the analysis
  passes already done.
- On-grid beats still read ~0 offset; no consumer changes needed
  (loop, quantize, Sync, phase meter all get tighter for free).

## Rejected alternatives

- Flux-weighted residual centroid: tried first — the ODF smears the
  onset into one frame so the local maximum already sits on the comb
  line (residual ≈ 0, no gain). Energy-rise search on the raw signal
  sidesteps the frame resolution entirely.
- Smaller ODF hop: would quadruple the whole analysis cost for a
  refinement needed only at one stage; two-phase coarse→fine is
  cheaper and standard (Ellis 2006 uses a similar refine pass).
- Parabolic interpolation of the autocorrelation lag: `bpm` is
  reported as an integer, so sub-lag period precision buys nothing
  end-to-end; skipped deliberately.
