# ADR-0081: Beat FX select — Echo / Flanger on one level knob

## Status
Accepted (2026-10-04)

## Context
A single echo send was the only effect. DJM BEAT FX's model — pick an
effect, drive it with one level knob — scales to more FX without adding
controls. Flanger is the natural second effect: a jet-sweep comb
rather than rhythmic repeats, covering a different texture.

## Decision
A `data-act=fx` select (`Echo`/`Flng`) sits beside the existing level
knob. The flanger is a parallel send from `filter`: `flDelay` (2 ms
base, 0.4 Hz LFO ±1.5 ms) → `flFb` (0.5) → `flDelay`, wet → `xfGain`.
`setEcho` drives whichever wet path the select names and parks the
other at zero — CDJ semantics: only the selected effect sounds.

## Consequences
- One knob, growing effect list — adding FX is now "another send +
  option", no UI cost.
- dblclick-reset on the knob still mutes the active effect; the parked
  path is already zero.
