# ADR-0251: Arrow keys don't double-drive a focused range and the faders

## Status
Accepted.

## Context
The keymap guards text inputs and selects so typing doesn't fire
deck hotkeys — but `input[type=range]` slipped through. A range
keeps focus after being clicked, so the next ArrowLeft/Right/
Up/Down adjusted *two* things at once: the focused slider
(natively) and the crossfader or master (the document handler).
Riding a tempo slider then tapping ← meant the fader twitched
too — an invisible double-adjust.

## Decision
Extend the input guard: when the event target is a focused
`input[type=range]`, arrow keys are left to the control itself —
the global fader handlers don't see them. Letters, digits and the
rest of the map still fire globally while a slider is focused
(pads and play aren't arrow-shaped, and DJ hotkeys staying live
between slider touches is the point).

## Consequences
Arrows adjust exactly one thing: the last-touched slider, or the
crossfader/master when nothing is focused. No more silent
double-moves.

## Round
Improvement round 251.
