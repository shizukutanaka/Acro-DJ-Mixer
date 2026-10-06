# ADR-0192: Shift+×2 swaps the decks

## Context
Instant doubles cloned one deck into the other, but there was no
way to trade sides — Serato/Traktor's Swap Decks, which DJs use to
hand a running track to the other channel mid-set.

## Decision
`Shift+×2` on either deck calls `swapWith(partner)`: a snapshot of
each side's `_fileObj`, position, rate, play state, hot cues,
armed loop, BPM/key analysis and library id is taken, then each
deck reloads through `load(file, meta)` — the cached-meta path
restores every field exactly, no re-analysis — followed by rate,
seek and play restoration. An empty side means the track just
moves over (that side ejects). Refuses mid-fade since autoMix's
from/to roles are bound to the decks.

## Consequences
- One gesture trades both channels with zero state loss — tempo,
  playhead, playing state and prep all follow the track.
- No new code path: load()'s meta branch already restores cues,
  loops, grids and keys, so the swap can't drift from a real load.
