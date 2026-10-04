# ADR-0067: Microphone input to the master bus

## Status
Accepted (2026-10-04)

## Context
Every hardware DJ mixer has a mic channel — announcements and MC work
are part of a real set. The app had none, which made it unusable for
streaming/live contexts even though the master bus already had room
for one more source.

## Decision
A `Mic` button on the Auto/Rec row toggles `getUserMedia({audio})`:
a `MediaStreamSource → micGain (0.9) → monoNode`, i.e. summed into the
master **before the limiter** so the mic enjoys the same clip
protection as deck audio and lands in recordings (the recorder taps
the limiter output). Toggling off disconnects and stops the tracks.

Denied permission fails silent (button stays off) — the mic is
optional infrastructure, never a blocking dialog on load.

## Consequences
- New variable `micStream/micSrc/micGain`; no engine changes.
- Feedback is the user's concern: open speakers + live mic will
  squeal — the button title says "use headphones".
- Deliberately no mic gain knob yet: 0.9 fixed, KISS.
