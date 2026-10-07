# ADR-0383: A held Phones cue-hold is abandoned on track swap

## Context
Holding Phones while its PFL is off rings the cue bus for as long
as the press lasts (`cueBtn._mom` + `_momTimer`, same hold idiom
as kills/FX/pads/mic). `load()`/`eject()` already abandoned the
held `_slip`/`_roll`/`_slice` gestures — but not the cue-hold.
A swap mid-hold left two leaks: the PFL the hold opened stayed
latched onto the new track, and the release then toggled cue off
while also setting `_suppress`, eating the new track's first click.

## Decision
Both abandon blocks now clear the timer and flags, and — when the
hold already fired — call `toggleCue()` to drop the PFL it opened.
The press's bookkeeping only engages when `cueOn` was off, so
un-latching restores the pre-gesture state exactly.

## Consequences
Momentary gestures on deck controls are now abandoned
consistently: `_slip`, `_roll`, `_slice` and the cue-hold all die
with the track that owned them. Global momentaries (FX, mono,
mic, sampler pads) are deck-agnostic and correctly untouched.
