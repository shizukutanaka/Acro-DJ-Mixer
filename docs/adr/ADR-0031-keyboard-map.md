# ADR-0031: Expanded Keyboard Map

## Status
Accepted

## Context

Only four actions had keys (Q/P play, ←/→ crossfade, 0 centre) — the
most-touched controls (hot-cue pads, Sync, Loop) still required mouse
precision mid-performance. DJs perform on keys; a mixer where pads
need a pointer is a mouse toy, not an instrument.

## Decision

- Deck A (left hand): `Z X C V` = pads 1–4, `E` = Sync, `R` = Loop.
- Deck B (right hand): `B N M ,` = pads 1–4, `I` = Sync, `U` = Loop.
- Same physical-row layout per deck so hands mirror; pads sit on the
  bottom row like hardware pads sit under the jog area.
- Guard extended to `SELECT` — keys while the stem/cue dropdown is
  focused must not fire deck actions.

## Consequences

- One-keystroke pad hits, quantized by ADR-0021 — playable cue
  juggling without a controller.
- No conflicts with the existing Q/P/arrows/0 set.

## Rejected alternatives

- Digit-row pads (1–4 / 7–0): digits are what a future "type a BPM"
  or number-driven feature would want; letters keep them free.
- Modifier-based chords: more keys but two-hand overhead; the
  ten-key-per-deck letter rows fit the two-hand stance already used
  by Q/P.
