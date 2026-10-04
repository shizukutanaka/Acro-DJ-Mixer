# ADR-0075: Shift+Sync — beat sync without touching tempo

## Status
Accepted (2026-10-04)

## Context
Sync always did both halves of beat-matching: tempo + phase. When
rates are already right (same-BPM tracks, or a deliberate tempo
offset for an effect), hitting Sync silently rewrote the tempo
fader — losing a setting the user chose on purpose.

## Decision
`syncTo(other, phaseOnly)`: Shift+Sync performs only the phase-slip
half, leaving `rate` and the tempo slider untouched; status reads
"Beat-matched". Plain click keeps full behavior. Auto-mix keeps
calling `syncTo(d)` unmodified — it still wants full tempo match.

## Consequences
- One gesture on an existing button; no new controls.
- `instantDouble` / auto-mix paths untouched (they pass no flag).
