# ADR-0124: Deck track stepper — ‹ › library browse

## Status
Accepted (2026-10-04)

## Context
Loading the adjacent library track meant moving to the library
panel, finding the row, and clicking →A/→B — three gestures that
pull eyes off the decks. Crate-digging through candidates wants
"next, next, next" without leaving the deck.

## Decision
`‹`/`›` buttons beside Eject step the deck through the library in
display order (`updated_at` desc), wrapping around. A deck whose
track isn't in the library steps to the newest row. Playing decks
route through the same `armConfirm` two-click guard as →A/→B —
the accident this prevents is identical.

## Consequences
- Continuous audition: `› › ›` walks the crate one deck-load at
  a time, eyes on the waveform.
- The guard can't be bypassed by the shortcut path.
