# ADR-0019: Auto-Gain (Loudness Normalization)

## Status
Accepted

## Context

Two tracks rarely arrive at the same loudness; until now every load
left the deck gain at 100 %, so the first crossfade was a loudness
cliff. Every real DJ tool does this for you (iTunes Sound Check,
Serato auto-gain, Rekordbox normalize). We already compute a mono
downmix for analysis — the RMS is free.

## Decision

- On `load`, measure the mono RMS (reusing the same `monoResample`
  render that feeds BPM/key analysis — one offline render, three
  consumers) and set deck gain `g = clamp(0.18 / rms, 0.25, 1)`
  (target ≈ −15 dBFS RMS).
- **Attenuation only**: `g` never exceeds 1. A quiet track stays quiet
  — the user pushes the fader if they want it louder — instead of
  being boosted into the limiter. Boost would also make the gain
  slider's 0–1 range lie about the true gain.
- The slider and `%` readout reflect the computed gain, so the
  automation is visible and hand-overridable — the DJ can still ride
  the fader on top.

## Consequences

- First-load loudness is consistent across tracks; crossfades start
  level-matched.
- Adds zero new state: it's a load-time write to the existing gain
  path, not a parallel gain stage.

## Rejected alternatives

- True LUFS/K-weighted loudness: mono-RMS is a coarse proxy but the
  downmix already exists and the error is small vs the fix; a real
  loudness standard can replace it without changing the plumbing.
- Persisting per-track gain in the library: gain is a mix decision,
  not track metadata — recomputing on load keeps it honest.
