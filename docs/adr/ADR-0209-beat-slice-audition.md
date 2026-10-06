# ADR-0209: Alt+pad auditions a beat slice

## Context
The audit's biggest missing modern-DJ feature was a beat slicer.
Pads already meant hot cues; the free modifier was Alt. A full
slicer mode (remap all pads, latch logic, quantization of
segments) is a big feature — but the playable core of slicing is
small: gate-play one beat of the grid.

## Decision
Alt+hold on hot-cue pad i gate-plays the i-th beat measured from
`cueIn` (grid beatOff when no cue): hold plays the slice,
release snaps back to the saved position and restores whether
the deck was playing — the same audition idiom as hold-Cue
(ADR-0063) and slip. Alt suppresses the normal click cue-jump,
and alt-hold doesn't arm slip.

## Consequences
- Slicing is playable today: 8 pads = 8 consecutive beats of the
  grid under your fingers, non-destructively.
- A future full slicer mode can reuse the same slice math; the
  audition gesture stands on its own.
