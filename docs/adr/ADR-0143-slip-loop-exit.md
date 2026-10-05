# ADR-0143: Slip-aware loop exit

## Context
Slip mode (ADR-0060) applied only to hot-cue holds: with Slip on,
exiting a loop left the playhead mid-loop — the track had really
progressed past the loop's time window, but the deck pretended the
cycles counted. On CDJ hardware, SLIP treats every detained
manoeuvre the same: hot cues, rolls, *and* loops advance the virtual
playhead, so a loop-out lands wherever the track would have been.

## Decision
`toggleLoop` now records `_loopT`/`_loopEnterPos` when a loop arms
(both the beat-snapped and free-size paths). On exit, with `slip`
and `playing` true:

```js
const wouldBe = _loopEnterPos + (now - _loopT) * rate;
if (wouldBe outside [loopStart, loopEnd]) seekTo(wouldBe);
```

Inside the window no correction is needed — the in-loop position is
already the unlooped position. Rolls null the arm time: they own
their slip bookkeeping (`_roll`) and a stale `_loopT` would mis-seek.

## Consequences
- Loop exits under Slip land on the true timeline — one doctrine
  for every detained manoeuvre (cues, roll, loop).
- Slip off: unchanged, exit continues inside the loop.
- Loop re-arms refresh the stamps, so repeated in/out cycles track
  correctly; eject clears both fields.
