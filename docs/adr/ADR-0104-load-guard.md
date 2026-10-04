# ADR-0104: Load guard — confirm before replacing a playing deck

## Status
Accepted (2026-10-04)

## Context
A library row's `→A`/`→B` reloads the deck instantly — while that
deck is playing, a stray click kills the floor's audio mid-set.

## Decision
The row button arms a 2 s "sure?" state when its target deck is
playing; a second click inside the window confirms, otherwise it
reverts. Stopped decks load instantly as before. The guard lives in
the click handler only — `loadInto` itself stays unguarded so
auto-mix's `autoNext` (which loads into a faded-out deck) isn't
affected.

## Consequences
- Same interaction as delete-confirmation buttons: one click warns,
  the next confirms.
- Eject is unaffected — it's a deliberate deck-level action, not a
  library row stray.
