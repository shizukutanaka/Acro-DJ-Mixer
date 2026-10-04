# ADR-0093: Setlist — log and export every track played

## Status
Accepted (2026-10-04)

## Context
DJs archive setlists — what was played, in what order. The app
already knows exactly when a track starts (first `play()` after
load) and its file name, but the information evaporated.

## Decision
`setLog` (session-scoped) appends `{ name, deck, at }` on the first
play after each load; pause/resume doesn't re-log. A `Setlist`
button on the library row downloads `NN. HH:MM name` lines as a
dated .txt.

## Consequences
- Zero persistence: the log is a session artifact, cleared on
  reload — matches how a real setlist ends when the booth closes.
- Works for manual plays, auto-mix transitions and auto-loaded
  tracks alike, since they all flow through `play()`.
