# ADR-0065: Beat lamp per deck

## Status
Accepted (2026-10-04)

## Context
The bar counter (ADR-0052) tells you *where* you are numerically, but
matching two decks by ear/eye wants a peripheral indicator: the
beat-pulse LED every DJ mixer puts next to the channel.

## Decision
A `.beatlamp` dot beside the bar counter, driven in `tick()` off the
same grid math: lit for the first third of each beat (`.beat`, muted
grey), deck-accent on the downbeat (`.bar`). Off between beats — the
pulse *is* the tempo. No state, recomputed per frame.

## Consequences
- Glance-level tempo feel per deck, plus downbeat emphasis for
  phrasing.
- Costs one modulo per deck per frame.
