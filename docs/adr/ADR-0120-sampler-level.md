# ADR-0120: Sampler level knob

## Status
Accepted (2026-10-04)

## Context
Pads fired at unity into `monoNode` — a loud one-shot had no trim
against the decks, and the only fix was editing the file itself.

## Decision
A shared `smpGain` bus sits between the pad sources and
`monoNode`, driven by a `0–1` slider next to the pads (default
0.8 — one-shots should sit under the music by default). The bus
is created lazily on first fire; the knob rides it like every
other control, and it takes the delegated wheel-nudge for free.

## Consequences
- Sample level is a mix decision, not a file property.
- All four pads share one knob — per-pad trim is file-level
  territory, not mixer territory.
