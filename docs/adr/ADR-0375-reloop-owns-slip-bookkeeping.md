# ADR-0375: Reloop owns its slip bookkeeping

## Context
Slip mode exits a loop by dead-reckoning where the track would have
been: `wouldBe = _loopEnterPos + (now - _loopT) * rate`. Every
arming path sets `_loopT`/`_loopEnterPos` on entry — except
`reloop()`. After a normal loop arm→exit, `_loopT` kept its stale
value; a later Slip-mode reloop→exit dead-reckoned from the
*previous* loop's entry, so `wouldBe` landed far outside the new
region and `seekTo(min(wouldBe, duration))` teleported the deck to
the track's end.

## Decision
`reloop()` stamps `_loopT = ctx.currentTime` and
`_loopEnterPos = pos()` on entry — identical to the two arming
branches of `toggleLoop`. The doctrine: anything that sets
`loopOn = true` owns the slip-entry bookkeeping.

## Consequences
Slip exits after a reloop land on the true timeline; no stale
arm-time can leak a seek across the track.
