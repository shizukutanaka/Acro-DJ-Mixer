# ADR-0161: Hot-cue preview

## Context
Right-click on a hot-cue pad cleared it — a destructive gesture
with no audition anywhere on the pad row. Meanwhile right-click
already means "preview" on library rows (ADR-0080) and sampler
pads (ADR-0147). Clearing had a better home since ADR-0083:
shift-click.

## Decision
Pad `contextmenu` now auditions the hot cue on the cue bus —
`padPrev` voice, `src.start(0, cues[i])`, a new preview stops the
old. Clearing stays on shift-click. Also fixed a latent bug:
`pointerdown` ignored `e.button`, so a right-button press fired
`slipCueStart` and sought the deck mid-gesture. Now `button === 0`.

## Consequences
- Right-click = preview is now uniform across library, sampler,
  and decks — one idiom, no destructive secondary actions.
- Slip-mode right-clicks no longer touch the playhead.
