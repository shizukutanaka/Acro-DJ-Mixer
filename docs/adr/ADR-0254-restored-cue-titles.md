# ADR-0254: Restored hot cues carry their time in the pad title

## Status
Accepted.

## Context
Hot cues persist on the library record, and on load each occupied
pad got its `.set` styling back — but not its title. A pad set in
a previous session styled as filled while still advertising
"click sets a marker" on hover; only cues set during the live
session earned the `Hot cue M:SS` title (ADR-0253 set the same
contract for the deck cue button).

## Decision
The meta-restore loop in `load()` now writes the stored time into
the pad title alongside the `.set` class, using the exact string
`padCue` writes on a live set. Occupied pads keep their
descriptive title across every restore path.

## Consequences
Hovering a restored pad reads its saved time before firing — the
title contract no longer depends on which session set the cue.
Only pads with a cue are touched; empty pads keep the generic
hint.

## Round
Improvement round 254.
