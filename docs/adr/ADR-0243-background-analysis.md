# ADR-0243: Background analysis fills BPM/key on un-scanned library rows

## Status
Accepted.

## Context
BPM and key are only estimated when a track loads into a deck, so
library rows sit at `—` until each one is loaded — harmonic-fit
highlighting (ADR-0011) can't light up for tracks that were never
played, and crate digging means loading each row just to see its
tempo. Rekordbox-style workflows analyze the crate in the
background; this app left that scan to the DJ.

## Decision
`bgScan()` walks records lacking `bpm` or `key` (blob still
present, not deleted) one at a time: decode → `monoResample` →
the same `analyzeTrack` Web Worker the decks use (ADR-0233) →
tag the record. Two guards keep it out of the way of a live set:

- every iteration re-checks `deckA.playing || deckB.playing` —
  decode of a big file is awaited before the check, so the scan
  yields *between* tracks, never mid-decode of a set in progress;
- the scheduled re-scan (45 s interval) is a no-op while playing.

Eligibility uses `typeof t.bpm !== 'number'` rather than falsiness
so a malformed stored value self-heals instead of locking the
track out of analysis forever.

## Consequences
The crate fills in tempo and key without deck loads; fit rows
appear where they should. Worst case cost is one decode+FFT per
un-analyzed track, spaced out and only while idle.

## Round
Improvement round 243.
