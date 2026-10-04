# ADR-0131: Eject guard — two-click confirm on a playing deck

## Context
ADR-0104 armed `->A`/`->B` loads against a playing deck, and ADR-0124
gave the `<`/`>` stepper the same `armConfirm` guard — all to stop the
"one misclick silences the floor" accident. `Eject` (ADR-0084) does
exactly the same thing — it stops playback and unloads — but was left
unguarded, making it the last unprotected one-click silence on a live
deck.

## Decision
Clicking `⏏` while `this.playing` routes through the shared
`armConfirm(b, fn)` two-click idiom (2 s `sure?` window, second click
commits). A stopped deck ejects immediately, as before.

## Consequences
- Every destructive one-click that can kill a playing deck's output —
  load, stepper, and now eject — follows the same confirm idiom.
- Paused/cued decks still eject with one click (no output to kill).
- No new UI; the button reuses the `sure?` arm display.
