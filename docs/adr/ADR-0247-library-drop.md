# ADR-0247: Drop files onto the library to batch-add tracks

## Status
Accepted.

## Context
The only way audio reached the library was through a deck
dropzone — one file at a time, loaded straight onto a deck.
Building a crate (dump 40 tracks in, curate later) meant 40 deck
loads, each one a load-guard interaction on a playing deck. The
library itself had no inlet of its own.

## Decision
The `.library` section is a drop target: every dropped audio file
(mime `audio/*` or a known audio extension — the filter exists
because OSes hand over `type: ''` on plenty of audio) goes through
`Library.addFromFile`, so dedupe, persistence and `renderLibrary`
behave exactly like a deck load. Decks are untouched — no load, no
guard prompt.

Duration is probed with `<audio preload=metadata>` rather than
`decodeAudioData`: metadata needs no full decode, so a 50-file
drop doesn't stall the page. BPM/key arrive later through the
idle-time `bgScan` (ADR-0243), which now has real work to do on a
fresh crate.

## Consequences
Bulk ingest is one gesture. Rows appear immediately with correct
duration; analysis follows in the background while nothing plays.

## Round
Improvement round 247.
