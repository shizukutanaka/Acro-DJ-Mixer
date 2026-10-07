# ADR-0384: Slip dead-reckoning stamps the entry-time effective rate

## Context
All three slip mechanisms — held hot-cue slips, loop rolls, and
slip-aware loop exit — dead-reckon the "true timeline" as
`enterPos + elapsed * this.rate`, using the base tempo alone.
`pos()` however moves at `rate * bendMul * spinMul`: a bend held
through a slip made the ghost timeline lag by up to ±5 % of the
elapsed time, so slip exit landed audibly late (or early under
spin). The ghost marker drew from the same wrong clock.

## Decision
Each slip entry stamps the effective rate in force at entry:
`_slip.rate`/`_roll.rate` carry `rate * bendMul * spinMul`, and
loop arms stamp `_loopEnterRate` beside `_loopEnterPos` (cleared
wherever `_loopT` is nulled). All three dead-reckons multiply by
the stamped rate, so a bend that was already riding when the slip
began is priced into the ghost.

## Consequences
Approximation by construction: multipliers that change *during*
the slip still drift by `elapsed * Δmul` — a real but much
smaller error than the previous unconditional one, and matching
the model's dead-reckoned ghost semantics.
