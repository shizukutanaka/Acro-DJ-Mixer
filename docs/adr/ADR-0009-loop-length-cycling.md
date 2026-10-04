# ADR-0009: Loop-Length Halve/Double

## Status
Accepted

## Context

ADR-0006 shipped a fixed 4-beat loop. Real DJ use cycles lengths —
halve for a build-up roll, double for an exit loop. Hardware expresses
this as two buttons (`1/2×`, `2×`) that scale the *armed* loop in place
around its start. Leaving it out means re-tapping Loop at a new position
to change length, which loses the loop entirely.

Constraint: minimal UI — a button per state (encoder, segmented length
picker, auto-loop-size list) adds controls beginners must learn. The
halve/double pair is self-describing and appears only while a loop is
armed, so it costs zero attention otherwise.

## Decision

- `.looplen` span in each transport — `½` and `2×` buttons, `hidden`
  until `loopOn` (`hidden` attribute + `[hidden]{display:none}` rule,
  since `display:inline-flex` would defeat the attribute).
- `setLoopLen(factor)`: `loopEnd = loopStart + clamp(len*factor, beat/2,
  duration-loopStart)` — start preserved, minimum half a beat, maximum
  the track remainder; then `applyLoop()` pushes new bounds to whichever
  engine is active and the waveform redraws.
- `_drawnPos` reset where the loop region changes (toggle and resize)
  — `drawWave` early-returns on an unchanged position, and a paused deck
  would otherwise keep the stale highlight.

## Consequences

- Lengths track the grid implicitly: start stays put, end scales —
  4→2→1→½ beats stays quantized as long as the loop started on-grid.
- Both engines take new bounds live (worklet `loop` message, native
  `loopEnd`); no restart, no glitch.
- No length display: the waveform shading shows it.

## Rejected alternatives

- A beat-length segmented control (¼ ½ 1 2 4 8…): more clutter than two
  buttons for the 99% case.
- Re-arming at a new position to change length: destroys the live loop.
