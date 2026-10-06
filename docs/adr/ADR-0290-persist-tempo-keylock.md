# ADR-0290: Persist the tempo slider and Key Lock latch across reloads

## Context

ADR-0158 made the mixer surface survive a reload: faders, knobs, FX
settings, and the slip/FX-on latches restore through `sessSave` /
`sessRestore`. Two physical-surface states were still left out:

- the **tempo slider** — a DJ who left the pitch at +3% finds it back
  at ±0% after a reload, silently changing how the next track loads;
- **Key Lock** — the latch sits beside Slip, which is already
  persisted, but resets to off on reload.

Both are physical-control analogs — the same class the session
snapshot already treats as part of the surface, not track state.

## Decision

- `sessSave` records `tempo` (slider value) and `keylock` (`on`
  class) per deck alongside the existing fields.
- `sessRestore` writes tempo **after** the range select: the range
  `change` handler re-clamps the slider's min/max and would eat a
  value restored before it.
- Key Lock restores by the established click-replay pattern (only on
  class mismatch), so the flag flips through `toggleKeylock()` itself.
  On `file://` the button is disabled and the click is a harmless
  no-op.

## Consequences

- A reload now returns the deck to the exact transport-rate surface
  the DJ left: same pitch offset, same key-lock state.
- Older snapshots lack the new fields — the `setV` null-skip and the
  `!= null` guards already handle that (ADR-0269).
