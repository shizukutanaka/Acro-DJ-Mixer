# ADR-0053: Shift + beat jump = one-bar jump

## Status
Accepted (2026-10-04)

## Context
Beat jump (ADR-0012) steps ±1 beat — useful for trimming, but moving
between phrases means hopping a *bar* (4 beats). Four clicks is
fiddly; a bigger step was missing without adding buttons.

## Decision
`Shift` + click on `−1b`/`+1b` passes ±4 to `beatJump` instead of ±1.
The modifier reuses the existing control (no new UI, titles document
it); `beatJump`'s own stepping, clamping, and loop-exit via `seekTo`
are unchanged — it always took a beat count, the call sites just
multiplied the direction by 4.

## Consequences
- One-beat nudge and one-bar phrase hop share two buttons.
- Same no-grid fallback: shift still jumps 4× the 1 s fallback —
  consistent, just larger.
- Hint: also works with the keyboard map if bound keys are later
  added (handler takes the event).
