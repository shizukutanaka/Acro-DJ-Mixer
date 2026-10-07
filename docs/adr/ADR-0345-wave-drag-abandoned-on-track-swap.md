# ADR-0345: A waveform drag is abandoned on track swap

## Status
Accepted (2026-10-07)

## Context
The waveform's pointer gestures — playhead scrub, shift-drag jog
bend, loop-edge pull, cue-tick drag, hot-cue marker drag — hold their
state in constructor closures (`scrubbing`, `jog`, `cueInDrag`,
`loopDrag`, `cueDrag`), the same held-gesture class ADR-0328 and
ADR-0334 taught `load()`/`eject()` to abandon (`_slip`, `_roll`,
`_loopT`, `_slice`). These five were missed: a track swap mid-drag —
the vacated deck's auto-mix reload, a partner's instant-double, a
keyboard Enter load — kept the drag alive on the *new* track.
`pointermove` would then keep mutating it (loop bounds scrubbed to
the dragged position, `cueIn` rewritten, a phantom hot cue set) and
`pointerup` would `tagLib` those phantom values onto the new track's
library record — a write the user never made, persisted.

## Decision
`this._waveAbort()` — a constructor-registered closure that clears
all five drag flags and runs `jogEnd()` (releases the jog timer and
`bendMul`) — is called inside `load()` and `eject()` alongside the
`_slip`/`_roll`/`_slice` abandonment block. Same doctrine, same
site: an abandoned gesture performs **no** `tagLib` write — the
release that arrives later finds every flag null and does nothing.

## Consequences
- A mid-drag track swap can't paint stale waveform gestures onto
  the arriving track or its library record.
- Fresh drags after a load work untouched — the abort is one-shot,
  not a latch.
