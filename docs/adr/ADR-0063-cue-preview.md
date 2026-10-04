# ADR-0063: Cue preview — hold Cue to audition while stopped

## Status
Accepted (2026-10-04)

## Context
`Cue` was seek-only — hearing the cue point meant pressing Play and
hoping you pressed it on the one. Every CDJ since forever lets you
*hold* Cue to audition from the cue point while the deck is stopped;
release snaps back.

## Decision
`pointerdown` on the Cue button (while `!playing && buffer`) sets
`_cuePreview`, calls `cue()` then `play()` — audio starts exactly at
the cue point, not wherever the playhead happened to be.
`pointerup/leave/cancel` clears the flag, `pause()`s, and `cue()`s
back. While playing, the press behaves as before (seek to cue); the
trailing `click` after a preview release seeks an already-cued deck —
idempotent.

## Consequences
- Auditioning a cue is a single hold — pairs with the headphones bus
  (ADR-0007) for the standard cue-check workflow.
- State is a transient flag; nothing to persist.
