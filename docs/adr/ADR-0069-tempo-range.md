# ADR-0069: Pitch range select — ±8 / ±16 / ±50

## Status
Accepted (2026-10-04)

## Context
Every CDJ offers pitch range (±6/10/16/100 class) for one reason: a
fixed-range slider trades resolution for reach. At ±16% the slider is
coarse for precise matching; a DJ who wants finer control picks ±8,
and one who wants dramatic effect picks wide. The app hardcoded ±16%
in the slider markup, the Sync clamp, and the harmonic-fit test.

## Decision
A per-deck `±8/±16/±50` select on the Tempo row sets `tempoRange`;
the slider min/max rescale (step stays 0.001), so ±8 gives ~2× the
pixel resolution. Narrowing while the rate is out of bounds clamps
rate + slider to the new edge — engine and control never disagree.
`syncTo()` clamps to the deck's own range and reports the actual limit;
harmonic-fit uses `d.tempoRange` so widening the range honestly
widens what counts as a reachable match.

## Consequences
- `tempoRange` is per-deck, like every other control state — it
  survives track loads (hand position), not sessions.
- No persistence, matching mixer-level state doctrine.
