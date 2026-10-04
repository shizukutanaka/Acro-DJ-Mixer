# ADR-0165: LU target zone

## Context
The LU readout (ADR-0139) shows momentary loudness, but a bare
number can't answer the only question it exists for: "am I on
target?" R128-style meters always draw the reference line.

## Decision
When the momentary value sits inside −14 LUFS ± 1 — the streaming
target already named in the readout's title — the number turns
green (`#3ddc84`, the same accent as engaged buttons). Outside the
band it keeps the default meter colour.

## Consequences
- On-target becomes a glanceable state, not a mental comparison.
- Zero new UI, zero new state: the same sample class-drives the
  element it already writes to.
