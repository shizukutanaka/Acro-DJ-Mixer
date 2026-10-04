# ADR-0024: K-Weighted Loudness for Auto-Gain

## Status
Accepted

## Context

ADR-0019 measured raw mono RMS — but flat RMS over-weights sub-bass
(the ear is insensitive there) and under-weights the 2–4 kHz region it
is most sensitive to. A bass-heavy track read "hotter" than it sounds;
auto-gain would over-attenuate it relative to a mid-forward track of
the *perceived* loudness.

## Decision

- `kWeight(mono)` — JS biquads implementing the ITU-R BS.1770 stage-1
  approximation over the existing mono downmix: RLB high-pass at
  38 Hz (Q = 0.5), then a +4 dB high shelf at ~1.68 kHz
  (RBJ cookbook coefficients, computed once per call at `ANALYSIS_SR`).
- `applyAutoGain` measures RMS of the K-weighted signal; target,
  clamps, and slider behaviour unchanged.
- Shelf verified numerically: unity below ~500 Hz, +4 dB (≈1.585) at
  high frequency — a sign error in the b1 coefficient (caught by a
  magnitude-response sweep) initially inverted it.

## Consequences

- Auto-gain now tracks *perceived* loudness — the property that
  actually matters at the crossfade.
- One extra Float32Array pass over the downmix per load — negligible.
- Still a mono, ungated measure — full BS.1770 gating is out of scope
  (documented as a possible refinement).

## Rejected alternatives

- Running the shelf inside the OfflineAudioContext render: would mean
  a second render pass or contaminating the shared downmix that feeds
  BPM/key; a JS biquad over the rendered mono keeps one render and
  three clean consumers.
- Full EBU R128 integrated loudness with gating: the gating needs
  block statistics the 8 s–scale tracks here don't justify; RMS of the
  weighted signal is the right cost point.
