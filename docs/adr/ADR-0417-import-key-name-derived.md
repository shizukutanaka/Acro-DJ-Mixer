# ADR-0417: Imported key name is derived from the Camelot code

## Status

Accepted (2026-10-14)

## Context

ADR-0416 taught the library import to accept the `{num, letter,
name}` key object export writes, but it still trusted the file's
`name` field, checking only `typeof === 'string'`. A hand-edited or
stale `name` — `{num:8, letter:'A', name:'X'}` — persists into the
record, where `effKey()` does `NOTE_NAMES.indexOf(name)` → −1 and
the transposed readout renders `undefinedm`; even a real but
mismatched name disagrees with the Camelot code it sits beside.

## Decision

The import ignores `e.key.name` entirely and derives it canonically
from `num` + `letter` — the exact inverse of `estimateKey()`'s
Camelot map (C = 8B, Am = 8A, +1 on the wheel = +7 semitones, and
7·7 ≡ 1 mod 12 makes `*7` its own inverse). The gate drops the
`typeof k.name === 'string'` clause: a missing or wrong-typed name
no longer disqualifies an otherwise valid key.

## Consequences

- Every imported key is self-consistent by construction — the file
  can bend `num`/`letter` (the user's stated tag) but can never
  smuggle a name the engine can't index.
- Refines ADR-0416, which preserved the object's shape but still
  trusted its contents.
