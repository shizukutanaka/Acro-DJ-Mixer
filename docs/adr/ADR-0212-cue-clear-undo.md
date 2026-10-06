# ADR-0212: One-level undo for cleared hot cues

## Context
`Shift`+pad click deletes a hot cue instantly and permanently —
the audit flagged every destructive gesture as having no undo,
and cue-clear is the easiest one to fat-finger: it shares the
pad with the jump gesture you're aiming for.

## Decision
`clearPad` stashes `{i, t}` in `this._lastClear`. Right-click on
an EMPTY pad — where the preview idiom has nothing to preview —
restores the cue to its original pad (class, title, `tagLib`,
redraw), then the slot is consumed so it's a one-level undo, not
a clipboard.

## Consequences
- The cheapest destructive gesture on the surface is now
  recoverable in one click.
- Scope stays honest: one level only — deeper undo needs a
  history model this single file doesn't have yet.
