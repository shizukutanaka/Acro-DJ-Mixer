# ADR-0422: auto-gain application is guarded by the load sequence like every other awaited write

## Status

Accepted (2026-11-03)

## Context

`load()` has a `live()` latch (`_loadSeq`) precisely so a stale
continuation can't write track A's state onto the deck now showing
track B — every awaited step checks it. One step didn't:

```js
mono = monoResample(buf);
this.applyAutoGain(await mono);          // writes gainEl + deckGain
this.tagLib({ gain: +this.gainEl.value });
if (!live()) return;                     // guard arrives one write too late
```

If a second load lands during the resample await, `applyAutoGain`
moves the visible gain slider (and the audible `deckGain`) to track
A's value while track B is loaded, and `tagLib` persists that stale
gain — possibly onto B's record.

`estimateBpm`/`estimateKey` already carry the same guard as a
`buf !== this.buffer` bail; auto-gain was the only awaited write in
`load()` that skipped it.

## Decision

Await into a local, check `live()`, then apply and tag. Same doctrine
as the analysis estimators and ADR-0421: a value used after an await
must be re-validated before it touches shared state.

## Consequences

- Rapid double-loads can no longer flash/persist the outgoing
  track's auto-gain onto the incoming track.
- Behaviour for the normal (unguarded-path) case is identical.
