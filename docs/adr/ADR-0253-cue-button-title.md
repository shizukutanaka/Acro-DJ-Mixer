# ADR-0253: The Cue button's tooltip shows where Cue lands

## Status
Accepted.

## Context
Shift+Cue and auto-cue both move the cue-in point away from 0 —
but the only readout of where the button will actually land is a
transient status line and a cyan waveform tick. Hot-cue pads
already carry their stored time in the pad title; the deck's own
cue point, arguably the more important one, carried nothing.

## Decision
A `_cueTitle()` helper keeps the Cue button's tooltip in sync:
the base hint text plus `· cue at M:SS`. It is called once at
bind, after every cue-in mutation (shift+click set, auto-cue /
metadata restore on load), and on eject reset — the same three
places `cueIn` is assigned.

## Consequences
Hovering Cue tells the DJ where it will drop the playhead before
they commit — same discoverability contract the hot-cue pads
already keep. The title updates only at mutation points, so no
per-frame work.

## Round
Improvement round 253.
