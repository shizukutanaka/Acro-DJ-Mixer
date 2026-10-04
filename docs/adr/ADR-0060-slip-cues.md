# ADR-0060: Slip mode for hot cues

## Status
Accepted (2026-10-04)

## Context
Hot cues are permanent jumps — stab a pad and the track is elsewhere
now. The CDJ SLIP pattern instead treats a pad press as *momentary*:
the phrase underneath keeps running silently and the deck snaps back
on release. Stutter effects and drop-teases without losing the
timeline.

## Decision
`Slip` toggle beside `Roll` (per-deck, hand-position state like
Brake). While on, `pointerdown` on a set pad records
`{pos, ctx.currentTime}` and seeks to the cue; `pointerup/leave/cancel`
jumps back to `pos + elapsed·rate` — the same dead-reckoning
`stopRoll` uses. Pads bound via pointer events, not click, so the
momentary semantics are inherent; a normal `click` (slip off) is
unchanged.

## Consequences
- Stabs/teases return to the true timeline — no beat counting needed.
- Only armed pads slip (setting/clearing cues stays a click/right-click
  operation when slip is off; with slip on, click is inert so a hold
  doesn't *also* jump).
- No worklet changes; just two seeks and clock math.
