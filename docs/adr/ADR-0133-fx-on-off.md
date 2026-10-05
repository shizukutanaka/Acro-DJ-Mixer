# ADR-0133: FX on/off — punch the beat effect in and out

## Context
Every beat FX since ADR-0081 has been engaged purely by the level
knob: 0 = dry, anything above = wet. Punching an echo in for one
phrase and killing it again meant re-dialing the knob to 0 and back —
two continuous moves where hardware needs one. DJM beat FX have a
dedicated ON/OFF button for exactly this punch-in gesture.

## Decision
An `FX` toggle button beside the fxbeat select. `fxOn` gates
`setEcho`: disengaged treats the knob as 0 (all wet paths park,
including the crusher returning to its linear curve) while the knob
position is preserved. Default is **on** — the knob works exactly as
before out of the box, matching every earlier round's behaviour.

## Consequences
- One click punches the selected effect in/out; the knob stays put —
  the classic "hold the fader, tap the FX" workflow.
- Off is a true hard-park: crusher goes linear, so a disengaged chain
  is bit-transparent, same as knob=0.
- `.on` LED on the button doubles as the engaged readout.
