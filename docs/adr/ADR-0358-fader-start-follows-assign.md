# ADR-0358: Fader start follows channel assign, on every drive path

## Context
Two gaps in CDJ FADER START:

1. The edge checks were hard-bound to decks (`deckA` on the left
   edge, `deckB` on the right), ignoring CH ASSIGN. Assigning deck A
   to the B side left its fader-start dead — the comment claimed
   "a deck assigned to that side hears the edge" but the code bound
   sides to decks.
2. The detector lived inside the `input` listener, so programmatic
   sweeps — arrow keys and MIDI CC 1 — moved the fader to the edge
   without firing. A driven fader behaved differently from a dragged
   one.

## Decision
`xfEdgeCheck()`: iterates both decks, fires the one whose ASSIGN
side matches the edge crossed (Thru still bypasses), then called
from the input listener AND every programmatic sweep site
(ArrowLeft/Right, the '0' centre key, MIDI CC 1). Both decks on the
same side both start — same as shared-side channels on hardware.

## Consequences
Assign either deck to either side and its fader-start works; arrow
keys and controllers trigger it the same as a mouse drag.
