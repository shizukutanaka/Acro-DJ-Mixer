# ADR-0096: Shift+‹loop› — loop in-point adjust

## Status
Accepted (2026-10-04)

## Context
An armed loop could only move whole (one length per click) or be
re-armed. When the in-point caught the downbeat slightly late, the
fix was disarm + re-arm — two gestures that lose the loop length.

## Decision
`Shift+‹loop›/‹loop›` (the move buttons) slides the loop's in-point
one beat earlier/later while the out-point stays — CDJ's
LOOP IN ADJUST. Step is a grid beat (1 s when gridless), clamped to
`[0, end − min]`. `applyLoop()` propagates to both engines live,
and the trimmed region persists via `tagLib({ loop })` like any
loop edit.

## Consequences
- The loop length changes as the in-point moves — intended: it is a
  trim, not a move.
- Normal clicks still move the whole loop; shift already means
  "different action on this control" throughout the deck.
