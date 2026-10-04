# ADR-0092: Shift+Cue — set the cue point here, persisted

## Status
Accepted (2026-10-04)

## Context
Auto-cue picks the first sound above −50 dBFS — usually right, but a
DJ may want the Cue landing on the first downbeat, after an intro
sweep, or wherever feels correct. There was no way to move it.

## Decision
`Shift+Cue` writes `cueIn = pos()` (and `offset`, so the playhead
stays put), persists via `tagLib({ cueIn })`, and redraws the marker.
On load, a stored `cueIn` overrides the auto-detected one — a manual
cue is a deliberate choice, auto-cue is a guess. The shift press is
excluded from cue-preview pointerdown so "set" never previews.

## Consequences
- `cueIn` joins `LIB_META_KEYS` for export/import, and `loadInto`
  passes it through — same treatment as hot cues.
- A stored cue means a track marked "prep" behaves identically
  wherever it reloads.
