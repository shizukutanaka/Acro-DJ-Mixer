# ADR-0088: Screen wake lock while any deck plays

## Status
Accepted (2026-10-04)

## Context
A laptop falling asleep mid-set is the worst failure mode a DJ app
can have — nothing in the UI or audio chain prevents the OS from
suspending during a long unattended stretch (and continuous auto-mix
is built for exactly that).

## Decision
`wakeSync()` runs inside `tick()`: when any deck is `playing` it
requests `navigator.wakeLock.request('screen')` once; when nothing
plays it releases. On `visibilitychange → visible` the (auto-released)
lock is reclaimed — the OS drops it when the tab hides.

## Consequences
- No user control needed — the lock tracks the only state that
  matters ("is something playing").
- Guarded by `navigator.wakeLock` existence: http(s)-only API,
  file:// just no-ops.
