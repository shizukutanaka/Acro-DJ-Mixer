# ADR-0155: Press-to-talk mic

## Context
The Mic button was latch-only — one click to open, another to
close. Radio DJs and MCs use talkback: hold to speak, release and
you're clean. The momentary grammar already unifies kills, deck
mute, FX punch, and pad gate; the mic was the odd control out.

## Decision
Same `_mom`/`_suppress` idiom on the Mic button: while latched OFF,
holding ≥250 ms opens the mic until release (`micOpen`/`micClose`
extracted as callable actions). Tap still toggles the latch. While
latched on, a hold does nothing special — click closes as before.

## Consequences
- One gesture covers "announce and shut up": hold, speak, release.
- Pairs with ADR-0154's gate — PTT for deliberate announcements,
  gate for noise floor while the latch is open.
- Fifth momentary site; the whole surface now reads
  tap=latch/trigger, hold=momentary.
