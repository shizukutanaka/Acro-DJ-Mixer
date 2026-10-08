# ADR-0406: MIDI-disconnect bend release rides _setBendMul

## Status
Accepted

## Context
ADR-0379 unified every pitch-bend write behind `_setBendMul`: rebase
the position clock under the OLD multiplier first, then swap, then
notify the engine — because `pos() = offset + Δt·rate·bendMul·spinMul`
means a new multiplier applied to a stale `offset` shifts the clock
retroactively by `elapsed·rate·Δmul`.

One write site survived outside the deck's own handlers: the MIDI
`onstatechange` cleanup. When a device vanishes mid-note it releases
latched gates — `stopRoll()` plus a raw `bendMul = 1; setRate(rate)`.
That's exactly the wrong order ADR-0379 fixed elsewhere: the new
multiplier lands first, the `setRate` rebase then applies it to the
whole held window. A wheel bend held ±5% for 20 s would skew the
playhead ~1 s at the moment the cable comes out — waveform, beat
counter, auto-mix trigger all jump.

## Decision
`d._setBendMul(1)` replaces the two statements — the shared path
rebases under the latched multiplier first, resets it, and notifies
the engine (`rate·bendMul·spinMul`), making the extra `setRate` call
redundant.

## Consequences
- Bend bookkeeping is now literally single-path: every `bendMul`
  write outside init/reset flows through `_setBendMul`.
- Verified: the old order jumps pos() ~36 ms after a 120 ms hold;
  the fixed path is continuous (jump = 0).
