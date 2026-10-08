# ADR-0403: One jog gesture — no timer re-entry

## Status
Accepted

## Context
Shift+drag on the waveform while playing starts the jog bend: an
interval eases `bendMul` every 40 ms, `jogEnd` clears it and resets
the multiplier. `pointerdown` fires per touch point — a second
finger landing on the waveform mid-jog re-entered the branch,
re-set `jog = true`, and **overwrote `this._jogTimer` with a new
interval while the first kept running**. `jogEnd` only clears the
referenced timer, so the leaked interval eased `bendMul` toward 1
every 40 ms forever — CPU churn and constant position-clock rebasing
that never stops.

Every other drag latch in the same handler is an idempotent flag
(`scrubbing`, `cueInDrag`, `loopDrag`, `cueDrag`) — re-entry is a
no-op. The jog is the only gesture that allocates a resource, so
it's the only one that needed an explicit re-entry guard.

## Decision
`if (jog) return;` at the top of the jog branch — the gesture
belongs to the first finger until pointerup/cancel, matching the
one-gesture-at-a-time doctrine used everywhere else (`_slice`,
`_slip`, `_roll`).

## Consequences
- Second `pointerdown` during a live jog is ignored — the original
  interval keeps its reference and `jogEnd` clears exactly the
  timer it started.
- No behavior change for the single-finger path.
