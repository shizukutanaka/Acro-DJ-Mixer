# ADR-0302: Session persistence covers the Stem select

## Context

Every other per-deck select restores across a reload — `assign`,
`range`, `fx`, `fxbeat`, `fxtap` — but `stem` didn't. A deck set to
Vocal or Inst snapped back to Full on every reload while the EQ,
filter and FX around it came back untouched; same gap class as
tempo/keylock (ADR-0290).

## Decision

`stem` joins the `decks` snapshot and restores through `setV` —
dispatching `change` runs `setStem`, which safely no-ops before the
graph exists (`!this.mg`) while the select's *value* sticks, and
`ensureNodes` re-reads the select when the graph is built
(`setStem(this.stemSel.value, true)`). So the restored mode is
applied correctly at first load even when the restore ran with no
track loaded.

## Consequences

- The mixer surface persists whole: every per-deck control now
  survives a reload.
