# ADR-0148: Set recordings land in the library

## Context
Stopping a recording downloaded a .webm and forgot it — the set you
just played existed only as a file in the downloads folder. Inside
the app there was no way to hear it back, cue it, or resample it.

## Decision
`onstop` still downloads the file, and also files the same blob via
`Library.addFromFile(new File([blob], name), elapsed)` — the
recording becomes an ordinary library row: it can be loaded into a
deck, previewed on the cue bus, looped, and resampled onto a pad
(the loop-shift+pad gesture composes with it directly). Duration is
measured off the same `recStart` clock as the button timer.

## Consequences
- "Play the tape back" is one click: the recorded set is a track
  like any other — same analysis, prep, and deck features.
- Self-sampling closes the loop: record a blend, resample a section,
  fire it back — all inside one page, no file round-trip needed.
- IndexedDB holds the blob; sets can be large but deleting the row
  frees it, same as any track.
