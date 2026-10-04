# ADR-0171: Auto-mix counts back from the effective end

## Context
The fade trigger counts back from `buffer.duration` — but tracks
with a silent tail have "end" later than the music's real end, so
the fade fires up to the tail's length late. Auto-cue already skips
lead-in silence; the tail is the same defect mirrored.

## Decision
Load scans the last sample above the same −50 dBFS floor and stores
it as `_endAt` (defaulting to `buffer.duration` when absent).
`autoMixTick` counts the raw fire point back from `_endAt` instead
of `buffer.duration`, and the bar-snap clamp uses the same bound.

## Consequences
- Silent tails no longer delay the transition; the outgoing deck
  stops being audible right at the music's true end.
- One backward scan at load (~zero cost), one swapped bound at
  fire time.
