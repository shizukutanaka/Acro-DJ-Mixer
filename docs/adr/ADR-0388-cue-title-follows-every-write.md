# ADR-0388: The Cue title follows every write

## Context
`_cueTitle()` names where Cue lands (`· cue at N:NN`), but only
three of five `cueIn` writers refreshed it — shift+Cue, the
right-click undo, and load/eject. The waveform right-click drop and
the cue-tick drag wrote `cueIn` without updating the title, so the
tooltip named a landing that no longer existed — the same
"writer owns its readout" class as ADR-0387.

## Decision
Both paths now call `_cueTitle()`: the right-click drop right after
`tagLib`, and the cueInDrag release at `pointerup`/`pointercancel`
(once on commit, not per-frame — the marker itself already shows
the live position during the drag).

## Consequences
All five cue-point writes keep the tooltip honest. Adjacent finding,
noted but not changed: the right-click drop writes `cueIn` raw while
the drag quantizes it under Qtz — likely should share the drag's
snap contract (evaluate separately).
