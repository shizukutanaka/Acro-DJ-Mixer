# ADR-0034: EBU R128 Gated Loudness for Auto-Gain

## Status
Accepted

## Context

ADR-0024 made auto-gain K-weighted, but it still averaged energy over
the whole file. EBU R128 specifies *gated* loudness precisely because
silence and quiet passages bias the measure: a 10-second track
followed by 20 seconds of silence read ~5 LU low, which would
under-attenuate (or over-report loudness) relative to a continuous
track.

## Decision

Implement the full R128 gate in `applyAutoGain` on the K-weighted
mono signal:

- 400 ms blocks, 75% overlap, block loudness
  `L = -0.691 + 10·log10(mean square)`.
- Absolute gate: drop blocks below −70 LUFS.
- Relative gate: drop blocks more than 10 LU below the mean of the
  surviving blocks.
- RMS is computed over surviving blocks (the existing attenuate-only
  gain math is unchanged; with no gated blocks it falls back to the
  previous full-signal RMS).

## Consequences

- Intro/outro silence and quiet breakdowns no longer deflate the
  loudness estimate — normalization tracks perceived programme
  loudness, matching streaming-service behaviour.
- Verified: 10 s sine + 20 s silence → RMS 0.210 gated vs 0.122
  ungated, matching the sine's true 0.212.

## Rejected alternatives

- Momentary/short-term loudness meters: useful display data, but the
  deck already has a live meter; only the integrated value feeds
  auto-gain.
- Recomputing on trim edits: no trim feature exists; the measure is
  per-load, matching how the library caches it.
