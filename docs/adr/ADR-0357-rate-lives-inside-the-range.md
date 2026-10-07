# ADR-0357: A copied rate lives inside the destination's range

## Context
`swapWith` and `instantDouble` wrote the source deck's `rate` straight
into `setRate`. When the source rate sits outside the destination's
`tempoRange`, the browser clamps `tempoEl.value` to the slider's
min/max — so the fader displayed ±8 % while the audio played −40 %:
the display lied about the effective tempo (the same "don't lie"
rule ADR-0311 applied to Key Lock).

Both `syncTo` and the range-select already clamp to the deck's own
range; these two copy paths were the only unclamped writes.

## Decision
Clamp to `1 ± tempoRange` of the destination deck before writing,
and note the clamp on the status line so the DJ knows the copy
didn't take the full offset.

## Consequences
Slider display and effective rate can no longer disagree after a
double or a swap; a clamped copy announces itself.
