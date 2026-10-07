# ADR-0370: An in-flight BPM edit belongs to its track

## Context
While the BPM editor was open, `load()`/`eject()` overwrote
`bpmEl.textContent`, removing the input — the removal fired `blur`,
`done(true)` committed the half-typed value onto the *new* track,
wrote it to that track's library record, and recorded it in
`_prevGrid`. A load mid-typing silently stamped an unconfirmed BPM
onto a different song.

## Decision
- `load()` and `eject()` reset `this._bpmEdit = false` in their
  abandonment blocks, before any `bpmEl` overwrite.
- `done()` returns early when `_bpmEdit` is false, so the removal
  blur becomes a no-op — abandoning an edit is the Escape path, not
  a commit.

## Consequences
A typed-but-unconfirmed BPM can never land on another track; the
editor re-opens cleanly afterwards.
