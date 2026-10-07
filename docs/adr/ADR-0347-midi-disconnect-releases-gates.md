# ADR-0347: A MIDI disconnect releases every held gate

## Status
Accepted (2026-10-07)

## Context
Notes 80/81 gate a 1-beat loop roll and the pitch-bend wheel rides
`bendMul` — both momentary by design and both released only by a
later MIDI message (note-off / wheel-centre). A device that
disconnects mid-note — USB pulled, Bluetooth drop, controller
powered off — never sends that message: the roll loops forever and
the bend stays latched past the unplug, indistinguishable from a
software bug to the performer. `midiNoteT` also kept stale note-on
timestamps across the gap.

`onstatechange` previously only rebound inputs, so a disconnect
left the held state dangling. This is the same latch class as
ADR-0325 (bend surviving stop) and ADR-0326 (momentaries surviving
window blur) — a transport the app can't observe needs a cleanup
edge.

## Decision
`onstatechange` now, after rebinding, releases every MIDI-held
momentary on both decks — `stopRoll()`, `bendMul = 1` with the rate
reapplied — and empties `midiNoteT`. Releasing on *every* state
change (connect too) is safe: `stopRoll` on an un-rolled deck is a
no-op, and a bend of 1 changes nothing.

## Consequences
- No held gate can outlive the device that held it.
- Held sampler-pad gates (notes 36–39) intentionally keep ringing:
  a lost note-off leaves the pad in the same state a quick tap
  produces — firing, not latched.
