# ADR-0062: Tempo slider double-click reset

## Status
Accepted (2026-10-04)

## Context
Zeroing a ±16% pitch fader by hand never lands on exactly 1.000 —
every mixer gives you a TEMPO RESET for it. The filter and echo knobs
already reset on double-click; the most important fader didn't.

## Decision
`dblclick` on the tempo slider sets `tempoEl.value = 1` and calls
`setRate(1)` — the same code path the slider uses, so the output
readout, engine rate, and `pos()` rebasing all stay consistent.
No new control; title documents it.

## Consequences
- One gesture to honest ±0.0% — and it composes with bend/brake, which
  are separate multipliers by design.
