# ADR-0012: Beat Jump

## Status
Accepted

## Context

Pioneer's beat-jump is the deck control between hot cues (named points)
and waveform scrubbing (imprecise): skip a fixed number of beats while
staying in phase. With the grid already detected (ADR-0002) the jump is
`pos() ± 60/bpm` routed through `seekTo` — which already clamps to the
track and exits an armed loop when jumping outside it (the established
seek contract, matching Pioneer behavior where a beat-jump out of a
loop disengages it).

Placement: hot cues and beat jump are the same interaction family —
"move the playhead" — so the controls live on the same row; four pads
on the left, `−1b`/`+1b` on the right, visually grouped by `margin-left:
auto`. No new row, no new screen area.

## Decision

- Two buttons per deck at the right of the hot-cue row; `beatJump(dir)`
  = `seekTo(clamp(pos() + dir * beat))` where `beat = 60/grid.bpm`,
  falling back to 1 s when no grid exists (the button still does
  something predictable).
- Fixed 1-beat step (Pioneer's common default; ±4/8/16 selection adds a
  control nobody needs at this scale — YAGNI).

## Consequences

- The jump preserves tempo and pitch automatically since it only seeks.
- A forward jump through a hot cue/loop boundary follows seekTo rules —
  consistent, documented in the button title.

## Rejected alternatives

- Multi-step selector (1/4/8/16 beats): more UI for a niche.
- Jog-wheel drag on the waveform: different gesture, waveform already
  seeks on click.
