# ADR-0317: A failed preview decode reports itself instead of dying silently

## Context

`previewTrack` ran `decodeAudioData` outside any guard: a corrupt
or un-decodable blob in the library made the ▶ click an unhandled
rejection — dead button, no status, nothing on the cue bus. The
deck load path reports the same failure ('Could not decode this
file.'); the audition path didn't.

## Decision

Wrap the decode in try/catch and surface `preview: undecodable
audio` on the status line, then return. No voice starts, no
rejection escapes.

## Consequences

- Undecodable library entries get the same honest feedback as
  undecodable deck drops.
