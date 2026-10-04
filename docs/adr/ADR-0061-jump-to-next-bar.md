# ADR-0061: Jump to the next bar downbeat

## Status
Accepted (2026-10-04)

## Context
Beat jump steps ±1 beat/bar (ADR-0012/0053) — useful for trimming, but
the common move is "get to the next downbeat so the drop lands on the
one". That took up to four jump presses and eyeballing the bar count.

## Decision
A `▸bar` button in the existing `.jump` span calls `jumpBar()`:
`n = floor((pos − beatOff)/barLen) + 1`, seek to `beatOff + n·barLen`.
`floor+1` (not `ceil`) so sitting exactly on a downbeat still advances
— a button that does nothing when you're perfectly placed teaches
nobody anything. No grid or no room ahead → no-op.

## Consequences
- One press always lands on the next bar boundary — matches the
  bar counter (ADR-0052) and bar ticks (ADR-0048) it reads from.
- Session-only; nothing persisted.
