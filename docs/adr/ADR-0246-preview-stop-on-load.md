# ADR-0246: Loading a previewing track stops its cue audition

## Status
Accepted.

## Context
A row's ▶ audition rings on the headphone bus until it ends or is
re-clicked. Loading that same track into a deck left the audition
running — the same audio then arrived twice: once in the phones
still ringing, once heading for the floor. The audition's whole
purpose (is this the right track?) is answered the instant the DJ
commits to the load.

## Decision
`Library.loadInto` stops the preview when the loaded record is the
one auditioning (`previewId === id` → `previewSrc.stop()`, its
`onended` clears the globals). Auditioning track X while loading
track Y is still fine — only the same-track double is cut.

## Consequences
No phantom doubles between cue bus and deck. Previewing a
different row while loading is untouched.

## Round
Improvement round 246.
