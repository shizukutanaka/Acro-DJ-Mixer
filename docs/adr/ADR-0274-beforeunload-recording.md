# ADR-0274: Closing mid-take asks first

## Status
Accepted.

## Context
An in-flight recording is the only state a reload can't bring back —
its chunks live in `recChunks` until `onstop` fires; close the tab and
the take is gone silently. Every other surface state persists
(session restore, library, setlist), so decks deliberately get no
close guard.

## Decision
A `beforeunload` listener calls `preventDefault()` only while
`recorder.state === 'recording'` — the browser shows its standard
leave confirmation exactly when real data would be lost.

## Consequences
No accidental take loss from a stray ⌘W; idle and playing states
close freely as before.

## Round
Improvement round 275.
