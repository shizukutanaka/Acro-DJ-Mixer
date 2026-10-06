# ADR-0196: Click the phase meter to sync

## Context
The beat-phase meter shows how far the decks' grids drift —
"Δ +23% beat" — as display only. The readout names the problem;
the obvious affordance is to click the readout to fix it, the way
the LU readout already toggles modes on click.

## Decision
Clicking `#phase` calls `syncTo` on the slave deck — the
non-playing one when exactly one deck plays, otherwise B→A (the
left-channel lead convention). It uses the real `syncTo` path, so
tempo+phase semantics (range clamp, both-playing phase re-seek)
match the Sync button exactly. No new code path.

## Consequences
- The drift number becomes a button: see "Δ +23%", click, it goes
  to "Δ +0%" — display and affordance in one element.
- Same-behavior guarantee: whatever Sync does, the meter does.
