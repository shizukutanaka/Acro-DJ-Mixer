# ADR-0086: Continuous auto-mix — auto-load the next library track

## Status
Accepted (2026-10-04)

## Context
Auto-mix fired exactly once: fade done, `autoMix.on = false`, and the
vacated deck sat empty. A real "hands-off radio" needs the cycle to
continue — the empty deck should pick up the next track and stay
armed.

## Decision
On fade completion, instead of disarming, `autoNext(vacated, playing)`
finds the library row after the playing track (same `updated_at` order
as the visible list, wrap-around) and `loadInto`s it into the vacated
deck; Auto stays armed and fires on the new track's tail. It disarms
only when there's no next track (empty library, or a library of one).

## Consequences
- The auto-load reuses `loadInto`, so cached BPM/grid/cues/loop come
  along for free — the incoming deck is beat-ready when the trigger
  window opens.
- The playing deck's `libId` may be unset for non-library files; an
  unknown position falls back to the top (most-recent) row.
