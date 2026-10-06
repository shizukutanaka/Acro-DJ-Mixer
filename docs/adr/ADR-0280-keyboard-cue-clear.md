# ADR-0280: Shift + pad key clears a hot cue

## Status
Accepted.

## Context
The keyboard map could only *use* hot cues: a pad key fires
`padCue(i)` — jump to a set cue, or record one on an empty pad — but
there was no way to *remove* a cue without reaching for the mouse
(shift-click or right-click). Keyboard-only operation stranded set
cues on the deck.

## Decision
Pad keys now mirror the pointer grammar: `shift` + pad key calls
`clearPad(i)` instead of `padCue(i)` — letters already arrive
upper-cased under shift so `case 'Z'` covers it; deck B's `,` key
becomes `<` under shift on US layouts, so `case '<'` clears pad 4.
The help overlay's Keys line names the cue rows and the shift-clear.

## Consequences
Every hot-cue gesture reachable by mouse is now reachable by
keyboard; the key map is symmetric with the pad tooltips
("shift-click clears").

## Round
Improvement round 282.
