# ADR-0337: Channel reset covers every piece of channel state

## Context

ADR-0199's alt+eject "full channel reset" predates most of the deck
feature set: it reset tempo, gain, EQ + kills, filter, and transpose —
but latches and selects added later survived it. After the reset a
channel could still be in slip mode, brake mode, key lock, Vocal stem,
a post-fader FX tap, a half-wet reverb, a punched-out FX button, a
lowered channel fader, or assigned to the wrong crossfader side. The
next track loaded onto that deck inherited the old deck's mode stack.

## Decision

`resetChannel` now also restores:

- `keylock`, `slip`, `brake` latches off (+ button lamps)
- `stemSel` → `off` (+ `setStem`)
- the whole beat-FX strip: `fxSel` → `echo`, `fxBeat` → `0.75`
  (+ `_syncDelay`), `fxtap` → `pre` (+ `setFxTap`), `echoEl` → 0,
  `fxOn` → `true` — factory state is armed-and-dry, matching the HTML
- `faderEl` → 1 (+ `setFader` and `_faderPrev`, which fader-start reads)
- `assignSel` → the deck's own side (+ `applyCrossfade`)

Deliberately kept: tempo range, loop-length select, elapsed/remaining
mode — performance preferences, not channel coloration. Momentary mute
needs no reset: it has no latched state after release.

## Consequences

- Alt+eject now returns the channel to factory state instead of a
  state that depends on when the feature was added.
