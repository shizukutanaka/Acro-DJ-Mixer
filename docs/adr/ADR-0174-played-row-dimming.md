# ADR-0174: Played rows dim in the library

## Context
During a set, "what haven't I played yet" is the question a crate
dig answers — but played and unplayed rows render identically, so
the answer requires reading every row's ×N badge. Rekordbox and
Serato both mute already-played rows for exactly this scan.

## Decision
Rows with `plays > 0` get a `played` class dimming them to 55%
opacity — except rows currently on a deck (`:not(.onA):not(.onB)`),
where the live state outranks history.

## Consequences
- Unplayed tracks pop on sight; the ×N badge keeps the exact count.
- One class, one rule — no new state or UI.
