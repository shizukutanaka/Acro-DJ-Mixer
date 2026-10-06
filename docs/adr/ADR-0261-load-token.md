# ADR-0261: Concurrent deck loads can't interleave

## Status
Accepted.

## Context
`deck.load` awaits three times before assigning `this.buffer`
(arrayBuffer → decode → ensureNodes) and once more at the mono
downmix. Two rapid loads — row double-click plus a ‹ › step, or
a drop landing on top of a library load — interleaved freely:
whichever decode finished *last* won the deck, so the dropzone
could show file B's name over file A's buffer, grid and state.

## Decision
A per-deck sequence counter. `load()` takes `this._loadSeq++` and
re-checks it after every await; a stale continuation returns
before touching the graph. Same discipline as the cue-bus
preview token (ADR-0260): last caller wins, always.

## Consequences
Deck name, buffer, grid and gain can no longer disagree after a
load race. Single loads are unaffected.

## Round
Improvement round 261.
