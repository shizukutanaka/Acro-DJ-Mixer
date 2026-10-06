# ADR-0252: Session persistence covers phones volume and loop length

## Status
Accepted.

## Context
ADR-0158 persists the mixer surface across reloads — faders, EQ,
filters, FX, mic trims, cue mix — but two controls fell through:
**Phones volume** (`cuevol`) snapped back to 100 % on every
reload, and each deck's **loop-length select** (`loopbeats`)
returned to 4 b, silently re-arming a different loop size than
the DJ left.

## Decision
`cuevol` joins the shared id list (save + restore); `loopbeats`
joins the per-deck map. Restore goes through the real `change`
dispatcher like every other control, so whatever downstream
state hangs off the selector is rebuilt, not just the DOM value.
`loopbeats` is guarded (`!= null`) so sessions saved before this
patch restore cleanly.

## Consequences
Headphone level and the next loop's beat count survive reloads
with the rest of the surface. Missing keys in old session blobs
are skipped, not clobbered.

## Round
Improvement round 252.
