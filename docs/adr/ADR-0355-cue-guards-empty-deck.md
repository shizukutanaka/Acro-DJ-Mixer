# ADR-0355: Cue guards the empty deck

## Context
`cue()` dereferenced `this.buffer.sampleRate` whenever the engine
was 'worklet'. But `engine` is assigned once at first use and
outlives the track: after load → eject, `engine === 'worklet'` with
`buffer === null`. Pressing Cue (button or MIDI note 50/51) on that
deck threw a TypeError mid-handler — `offset` was left stale and an
uncaught error hit the console.

## Decision
`cue()` returns early when `!this.buffer`, the same contract
`play()` already follows — an empty deck ignores transport verbs
instead of crashing.

## Consequences
Cue on a never-loaded or ejected deck is a no-op; no error, no
stale offset.
