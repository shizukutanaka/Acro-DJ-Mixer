# ADR-0186: Drop a file straight onto a sampler pad

## Context
Loading a one-shot meant click → file picker, then the decoded
buffer landed via the global `smpPending` slot index — the only
surface in the app without drag-and-drop, while decks accept drops
on their dropzones.

## Decision
Pads take `dragover`/`dragleave`/`drop` like the deck dropzone
(accent `.drag` highlight while hovering). The drop calls a shared
`loadSmpFile(i, file)` — the same decode-and-slot path the picker
uses, extracted so both gestures share one implementation. A drop
on a loaded pad replaces the slot directly (drop = explicit
replace, vs. click = fire); `smpPending` is untouched because the
gesture itself pins the destination.

## Consequences
- Dragging a kick onto pad 1 and a snare onto pad 3 is a two-drop
  setup instead of two picker round-trips.
- The picker's pending-index race window stays exactly as before —
  drops never touch it.
