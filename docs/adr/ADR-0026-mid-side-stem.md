# ADR-0026: Mid/Side Stem Split (Vocal / Inst)

## Status
Accepted

## Context

Stem separation was the last roadmap item — and the one flagged as
needing an ML model, which clashes with the zero-dependency doctrine.
First principles: what DJs actually use stems for is (a) acapella
extraction and (b) vocal-removed instrumentals for mashups. For
conventionally mixed stereo files — lead vocal hard-centre, instruments
spread — the classical mid/side split delivers both without any model.

## Decision

- A per-deck `Stem` select: `Full` (passthrough), `Vocal` (centre,
  `(L+R)/2` on both channels), `Inst` (sides, `(L−R)/2` on both).
- Implemented as a fixed topology inserted between `deckGain` and the
  EQ chain: `ChannelSplitter(2)` → four matrix `GainNode`s →
  `ChannelMerger(2)`. Mode switches only reweight the four gains via
  `setTargetAtTime` (0.03 s) — no re-connects, click-free.
- Weights order `[L→oL, L→oR, R→oL, R→oR]`: voc `[0.5,0.5,0.5,0.5]`,
  inst `[0.5,0.5,−0.5,−0.5]`, off `[1,0,0,1]`.

## Consequences

- Acapella and instrumental extraction on any stereo file, zero deps,
  zero latency cost beyond two channel nodes.
- Real limits apply and are documented in the UI title: it only
  isolates *panned-centre* content — stereo vocals or side-biased
  mixes won't split cleanly. This is the honest 80/20 before ever
  considering an ML model.

## Rejected alternatives

- ML source separation (spleeter/demucs-class): megabytes of model,
  wasm runtime, batch latency — breaks the zero-dependency, instant,
  single-file design. Revisit only if user demand outgrows mid/side.
- Dynamic topology swap (connect mid-path or side-path per mode):
  re-connecting pops; fixed topology + gain reweighting is silent.
