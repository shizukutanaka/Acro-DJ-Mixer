# ADR-0138: Beat-synced flanger — the LFO follows the fxBeat division

## Context
The flanger's sweep LFO ran at a fixed 0.4 Hz — a period with no
musical meaning, so the comb drifted arbitrarily against the grid
like a stompbox, not a beat effect. Echo already snaps its delay
time to the `fxBeat` division (ADR-0094) and Trans chops on the beat
(ADR-0097); the flanger was the odd one out.

## Decision
`_syncDelay` — already the single place every beat-derived parameter
re-syncs when grid, tempo, or fxBeat changes — now also drives the
flanger LFO:

```js
flLfo.frequency = 1 / (div * 4 * beat)
```

One sweep cycle spans `div*4` beats (one bar at BEAT=1): 2 Hz shimmer
at ¼ down to a 0.5 Hz slow breathe at 1, tracking the deck's current
effective tempo (`rate` included).

## Consequences
- All three beat-class effects (echo, trans, flange) now lock to the
  grid through the same division select.
- The sweep automatically rides tempo changes — setRate calls
  _syncDelay like every other beat parameter.
- Free-running behaviour is gone, but a DJ flanger that ignores the
  grid was never musically right; the fixed Hz was the bug.
