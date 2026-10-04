# ADR-0049: Crossfader reverse — HAMSTER switch

## Status
Accepted (2026-10-04)

## Context
Scratch DJs flip the crossfader's assignment (the "hamster" switch) so
their dominant hand motion stays comfortable. Combined with the Cut
curve (ADR-0036) the fader was already scratch-capable except for this
one mapping bit.

## Decision
A `Rev` toggle beside the curve select sets `xfRev`; a single
`xfPos()` helper (`xfRev ? 1 - x : x`) feeds both `applyCrossfade()`
and `ensureNodes()`'s initial gains, so manual fades, auto-mix fades,
and deck init all honour the reversal. Curve choice and reverse are
orthogonal — Cut + Rev is the canonical scratch setup.

The toggle is mixer state, not per-deck and not persisted — same as
the curve select.

## Consequences
- `x = 0.2` with Rev routes 95 % to B and 31 % to A — the mirror of
  normal.
- Auto-mix keeps working: it drives slider positions and the mapping
  is symmetric.
