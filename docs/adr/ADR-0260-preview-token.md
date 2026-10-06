# ADR-0260: Rapid row previews can't layer on the cue bus

## Status
Accepted.

## Context
`previewTrack` stops the previous source only if `previewSrc` is
already assigned — but the assignment happens *after* an awaited
decode. Two quick row clicks meant: A's call saw `previewSrc`
null, B's call also saw null (A still decoding), both decoded,
both started — two sources on the cue bus at once until the
shorter one ended.

## Decision
A monotonically increasing `previewToken`. Every call takes
`++previewToken` and re-checks it after each await (record fetch
and decode); a stale token bails before touching the graph. The
latest call always wins, and toggling off also invalidates an
in-flight decode.

## Consequences
One audition at a time on the cue bus, guaranteed regardless of
decode timing. No change to single-click or toggle behaviour.

## Round
Improvement round 260.
