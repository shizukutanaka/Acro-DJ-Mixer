# ADR-0117: Momentary EQ kills on press-and-hold

## Status
Accepted (2026-10-04)

## Context
Kill letters only latched — a classic "kill stab" (cut the bass
for one beat, restore instantly) took two clicks.

## Decision
Each kill button now engages momentarily when held ≥250 ms: the
band cuts on the hold and restores on release, and the trailing
`click` is suppressed so it doesn't also toggle. A quick tap
remains a latch exactly as before — the gesture set is
tap = latch, hold = momentary.

## Consequences
- One-finger kill stabs mid-blend.
- Momentary state can't be left armed by accident — release
  always restores.
