# ADR-0391: The centre reset owns the edge bookkeeping

## Context
`xfEdgeCheck` derives fader-start edges from `xfPrev` — the last
position the bookkeeping saw. Every writer of `xfader.value` must
rebase it (ADR-0358 introduced the check, ADR-0381/0382 closed the
auto-mix sweeps and the hamster rebase). The double-click centre
reset still wrote `xfader.value = 0.5` without the check: parked
deep past an edge (xfPrev 0.98), the reset left bookkeeping
believing the fader never left that side, so the next genuine sweep
back in was read as "already inside" and fader-start silently
didn't fire — the swallowed-edge direction of the stale-xfPrev
class (ADR-0381 covered the ghost-fire direction).

## Decision
The reset runs `xfEdgeCheck()` like the `0` key it duplicates:
centre trips neither edge, so it never fires — it only rebases
`xfPrev` to the truth.

## Consequences
Reset semantics unchanged for the mixer; the first real sweep after
a reset now edges exactly like after a `0` press.
