# ADR-0013: Auto Mix

## Status
Accepted

## Context

The last automation-layer roadmap item. Every ingredient already exists:
grids, tempo-matching (`syncTo`), the equal-power crossfader, and a rAF
`tick()` already watching playback state. Auto-mix reduces to: notice
the playing deck is ending → start the partner synced → ride the
crossfader.

Socratic check on "which track does it pick?" — the honest v1 answer is
*the one already loaded on the other deck*. Choosing from the library is
recommendation, already surfaced by the fit highlight (ADR-0011); auto-
loading a track silently would surprise more than it helps.

## Decision

- `Auto` button in the mixer; armed state shown by `.on`.
- `autoMixTick()` inside `tick()`: when a deck is playing, its partner
  is loaded-but-stopped, not looping, and `duration - pos() < 16 beats`
  (16 s without a grid) → start the transition:
  `to.seekTo(to.grid.beatOff)` → `to.syncTo(d)` (tempo; starting exactly
  on a grid beat aligns phase by construction) → `to.play()`.
- The crossfader rides `fromX → toX` linearly over 8 beats of the
  outgoing track, written back to the `xfader` input + `applyCrossfade`
  so UI and audio stay in lockstep.
- On completion: the outgoing deck `pause()`s (rather than playing on
  inaudibly) and Auto disarms — one click = one transition, predictable.
- Clicking during a fade cancels it, leaving the xfader where it is.

## Consequences

- Skips when the deck is looping (`pos()` wraps — the "end" is
  unreachable) or when both decks already play.
- Without grids it still fades (16 s warning, 8 s fade, no tempo match)
  — degraded but functional.

## Rejected alternatives

- Auto-picking the next track from the library: silently loading media
  the user didn't choose; the fit highlight already does the suggesting.
- EQ/ducking inside the auto transition: a later refinement; equal-power
  crossfade is the safe default.
- Fade to the outro's *last* beat rather than fixed 8 beats: fixed
  windows are predictable and match how DJs actually time transitions.
