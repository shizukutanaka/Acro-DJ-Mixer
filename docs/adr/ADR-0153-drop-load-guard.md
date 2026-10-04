# ADR-0153: Drop load guard

## Context
ADR-0104 armed `->A/->B` and ADR-0124 extended it to the deck
steppers and delete — but a file dropped straight onto a playing
deck's dropzone still called `load()` directly. Same accident
class, one unguarded door: an errant drop silenced the floor
instantly.

## Decision
The dropzone `drop` handler now routes through `armConfirm(dz, ...)`
when the deck is playing — first drop shows `sure?` on the
dropzone for 2 s, a second drop inside the window loads. Stopped
decks still load on the first drop, exactly like the buttons.

## Consequences
- Every path that can replace a playing deck's track (load buttons,
  steppers, drag-and-drop) now shares the two-gesture confirm.
- The arm marker lives on the dropzone itself — a transient
  `sure?` replaces the track name display for 2 s, then restores.
- No new gesture: drops were already the deck's load surface.
