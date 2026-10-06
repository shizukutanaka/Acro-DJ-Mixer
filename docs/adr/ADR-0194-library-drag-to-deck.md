# ADR-0194: Drag a library row onto a deck

## Context
Loading a saved track meant clicking its `→A`/`→B` buttons — the
universal library gesture from rekordbox, Serato, Traktor and
every file player, "grab the row, drop it on the deck", was
missing even though the deck already had a dropzone.

## Decision
Rows get `draggable="true"`; `dragstart` on `#lib-rows` writes
`text/x-lib-id` into the DataTransfer and dims the row to .4
opacity until `dragend`. The deck drop handler reads the type
first: a library id calls `Library.loadInto` — the same path the
`→A`/`→B` buttons take, so saved cues/loop/grid/key all come
along — a real file drops through `load` as before. Both go
through the existing `armConfirm` load guard on a playing deck.

## Consequences
- One continuous gesture replaces aim-click on a 40 px button —
  and it's the gesture every DJ's muscle memory already has.
- No new load path: the drag lands in `loadInto`, so behaviour
  (prep restore, guard) can't drift from the buttons'.
