# ADR-0080: Library row preview on the cue bus

## Status
Accepted (2026-10-04)

## Context
Choosing the next track blind — name, BPM, key, prep badges — is the
workflow rekordbox solves with the preview player: audition the file
in headphones before committing it to a deck. Library rows only
offered "load and hope".

## Decision
A `▶` button on each row decodes the stored blob into a one-shot
`AudioBufferSourceNode` routed to `cueIn` — the headphone cue bus, so
the floor never hears it and the decks are untouched. Click again to
stop (`previewId` toggle); starting a new preview stops the old one;
`onended` cleans up. Because `cueAudio` falls back to the default
output, preview is audible even with no cue device configured.

## Consequences
- Preview deliberately bypasses the mix: it never writes `previewSrc`
  into the deck chain, never leaves masterGain.
- One shared source var: preview is a singleton by design (you audition
  one candidate at a time).
