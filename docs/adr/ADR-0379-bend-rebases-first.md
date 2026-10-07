# ADR-0379: Bend changes rebase before the multiplier swaps

## Context
`pos()` models position as `offset + (now - startedAt) * rate *
bendMul * spinMul` — the whole span runs at one multiplier. Every
bend path mutated `bendMul` and *then* called `setRate`, whose
rebase computed `offset = pos()` with the NEW multiplier over a
span that had actually run at the OLD one. The error is
`elapsed * rate * Δmul`: hold a ±5% bend for 20 s and release and
the position clock jumps ~1 s — waveform playhead, beat counter,
auto-mix trigger and slip exits all drift with it. `_spin` already
rebased first; bend was the inconsistent sibling.

## Decision
`_setBendMul(mul)` is the single entry: rebase `offset`/`startedAt`
under the old multiplier, store the new one, then tell the engine.
All five bend writers (button hold/release, jog tick, jog end,
drag-jog, MIDI wheel) route through it — same "shared writer owns
the bookkeeping" contract as `_faderIn` (ADR-0378) and `xfGainFor`
(ADR-0377).

## Consequences
The position model stays continuous across any bend gesture; a new
bend writer can't reintroduce the skew by calling `setRate` after
mutating.
