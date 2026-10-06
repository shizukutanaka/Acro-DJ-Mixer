# ADR-0330: bgScan marks empty analyses and survives a dead library

## Context

Two failure modes in the background BPM/key sweep:

1. `Library.all()` was the only expression outside a try — a
   transient IndexedDB failure propagated out of `bgScan` into the
   `setTimeout`/`setInterval` caller as an unhandled rejection,
   while every other library read surfaces once via `Library.fail()`.
2. `analyzeTrack` always resolves, but a track whose analysis finds
   nothing (`{bpm: null, key: null}` — ambience, speech, silence)
   wrote nothing back. The pick filter `typeof bpm !== 'number' ||
   !key` kept matching it, so the same blob re-decoded every 45 s
   forever — a real CPU cost on a large crate.

## Decision

- Wrap the whole sweep body so a failure routes to `Library.fail()`
  (the surface-once doctrine) instead of rejecting into a timer.
- Stamp `rec._scanned = true` on every analyzed record — "nothing
  found" is an answer too — and add `!t._scanned` to the pick
  filter. Records already carrying bpm/key are excluded by the
  existing clause either way, so no backfill is needed.

## Consequences

- The sweep is idempotent per track: one decode, one write, done.
- A dead library degrades to the same single status warning as
  every other read path.
