# ADR-0297: Loading over a pad silences its ringing voices

## Context

Dropping a file onto an already-loaded sampler pad swapped the slot
underneath two things that could still be playing the old buffer:

- a fired voice (`slot.src`) — orphaned with no handle left to stop
  it, since alt-click stops only the *current* slot's src;
- a cue-bus audition (`smpPrev`) — the preview kept ringing its old
  sample even though the pad now holds a different one.

Same ghost class as clearing a pad (ADR-0250): state that must not
outlive its source.

## Decision

`loadSmpFile` stops the old `slot.src` and kills `smpPrev` when the
audition's buffer is the slot being replaced — identified by buffer
identity (`smpPrev.buffer === old.buf`), so an audition from a
*different* pad keeps ringing.

## Consequences

- Drop-overwrite and file-pick paths share the kill in one place;
  resample needs nothing (it only fires on an empty pad).
