# ADR-0387: One writer, one readout

## Context
`effEl` (the `→N.N` effective-BPM hint) was refreshed only in
`setRate` and `estimateBpm`. Four other paths mutate `grid.bpm` —
manual BPM commit, tap tempo, the grid-undo, and a library load with
cached `meta.bpm` — and `load()` never cleared the element, so a
track swap at rate≠1 left the PREVIOUS track's effective BPM on
screen until the tempo slider happened to move. The same "the last
writer owns the readout" defect class as ADR-0377/0378/0379, on the
display side.

## Decision
`_effBpm()` computes `effEl` from `this.grid` and `this.rate` and
is called by every site that mutates `grid.bpm` plus `setRate`,
`load()`, and `estimateBpm`. The readout belongs to the current
grid, not to whichever writer last touched the element. `nudgeGrid`
only shifts `beatOff`, so it does not refresh (bpm unchanged).

## Consequences
At rate≠1 the hint now tracks manual edits, taps, undos, and
cached-meta loads, and a fresh load clears it instead of showing
the old track's number.
