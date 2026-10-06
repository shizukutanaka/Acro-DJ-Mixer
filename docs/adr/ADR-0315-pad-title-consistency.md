# ADR-0315: Every pad title names the right-click preview

## Context

The canonical set path (and both empty-pad titles) advertises
"right-click previews", but three other title-writing paths — the
undo restore, the waveform drag-move, and the library-record
restore — wrote the older "click jumps, shift-click clears" text.
A restored or moved cue pad told the user it supported fewer
gestures than it did: the same doc-vs-behavior drift class as
ADR-0255/0256/0295.

## Decision

All three paths now write the canonical suffix ", right-click
previews" so every occupied pad advertises the same gesture set
regardless of how the cue got there.

## Consequences

- Pad tooltips are honest on every write path; the preview gesture
  is discoverable from any occupied pad.
