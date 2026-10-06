# ADR-0195: Emergency loop — never dead air at track end

## Context
A track that ran out while still fadered up simply stopped — dead
air on the floor. rekordbox/CDJ solve this with EMERGENCY LOOP:
near the end, the deck loops its tail until the DJ deals with it.

## Decision
In the per-frame `tick`, a playing deck with a grid and no armed
loop that crosses into its final 4 beats (`_endAt`-aware) auto-
arms `loopStart = dEnd − 4 beats, loopEnd = dEnd`, `loopOn`, then
`applyLoop()` — the same path as a manual Loop press, so the
button shows "Loop 4.0b" and Loop toggles off to exit. Only when
a grid exists: the beat length is needed to size the loop, and a
gridless track still stops at its end as before.

## Consequences
- Dead air becomes a held groove — worst case a 4-beat tail loop
  instead of silence while the DJ finds the next track.
- Latent fix: the track-end stop check now skips `loopOn` decks —
  any loop ending within 20 ms of the track end could previously
  trip the stop and kill playback mid-loop.
- Auto-mix unaffected: its fade completes before the tail window.
