# ADR-0369: The analysis cache belongs to one track

## Context
`__anP` dedupes `estimateBpm`+`estimateKey` into one worker run,
but nothing ever cleared it. Every later new-file load on the deck
received the *first* track's analysis: the late-arrival guard
(`buf !== this.buffer`) passes on a same-deck reload, so B's grid,
readout, and library record were written with A's BPM and key —
a permanent data poisoning for every second-plus un-catalogued
file.

## Decision
`this.__anP = null` in `load()`, beside the other per-track
abandonments (slip/roll/slice). The dedupe still shares one run
within a track: both estimators back-to-back reuse the fresh cache.

## Consequences
Each new file analyzes itself; library records only ever store a
grid and key that were measured from that track's audio.
