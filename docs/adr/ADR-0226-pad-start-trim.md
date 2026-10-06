# ADR-0226: Shift+wheel trims a sampler pad's start offset

## Context
Pads always fired from the buffer head — lead-in silence or a
pickup before the hit couldn't be trimmed, so one-shots fired
late unless you'd pre-cut the file elsewhere.

## Decision
`slot.start` (seconds) is set by shift+wheel on the pad in
0.05 s steps, clamped to [0, duration−0.05]; both the master
voice and the cue-bus preview start from it. New slots default
to 0. The title reports the offset like the level readout.

## Consequences
- One-shots can be tightened on the floor without pre-editing.
