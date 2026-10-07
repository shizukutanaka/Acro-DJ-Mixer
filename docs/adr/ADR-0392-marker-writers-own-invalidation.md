# ADR-0392: Marker writers own the invalidation

## Context
`drawWave` skips work when `pos()` hasn't moved (`cur === _drawnPos`),
so every writer of a rendered value must invalidate `_drawnPos` itself
— while playing, a skipped frame self-corrects next tick, but on a
stopped deck nothing else ever forces a redraw. Two writers missed it:
the free-size loop's IN press returned early before the shared
invalidation at the bottom of `toggleLoop`, so the pending-mark tick
(whose whole purpose is visibility before the loop arms) never
appeared on a stopped deck; and the auto-mix tick wrote `_fadeAt`
unconditionally, leaving a stale fire marker frozen on the wave when
auto-mix was disarmed while paused.

## Decision
The IN press invalidates and redraws before returning. The `_fadeAt`
sites invalidate only on an actual change — a cleared or moved marker
comes off even while `pos()` is static, with no redraw storm while
the value sits unchanged.

## Consequences
The free-loop pending mark now reads on a stopped deck (the prep
case it's for); disarming auto-mix erases its tick immediately
instead of waiting for playback to resume.
