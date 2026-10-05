# ADR-0146: Harmonic next-track pick for continuous auto-mix

## Context
Continuous auto-mix loaded the next library row strictly in
updated_at order — the "radio" could land on a Camelot clash the
green `fit` highlight already knew about. The knowledge existed
(ADR-0011) but only for human eyes; the machine ignored it.

## Decision
`autoNext` walks the visible order from the playing row and takes
the first track that fits the deck still playing — the same
criteria as the row highlight: tempo inside `±tempoRange` of the
grid BPM and Camelot-harmonic against the deck's **effective** key
(detected key + transpose, +7 hours per semitone, same maths as
`renderKey`). Unkeyed or no-fit runs fall back to the plain
next-in-line row rather than stopping the set. Both the playing
track and the just-finished one are excluded so a wrap can't
instantly replay either.

## Consequences
- Untouched auto-mix stays musical: when a compatible neighbour
  exists it is picked before an incompatible one.
- Same fallback contract as before — no track is skipped outright;
  nothing refuses that used to play.
- Ordering is still the visible list order, so the DJ can predict
  which candidate the pick scans past.
