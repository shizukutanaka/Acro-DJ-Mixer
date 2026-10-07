# ADR-0390: Dead-reckoning freezes on pause

## Context
Slip bookkeeping (`_slip`, `_roll`, `_loopT`/`_loopEnterPos`)
dead-reckons the true timeline as `anchor + (now - t) * rate` —
assuming the deck plays uninterrupted for the whole hold. Pausing
inside a hold (Play button, transport key, MIDI note — all reachable
while a pad is held) froze the deck but not the reckoning: the
release/exit then landed pause-length ahead of the true timeline,
the same "position model vs wall clock" drift ADR-0384 fixed for
multipliers.

## Decision
Reckoning follows `pos()`'s clock — it only advances while the deck
plays. `stopPlayback()` (the single choke point for pause/cue/seekTo)
folds elapsed time into each anchor and parks its clock (`t = null`);
`play()` unfolds it. Releases while stopped snap `offset` to the
frozen anchor instead of skipping the landing. Ghost markers show
the frozen anchor during a parked hold. `.rate`-stamped variants
from ADR-0384 are read when present (`s.rate || this.rate`,
`_loopEnterRate || this.rate`) so both orderings merge cleanly.

## Consequences
Cue()/seekTo() pause-replay sequences fold+unfold for net zero. The
brake spin-down still reckons at flat rate during the ramp — the
documented multiplier approximation, unchanged.
