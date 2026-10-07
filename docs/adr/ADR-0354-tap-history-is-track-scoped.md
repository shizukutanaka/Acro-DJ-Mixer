# ADR-0354: Tap history is track-scoped

## Context
`tapTempo` keeps a `this._taps` ring of `{ms, pos}` per deck — the
median inter-tap interval becomes bpm, the last tap's position
becomes beatOff. Like every other track-scoped bookkeeping
(`_slip`, `_roll`, `_slice`, `_prevGrid`, loop memory), the history
belonged to the track it was tapped on — but `load()`/`eject()`
never cleared it.

A tap within the 2 s inter-tap window after a track swap paired the
old track's last tap with the new one: the median interval described
neither track, and the write landed a bogus bpm/beatOff on the new
track's record.

## Decision
`this._taps = null` in `load()` and `eject()`, beside the other
per-track bookkeeping resets. The 2 s staleness rule still handles
intra-track gaps.

## Consequences
The first tap after a load or eject is always a fresh history — no
cross-track pairing can write a phantom tempo.
