# ADR-0245: Status messages clear themselves after 5 seconds

## Status
Accepted.

## Context
`status()` wrote a message that stayed until the next message
arrived — minutes later, "cue set 0:12" or "tap out of range"
still sat on the deck reading like live state. Status exists to
confirm an action that just happened; a confirmation that never
leaves becomes noise, then misinformation (audit: silent-success /
stale-signal gaps).

## Decision
`status()` clears itself after 5 s (`clearTimeout` + re-arm per
call, so only the last message's timer ever fires; an empty
message clears immediately with no timer). Per-deck field, so the
two status lines expire independently.

## Consequences
The status line goes back to meaning "what just happened", and
glancing at it mid-set never surfaces a decision made minutes ago.
Anything meant to persist already has a persistent home — button
`on` classes, readouts, pad labels — not the status line.

## Round
Improvement round 245.
