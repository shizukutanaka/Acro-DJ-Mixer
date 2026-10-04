# ADR-0070: Hot-cue pad colors

## Status
Accepted (2026-10-04)

## Context
Rekordbox/Serato assign each cue pad a color so "which cue is where"
reads instantly — four identical amber markers force counting pads or
re-reading titles. Our pads were all the same color, and the waveform
drew every cue marker in one amber too.

## Decision
`PAD_COLORS = ['#ff5252', '#ffb142', '#2ed573', '#34ace0']` — red,
amber, green, blue (rekordbox-adjacent, high-contrast on the dark
theme). Each pad gets `--pc` at construction; `.pad.set` fills with it
(dark text for contrast). Waveform cue markers draw `padColors[i]` per
index, so pad and marker share an identity.

## Consequences
- Pure presentation: no state, persistence, or interaction changes.
- Unset pads keep the muted default — color only signals *set* cues.
