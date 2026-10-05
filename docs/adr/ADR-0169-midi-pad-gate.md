# ADR-0169: MIDI pad gate

## Context
MIDI note-offs were ignored, so a hardware pad could only trigger —
holding it couldn't gate the shot, which is what fingers on real
pads do. The app already owns this grammar everywhere: tap = latch,
hold ≥250 ms = momentary (ADR-0117/0149).

## Decision
Note-ons timestamp `midiNoteT`; a note-off on sampler notes 36–39
stops the voice only when the note was held ≥250 ms — a quick tap's
off arrives under that bound and the one-shot keeps ringing. Both
real note-off (0x80) and running-status on+vel0 count as off.

## Consequences
- Hardware pads behave like the mouse pads: tap fires the full
  shot, hold rings only while held.
- One timestamp map, no new UI; non-pad notes ignore their offs.
