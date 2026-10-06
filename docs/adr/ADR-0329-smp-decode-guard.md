# ADR-0329: Sampler loads report undecodable audio

## Context

`loadSmpFile` awaited `decodeAudioData` bare — the last unguarded
decode path on the surface (deck loads and library previews already
report theirs). A corrupt or non-audio file dropped onto a pad, or
picked through its file dialog, produced an unhandled rejection:
the pad silently stayed `+`, no status, and a page error in the
console.

## Decision

Wrap the read+decode in try/catch and report `sample: undecodable
audio` on the shared status line — the same wording doctrine as the
library preview's message. The slot is left untouched: a failed load
must not clear the sample the pad already holds.

## Consequences

- Failed sampler loads behave like every other failed load: a status
  message, no ghost state, no unhandled rejection.
