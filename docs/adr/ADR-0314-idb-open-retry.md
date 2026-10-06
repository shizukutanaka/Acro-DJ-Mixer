# ADR-0314: IndexedDB open failures retry, read paths surface once

## Context

`Library._open()` cached its promise unconditionally — a single
transient `indexedDB.open` rejection (blocked DB, version race,
private-mode denial) stayed cached forever and every later
`_store()` call re-threw it. The library bricked for the whole
session. Worse, the read paths were silent: `renderLibrary` caught
and returned, `loadInto`/`previewTrack`/`gc` threw unhandled
rejections — the UI gave no hint that prep persistence was dead.

## Decision

Two parts:

1. A failed open clears `this._db` (only if it's still that same
   promise) so the next call retries instead of replaying the same
   rejection.
2. `Library.fail()` posts one status-line warning per session —
   "library unavailable — prep won't persist" — and every read
   path (`renderLibrary`, `previewTrack`, `loadInto`, the boot
   `gc()`) routes its failure there instead of swallowing or
   leaking an unhandled rejection.

## Consequences

- Transient IDB failures self-heal on the next attempt.
- Persistent failures announce themselves once instead of failing
  silently or noisily per-call.
