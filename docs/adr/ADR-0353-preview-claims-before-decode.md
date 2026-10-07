# ADR-0353: A preview claims its id before the decode begins

## Context
`previewTrack` only set `previewId` after the decode finished, and
`remove()`/`loadInto()` silenced the audition only when
`previewSrc` already existed. In the decode window — get →
arrayBuffer → decodeAudioData → monoResample — neither held:

- delete a row while its preview decodes → the ghost audition starts
  ringing after the record is gone;
- commit a load mid-decode → the cue audition starts *after* the
  track is already heading for a deck, doubling it in the phones.

## Decision
- `previewTrack` claims `previewId = id` before the first await —
  the id now names "this row's audition is committed", in-flight or
  ringing.
- Bail paths clear the claim only when it is still theirs
  (`previewId === id`), so a newer preview's claim is never clobbered.
- `killAllPreviews` clears `previewId` unconditionally — it drops an
  in-flight decode's claim too.
- `remove()`/`loadInto()` match on the claim alone
  (`previewId === id → killAllPreviews()`), which also bumps
  `previewToken` so the in-flight decode returns without starting.

## Consequences
A deleted or loaded track can never start auditioning after the
fact; the "one audition at a time" invariant now covers the decode
window, not just the ringing window.
