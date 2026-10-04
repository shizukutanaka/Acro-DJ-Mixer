# ADR-0004: Key Detection and Harmonic-Mixing Hints

## Status
Accepted

## Context

With tempo-matching (ADR-0002) and pitch-preserving key lock (ADR-0003) in
place, the remaining "ears and memory" task is **harmonic mixing**:
choosing the next track in a compatible key. DJs resolve this on the
Camelot wheel — a circle-of-fifths relabeling where adjacent codes mix
without clashing.

First-principles requirements:

- Detect the musical key of a decoded track, locally, zero dependencies.
- Present the answer in the vocabulary DJs already use (Camelot code +
  common key name).
- Say *yes/no on compatibility* at a glance — beginners should not need to
  know the wheel's rules.

Options considered:

1. **Chroma + Krumhansl-Schmuckler profiles** — fold spectral energy into
   12 pitch classes, correlate with the two perceptual key templates at all
   12 rotations. One FFT pass, ~50 lines, the reference algorithm in the
   literature and in open keyfinders (keyfinder-cli uses a close variant).
2. **ML key classifier** (Essentia KeyCNN, ONNX) — better on edge cases but
   requires a model download, breaking the zero-dependency / file://
   constraint.
3. **Template variants** (Temperley, Sha'ath) — refinements of the same
   correlation; K-S chosen as the canonical baseline, swappable via the
   profile constants if evaluation later shows benefit.

## Decision

Chroma → K-S correlation, on the same shared mono downmix
(`monoResample`, 11025 Hz) that feeds BPM estimation:

- Hann-windowed 8192-sample frames (~0.74 s — resolves fundamentals down
  to ~55 Hz), FFT (a ~25-line iterative radix-2 implementation, no deps),
  bins 55–4000 Hz folded to pitch classes by `round(12·log2(f/27.5)) + 9`.
- Pearson-correlate the normalized chromagram against `KS_MAJOR`/`KS_MINOR`
  at each tonic; argmax wins; correlation < 0.4 → no confident key
  (`—`), e.g. drum-only material.
- Camelot code: `Am = 8A`, `C = 8B`, `+1` on the wheel = up a fifth;
  `steps = ((pc − anchor)·7) mod 12`.
- Compatibility shown by color, the minimal-rule version: same code,
  relative major/minor (same number), or ±1 same letter → green;
  otherwise amber. No extra UI steps — the hint appears next to BPM.

## Consequences

- Whole-track averaging reports the *dominant* key; mid-song modulations
  are not tracked (standard for DJ key tags — a future library feature can
  store per-section keys).
- Chroma includes harmonics, so dense/bright material can tilt toward the
  relative major/minor — the K-S profiles already encode that perceptual
  bias better than geometric templates.
- Both analyses share one offline render — no double decode.
- FFT runs on the main thread but bounded (~25 M ops for a 3-min track,
  <0.5 s); a worker can take it over if analysis ever grows.

## Rejected alternatives

- Model-based key detection: needs a downloaded model — violates the
  zero-dependency constraint.
- Per-frame key tracking: tracks rarely benefit; adds UI complexity for
  beginners.
