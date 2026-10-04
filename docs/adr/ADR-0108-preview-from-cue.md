# ADR-0108: Library preview starts at the cue point

## Status
Accepted (2026-10-04)

## Context
`previewTrack` auditioned rows from sample zero, so a track with a
long lead-in played dead air first — the opposite of what
auto-cue (ADR-0044/0092) does on the decks.

## Decision
`previewSrc.start(0, rec.cueIn || 0)`: the stored cue point —
auto-detected or user-set — becomes the audition start, matching
where `Cue` would land on a loaded deck.

## Consequences
- Row previews answer "what does this track sound like" instantly.
- Records without `cueIn` preview from 0 as before.
