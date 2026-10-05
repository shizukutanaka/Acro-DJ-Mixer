# ADR-0125: Sampler fixes — master routing, retrigger lit, load race

## Status
Accepted (2026-10-04)

## Context
Review of ADR-0118 surfaced three behavioral bugs:

1. Pads connected `monoNode`, *after* the master fader, mic
   ducking, and the PGM headphone send — a muted or ducked mix
   left samples blaring, and they were missing from the PGM cue.
2. `src.onended` removed the pad's `on` light unconditionally, so
   a retrigger's stale `onended` arrived after the new start and
   unlit a pad that was still sounding.
3. `smpPending` was read at decode completion; a second empty-pad
   click during a decode moved the index under the in-flight load
   (sample lands on the wrong pad, then `children[-1]`).

## Decision
- `smpGain` connects to `masterGain` — samples now obey the master
  fader, talkover duck, and PGM send, and still pass mono fold,
  cut, limiter, and the record tap downstream.
- `onended` only clears `on`/`slot.src` when `slot.src === src`.
- The `smp-file` change handler captures `i = smpPending` and
  clears it immediately, so each decode writes to the pad that
  was clicked when its file was picked.

## Consequences
- Samples behave like a fifth channel on the master bus — the
  behaviour a DJ expects from hardware samplers.
- The pad light always reflects the *current* source.
- Concurrent pad loads can't corrupt assignments.
