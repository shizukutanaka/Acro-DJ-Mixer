# ADR-0222: Stem mode persists in the library record

## Context
Every per-track prep field persisted — cues, cueIn, loops,
memory slots, grid, key — except the stem mode, so a track
you'd prepared as an acapella came back Full on reload.

## Decision
The stem select's change handler `tagLib({ stem })`s when a track
is loaded; `load` restores `meta.stem` into the select *before*
`ensureNodes` builds the mid/side matrix, so the saved mode is
applied at graph init like any other control. Export/import
carry `stem`.

## Consequences
- A track's whole rehearsal state — including its stem split —
  survives reloads and exports.
