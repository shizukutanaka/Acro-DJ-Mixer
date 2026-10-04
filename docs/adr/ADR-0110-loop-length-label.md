# ADR-0110: Armed loop length on the Loop button

## Status
Accepted (2026-10-04)

## Context
An armed loop lit the button and shaded the waveform, but its
length wasn't readable without looking at the waveform and
counting grid ticks — and after `½`/`2×` edits the loopbeats
select no longer describes it.

## Decision
`applyLoop()` — the choke point every loop-state change already
flows through — writes the length into the button: beats on a
grid (`Loop 4.0b`), seconds without (`Loop 3.5s`), back to `Loop`
when off. Eject resets the label explicitly.

## Consequences
- The loop size is glanceable in the control row.
- Roll flashes its momentary length while held — honest feedback.
