# ADR-0244: Right-click an empty deck undoes the last eject

## Status
Accepted.

## Context
⏳ wipes a deck instantly — an accidental eject (or an eject done
to silence the floor and then regretted) means re-finding the
track in the crate and re-loading. The library record kept every
bit of prep — grid, key, cues, cueIn, loop — so the only thing
actually lost was the pointer to it (audit: destructive gestures
have no undo).

## Decision
`eject()` stashes the deck's `libId` in `this._ejected` (library
tracks only — a file-drop load has no record to return to, so the
gesture isn't promised there). Right-click on the empty dropzone
calls `Library.loadInto`, which restores the record wholesale —
the undo is free because persistence already did the work. The
gesture only fires when the deck is empty: a loaded deck's
dropzone click opens the file picker, and its right-click does
nothing here either — the stash waits for a real eject.
One-shot: the restore consumes it, a new eject re-arms it.

## Consequences
The most destructive single gesture on the deck surface is
recoverable in one click, using the same "right-click the empty
slot restores" grammar as the sampler-pad and hot-cue undos.

## Round
Improvement round 244.
