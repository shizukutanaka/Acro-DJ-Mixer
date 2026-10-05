# ADR-0235: Shift+FX stores the beat-FX strip, Alt+FX recalls it

## Status
Accepted.

## Context
The beat-FX strip is four controls — algorithm select, beat
division, level knob, pre/post tap — plus the on/off latch. A DJ
who has dialled in a favourite echo-out (e.g. ping-pong, half beat,
60% wet, post-fader) loses it the moment the strip is reconfigured
for a different track section: there is no way to park one working
combination while trying another (audit P2: FX macro presets).

## Decision
One preset slot per deck, bound to the FX button under the existing
modifier grammar: `shift+FX` snapshots `{fxSel, fxBeat, echo level,
fxtap, fxOn}` into `this._fxPreset`, `alt+FX` restores it by writing
each control and re-dispatching its change/input event so every
audio parameter is driven through the same code paths as a hand
edit. Recall without a store shows an honest status instead of a
no-op. Click toggles and momentary hold are unchanged — the
modifiers are checked before the toggle branch.

## Consequences
A working FX combination can be parked and recalled mid-set, per
deck, in one gesture each way. The preset is session-scoped like
other mixer-surface state; it is not a per-track concept, so it is
not written to the library record.

## Round
Improvement round 235 (audit P2: FX macro presets).
