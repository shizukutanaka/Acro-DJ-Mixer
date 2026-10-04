# ADR-0023: Beat-Phase Meter

## Status
Accepted

## Context

Sync (ADR-0002) and pitch bend (ADR-0017) both act on phase, but the
deck offered no readout of *how* aligned the two grids currently are —
the only feedback was listening for the flam. Traktor/Serato show a
phase meter for exactly this.

## Decision

- A `Δ ±x% beat` readout in the mixer column (below the cue meter):
  each deck's phase is `((pos - beatOff) / beat) mod 1`; the offset is
  wrapped to `[-0.5, +0.5)` of a beat and coloured — green < 5 %,
  amber < 15 %, red otherwise.
- Reads continuously in the render tick — it's a *meter*, so it moves
  during bends, drifts, and syncs.
- Both decks need `grid && buffer`; otherwise the row is blank (no
  misleading "0 %").

## Consequences

- Sync quality is now legible: after Sync you should see `Δ ±0-2%`
  steady; drift shows as a slowly rotating offset; bend moves it
  visibly.
- Pure readout — no behaviour change, no state.

## Rejected alternatives

- A rotating "sync ring" graphic: prettier, but text already carries
  the number and colour carries urgency; revisit if the column gets a
  dedicated display.
- Hiding it when neither deck plays: the static offset of two paused
  decks is still meaningful (it's what Sync will correct).
