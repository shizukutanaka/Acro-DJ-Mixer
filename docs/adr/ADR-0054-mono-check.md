# ADR-0054: Master mono check

## Status
Accepted (2026-10-04)

## Context
Club PAs are frequently mono, and wide material (ADR-0026 stems lean
on M/S content) can thin out or vanish when folded down. There was no
way to audition the fold without repatching.

## Decision
`monoNode`, a permanent pass-through GainNode between `masterGain` and
`limiter`, runs `channelCount=2, channelCountMode='explicit'` (stereo
identity). The `Mono` button flips `channelCount` to 1 — the Web Audio
down-mix rule folds L+R to one channel — and toggles `.on`. One node,
no rewiring, audible mid-playback.

Placement pre-limiter is deliberate: mono combining raises correlated
energy, and the limiter then sees exactly what a mono PA would get.

## Consequences
- One click answers "does this still work on a mono system".
- Recording (ADR-0014) taps `limiter` so a mono master records mono —
  consistent with monitoring what you print.
- Mixer-level state, not persisted.
