# ADR-0372: Transpose is deck state worth persisting

## Context
sessSave recorded every deck surface control — tempo, keylock arm,
stem, brake, slip, remain — except `st`. A −3 st transposed deck
came back at ±0 after a reload, changing the audible key as much as
a tempo restore does. `transpose()` couldn't restore it anyway: it
refuses before the engine exists.

## Decision
- sessSave stores `st: d.st`.
- Restore sets `d.st`/`stEl` directly (the keylock doctrine — armed
  state can't go through the live path yet).
- `ensureNodes` posts `pitch` when `this.st` is set, seeding the
  fresh worklet exactly like the keylock arm beside it. Saved
  values are validated and clamped to ±6 like the live path.

## Consequences
A reloaded session sounds the same as it did — the deck's pitch
shift is part of the surface the snapshot brings back.
