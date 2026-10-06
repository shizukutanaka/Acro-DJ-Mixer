# ADR-0207: Auto-mix says why it picked the next track

## Context
The product audit flagged the gap between "automation" and
"copilot": autoNext picks a track for you but never says why.
A DJ handing the deck to an algorithm needs the one-line
justification — is this a curated harmonic choice or just
whatever came next?

## Decision
`autoNext` reports its pick on the vacated deck's status line:
`Auto-load: <name> — harmonic fit` when the Camelot+tempo
criteria matched, `— next in line` for the list-order fallback.
The reason is computed at pick time, right where the criteria
already live, so it can't drift from the actual decision.

## Consequences
- The autopilot explains itself — the difference between a
  feature you trust and one you second-guess.
- New pick tiers (e.g. played-skip, ADR-0203) extend the same
  reason string — one place to keep honest.
