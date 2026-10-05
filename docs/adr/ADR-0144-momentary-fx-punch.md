# ADR-0144: Momentary FX punch on the FX button

## Context
The beat-FX on/off button (ADR-0133) only latched: a one-stab
echo-out or reverb-wash gesture took two clicks — engage, then
remember to disengage. ADR-0117 solved the same shape for EQ kills
with press-and-hold = momentary, tap = latch.

## Decision
The FX button adopts the kill idiom verbatim:

```js
pointerdown: if (!fxOn) _momTimer = setTimeout(setFxOn(true), 250);
pointerup/cancel: if (_mom) { _suppress = true; setFxOn(false); }
click: if (_suppress) clear + return; else setFxOn(!fxOn);
```

Holding while the FX is latched OFF engages it until release —
the knob position (and every send/level the knob drives) is kept,
exactly like the latch. Holding while latched ON is a no-op; the
trailing click still toggles off.

## Consequences
- One-stab FX punches (echo-out on a snare, reverb wash on a riser)
  are now a single hold — same finger grammar as EQ stabs and the
  momentary deck mute.
- Latch behaviour is untouched: tap toggles, the suppress flag
  eats the click that follows a hold.
