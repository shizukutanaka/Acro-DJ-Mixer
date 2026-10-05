# ADR-0140: Eight hot cues per deck

## Context
Four pads (ADR-0010) covered the basics, but every current
performance surface ships eight — Serato, CDJ-3000, DJM samplers —
and prep-heavy workflows genuinely use more than four (intro, build,
drop, breakdown, outro, plus three flavour points). The whole
pipeline was already index-generic: `cues.entries()` markers, pad
click handlers, `padCue(i)`, `clearPad(i)`, and library persistence
serialize the array wholesale.

## Decision
Extend to 8 pads: two more rows of markup per deck, an 8-colour
palette (the original four hues plus four distinct accents), and the
three `cues` arrays widened to length 8 — constructor, `load`
(slice(0,8) then pad), `eject`. Everything else inherits for free.

Keyboard stays at the first four pads (Z–V / B–,): the existing map
is a hand-position, and reaching a second bank of keys would break
the one-hand rule more than it helps.

## Consequences
- Eight cue points per track, persisted like the original four;
  older records load with the tail slots null, newer records on an
  older build just truncate at 4 — both directions degrade cleanly.
- `slipCueStart`/`slipCueEnd`, shift-clear, and quantize apply to all
  eight pads unchanged.
- Prep badge `⚑N` now counts up to 8.
