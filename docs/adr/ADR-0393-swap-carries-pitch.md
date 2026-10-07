# ADR-0393: Deck swap carries the pitch too

## Context
`swapWith` snapshots position, tempo, play state, cues, loops, loop
memory, stem, grid and key — everything about what the deck is
*doing* — but not `st`. A deck transposed +5 st traded to the
partner came back at ±0: the semitone state is deck-level (it
survives track loads), so the two reloads never touched it, and the
audible pitch the DJ actually set silently reset on swap. Same
"snapshot claims full state" class as the loop-memory/stem fields
ADR-0343 added.

## Decision
`st` joins the snapshot; the apply loop calls `transpose(s.st - d.st)`
when the values differ. `transpose()` already refuses the fallback
engine with an honest status, and the delta form clamps the same
±6 range the buttons use.

## Consequences
A swapped transposed track keeps its pitch on the new side;
effKey/readouts follow via transpose()'s own refresh. Channel-surface
controls (EQ, filter, assign, brake, slip) still stay with the
channel, as before.
