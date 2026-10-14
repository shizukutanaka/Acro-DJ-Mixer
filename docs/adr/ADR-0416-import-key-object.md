# ADR-0416: Import accepts the key object export writes

## Status

Accepted (2026-10-14)

## Context

Library export serializes `key` verbatim from the record — the
`{num, letter, name}` object `estimateKey()` stores and `load()`
accepts. But the import loop, under ADR-0360's per-field type
validation, copied `key` only `if (typeof e.key === 'string')`.
Every exported key was silently dropped on re-import — a
round-trip through the library file loses all harmonic analysis.
A hand-edited string key would also pass through and render as
garbage in the library table.

## Decision

Import validates `key` as the object shape it actually is: integer
`num` in 1–12, `letter` 'A' or 'B', string `name`; a conforming
entry is copied field-by-field (no extra properties piggyback in).
`stem` keeps its string check. A `null` key writes nothing — an
exported `null` means "not detected there" and must not erase a
locally detected key.

This corrects ADR-0360's "strings for key/stem" rule, which was
written against a guessed schema rather than the export's real
output.

## Consequences

Export → import round-trips keys intact; hostile or stale files
still can't write a wrong-typed key into a record.
