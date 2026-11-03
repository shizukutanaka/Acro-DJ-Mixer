# ADR-0420: A file dropped on a loaded sampler pad gets the one-level undo; the sample restore persists

## Status

Accepted (2026-11-03)

## Context

ADR-0419 closed the last open undo hole the audit listed (cue-drag).
Re-running the same Socratic check — "does every destructive write
own a one-level undo?" — across the sampler row turned up two more:

- `loadSmpFile` is called unconditionally by a pad's drop handler.
  Dropping a file on a *loaded* pad silences its voice and replaces
  the sample with no way back. Shift-clear had `smpCleared`;
  overwrite had nothing.
- The `smpCleared` restore itself never called `padsSaveSoon()` —
  the runtime said "sample restored" while IndexedDB still held the
  empty slot, so a reload silently un-did the undo. A restore is a
  write and must persist like the clear and the load it sits between.

## Decision

- `smpCleared` generalizes from "last cleared slot" to "last
  destructive pad write": `{i, slot, label, title, overwrite}`.
  `loadSmpFile` stashes `{overwrite: true}` when `old` exists.
- Pad contextmenu restores when the stash names this pad AND either
  the pad is empty (clear undo, unchanged) or the stash came from an
  overwrite. A filled pad whose stash is a plain clear keeps the
  preview path — dropping a new sample after a clear doesn't make
  the next right-click resurrect the pre-clear one.
- The restore stops the pad's live voice and cue-bus audition before
  swapping the slot back, and calls `padsSaveSoon()` so the undo
  survives a reload like every other pad write.

## Consequences

- Every sampler destructive write (clear, overwrite) now sits inside
  the same right-click-restores grammar as the hot-cue undos.
- Cost: after a drop-overwrite, one right-click on that pad restores
  instead of previewing — same trade ADR-0419 took.
