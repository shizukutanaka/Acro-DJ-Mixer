# ADR-0336: Eject-undo carries the stem mode

## Context

Stem mode (Full / Vocal / Inst) is track prep: `tagLib({ stem })`
writes it to the library record and `load()` restores `meta.stem`.
The eject-undo stash for file-loaded tracks captured every prep
field — cue point, hot cues, loop + memory slots, grid, key — except
stem. A file-loaded track ejected while split to Vocal came back on
Full when right-click-undo reloaded it; the same move on a library
track (which keeps its record) restored correctly.

## Decision

Add `stem: this.stemSel.value` to the `_ejected.meta` snapshot.
`load()` already reads `meta.stem`, so the fix is one field.

## Consequences

- File-loaded eject-undo now restores the same prep surface a
  library-loaded undo does.
