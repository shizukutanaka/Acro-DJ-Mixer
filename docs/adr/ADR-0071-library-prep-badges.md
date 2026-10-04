# ADR-0071: Library prep badges — saved cues and loops at a glance

## Status
Accepted (2026-10-04)

## Context
Hot cues and the armed loop persist to the library (ADR-0010/0038),
but the list showed no sign of which tracks were prepped. A DJ digging
for a track with cue points already set had to load each one blind.

## Decision
In `renderLibrary`, append a muted `.prep` badge inside the name span:
`⚑N` for N saved hot cues, `∞` for a persisted loop. No extra grid
column — the badge rides the name so the row layout stays untouched.

## Consequences
- Reads from fields already stored on the record; zero schema change.
- Pure display: prep state is authored by the deck, not the badge.
