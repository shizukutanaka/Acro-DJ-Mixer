# ADR-0340: bgScan writes through _mutate and marks decode failures

## Context

The background analysis sweep (ADR-0243, hardened in ADR-0330) had two
remaining defects:

- **Un-serialized record write**: the get → mutate → `put` ran outside
  `Library._mutate`. Analysis takes seconds; a `tag` landing mid-
  analysis (the DJ writes a cue on the same track's deck) would be
  clobbered by the sweep's stale snapshot put — ADR-0267's class,
  same fix already applied to `addFromFile`/`gc`/`padSave`.
- **Decode failures weren't marked**: ADR-0330 marked "nothing found"
  so an un-analyzable track isn't re-scanned forever, but a blob that
  fails to decode skipped the record entirely — the sweep re-decoded
  the same bad bytes every 45 s forever. "Can't decode" is the same
  kind of answer.

## Decision

- The success path's `get`+`put` runs inside `_mutate`, joining every
  other writer on the `_wr` chain; `renderLibrary` still paints once
  per sweep via a `wrote` flag.
- The per-track catch marks `_scanned` on the record (inside
  `_mutate`) so un-decodable or un-analyzable blobs are walked once.
  Store failures inside `_mutate` just log — the record stays
  un-scanned and the next sweep retries.

## Consequences

- Analysis writes can no longer overwrite prep written mid-sweep.
- A corrupted file costs one decode attempt, not one per sweep.
