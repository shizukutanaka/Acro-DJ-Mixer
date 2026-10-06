# ADR-0299: Eject undo covers file-loaded tracks

## Context

Right-click on an empty dropzone undoes the last eject — but only
for library tracks: the stash was just `libId`, so a track dropped
straight onto the deck as a file was unrecoverable. The undo
grammar pretended to cover eject and silently didn't for one of the
two load paths — worst case, exactly the track the DJ just scratched
onto the deck.

## Decision

At eject, a file-loaded deck stashes `{ file, meta }` — the File
itself (kept anyway as `_fileObj`) plus a meta snapshot shaped like
the library record `load()` already consumes: `cueIn`, `cues`,
`loop`, `mem1`/`mem2`, `bpm`/`beatOff`, `key`. Right-click replays
`load(file, meta)`; library ids keep the existing `loadInto` path
(`typeof ej === 'number'` distinguishes).

## Consequences

- Both load paths now have the same one-level eject undo; the
  restore is even cheaper than a fresh load — grid and key arrive
  via meta with no re-analysis.
- Auto-cue still applies underneath `meta.cueIn`, so the restored
  point is exactly what the deck held at eject.
