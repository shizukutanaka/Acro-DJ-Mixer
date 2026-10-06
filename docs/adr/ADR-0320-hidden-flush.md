# ADR-0320: Session snapshot flushes on visibility hidden

## Context

ADR-0318 added a `pagehide` flush for the session snapshot — but on
mobile a suspended tab can be killed by the OS *without* `pagehide`
ever firing. On those platforms `visibilitychange` → `hidden` is the
last notification the page receives.

## Decision

Inside the existing `visibilitychange` handler, when the state is
`hidden`, cancel the pending 400 ms debounce and run `sessSave()`
synchronously. Sits beside the existing wake-lock / ctx-resume
branches; the `visible` path is untouched.

## Consequences

- The last-known mixer surface survives tab suspend-and-kill on
  mobile, not just deliberate closes.
- Covers browsers that skip `pagehide` entirely (older iOS Safari,
  some Android WebViews).
