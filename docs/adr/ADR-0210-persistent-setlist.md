# ADR-0210: The setlist survives a reload

## Context
ADR-0158 persisted the mixer surface across reloads, but
`setLog` — every track actually played, in order — still died
with the session. A crashed tab or an accidental reload lost
the whole night's history; the audit flagged it as a data-loss
path.

## Decision
`setLog` persists to `localStorage['acro-setlog']` via
`setLogPush`, restoring on boot with `at` revived to `Date`
objects and capped at 2000 entries so a month of sessions can't
grow it without bound. Storage failures are non-fatal — a full
quota degrades to the old session-only behavior, not a broken
app.

## Consequences
- The Setlist download now covers the whole run of the app, not
  just since last reload — matches what ADR-0158 already taught
  the user to expect from the surface.
