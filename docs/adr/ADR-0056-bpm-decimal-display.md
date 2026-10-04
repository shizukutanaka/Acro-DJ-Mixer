# ADR-0056: Show BPM to one decimal

## Status
Accepted (2026-10-04)

## Context
ADR-0027 made the tempo estimate fractional (`120.166`) but the UI
still rounded to integers — displaying `120` for a 120.2 grid is both
lost precision and slightly dishonest about the drift a 0.2 BPM error
causes over a long track.

## Decision
Every BPM readout (`bpmEl` after analysis, after library recall, and
the tap-tempo status) formats with `.toFixed(1)`. One decimal is the
DJ convention (CDJ shows one) — more digits would imply precision the
estimator doesn't have.

## Consequences
- "Both decks read 120.2 → they're truly matched" is now visible;
  before, 120.2 vs 120.0 both showed 120.
- No behavioural change; display-only.
