# ADR-0404: Track-end warning keys off the effective end

## Status
Accepted

## Context
`tick` flashed the time readout `urgent` in the last 30 s measured
from `buffer.duration` — the container end. Its two neighbors in
the same block both measure from `d._endAt` (the last non-silent
sample): the auto-mix countdown arms off the effective end
(ADR-0171) and the emergency loop saves the deck at the effective
end. A track decoded with a long silent tail would flash "bring the
next track in" 30 s before the *container* ran out — potentially
well after the music had already ended, when the warning could no
longer change anything.

## Decision
`remEnd = (d._endAt || d.buffer.duration) - pos()` feeds the
`urgent` toggle. The remaining-time readout itself stays
container-based — the displayed countdown is literal remaining file
time, matching CDJ behavior.

## Consequences
- Warning now fires 30 s before the musical ending, consistent with
  auto-mix's fade point and the emergency loop boundary.
- Past `_endAt` (inside the silent tail) `remEnd < 0` → flash off;
  the emergency loop already covers that window.
- Tracks without a detected tail (`_endAt` unset) behave exactly
  as before.
