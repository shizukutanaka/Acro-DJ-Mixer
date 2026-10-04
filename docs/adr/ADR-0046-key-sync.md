# ADR-0046: Key sync — one-click harmonic transpose

## Status
Accepted (2026-10-04)

## Context
The harmonic-mixing loop had three pieces — detect the key
(ADR-0004), flag clashes (ADR-0011/`refreshKey`), transpose ±6 st
(ADR-0042) — but finding *which* shift lands a compatible key was
left to the DJ's mental Camelot arithmetic. ADR-0001's thesis is that
AI-era DJ software automates the ear-and-memory work; this is that
work, closed into one click.

## Decision
A `Key` button beside the transpose controls computes the smallest
|st| shift that makes the deck's effective key `harmonic()` with the
partner's, then calls `transpose()` once. The math: transposing moves
+7 hours on the Camelot wheel per semitone and never changes the
letter, so the shifted num is `((num-1+7d) % 12 + 12) % 12 + 1` — we
scan d = 0, ±1 … ±6 for the first harmonic hit, else report
"no key match within ±6st".

`refreshKey()` now colours by the *effective* key (detected key
shifted by the current `st`), so a transposed-into-compatibility deck
turns green — the readout now describes what you hear, not what's on
disk. `transpose()` refreshes both decks' colours on every step.

## Consequences
- Full loop: detected clash → one click → compatible key → green.
- Requires both keys analysed and the worklet engine; failures are
  status-line messages, not silent.
- Key sync is absolute (it sets `st` to the goal), not additive —
  pressing it twice is idempotent.
