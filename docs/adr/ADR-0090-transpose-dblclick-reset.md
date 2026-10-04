# ADR-0090: Double-click the transpose readout to reset

## Status
Accepted (2026-10-04)

## Context
Every adjustable control resets on double-click (tempo, EQ, filter,
FX, gain, crossfader, master) — except transpose, which took N clicks
of −/+/key-sync undo to return to concert pitch.

## Decision
`dblclick` on the `±N` readout calls `transpose(-this.st)` — the same
code path as the buttons, so pitch message, readout, and partner
harmonic re-score all update together. Clamped −6..+6 can't overflow.

## Consequences
- The dblclick-reset doctrine now covers every control that drifts
  from a default.
