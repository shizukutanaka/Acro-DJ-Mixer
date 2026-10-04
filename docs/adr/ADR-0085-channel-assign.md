# ADR-0085: Channel assign — A / Thru / B per deck

## Status
Accepted (2026-10-04)

## Context
Deck A always lived on the crossfader's left side and B on the right.
Hardware mixers route each channel through a CH ASSIGN switch —
A side, B side, or Thru (fader bypassed). Thru is how you keep a track
up while you chop the other; side-swapping is a scratch staple beside
the hamster reverse.

## Decision
A small `A/Thru/B` select per deck (defaults to its own side).
`applyCrossfade` computes the two side gains once (`ga`, `gb`) and each
deck picks `ga`/`gb`/`1` by its assign — curve select and hamster
reverse apply upstream, so assigns interact correctly with both.

## Consequences
- Fader-start follows the assign (hardware semantics): an edge only
  fires a deck whose select names that side — Thru decks don't start.
