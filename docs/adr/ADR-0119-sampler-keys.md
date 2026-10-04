# ADR-0119: Sampler pads on number keys

## Status
Accepted (2026-10-04)

## Context
Sampler pads were mouse-only — a laptop-only set can't finger-drum
one-shots while both hands ride keys.

## Decision
`1`–`4` click sampler pads 1–4. The digits were unassigned; the
handler reuses the pad's click path, so an empty pad's keypress
opens its file picker just like a mouse click.

## Consequences
- Four sample voices live on the keyboard beside the deck keys.
- `0` keeps its crossfader-center role.
