# ADR-0248: Deleting a track stops its cue audition

## Status
Accepted.

## Context
Row ▶ auditions ring on the cue bus until they end. Deleting that
row removed it from the crate but left the audition playing — a
ghost of a track the DJ just decided doesn't belong, still
occupying the headphone bus (same leftover-source class as
ADR-0246's load-during-preview).

## Decision
`Library.remove` stops the preview when the deleted record is the
one auditioning (`previewId === id` → `previewSrc.stop()`, its
`onended` clears the globals) before soft-deleting the row.

## Consequences
The cue bus only ever carries tracks that still exist in the
crate. Deleting a different row while auditioning is untouched.

## Round
Improvement round 248.
