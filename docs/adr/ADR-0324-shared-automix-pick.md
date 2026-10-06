# ADR-0324: One pick logic feeds the loader and the up-next marker

## Context

The amber `upnext` edge on a library row is a promise: "this is the
track auto-mix will load next." But it was computed by a *second,
simpler* loop in `renderLibrary` that ignored the played-last-resort
rule. If a played track fit before a fresh one, the marker lit the
played row while the loader skipped it — a UI that lies about what
the autopilot will do.

## Decision

Extract the pick into `autoMixPick(rows, playing, vacatedId)` —
unplayed harmonic fit → first unplayed → played fit → any played —
and call it from both the auto-mix loader and `renderLibrary`'s
marker. One loop, one truth; the marker can't drift again.

## Consequences

- The amber edge always names the row auto-mix will actually load.
- Any future change to pick policy (weighting, exclusions) updates
  both consumers at once.
