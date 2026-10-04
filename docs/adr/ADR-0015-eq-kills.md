# ADR-0015: EQ Kill Switches

## Status
Accepted

## Context

Isolator kills are the most-used EQ move in a live set — slam the bass
out, slam it back. Dragging a slider to −26 and back takes two hands of
precision; a toggle takes one click. The −26 dB floor already exists
(ADR-0005), so a kill is a state flag, not new DSP.

## Decision

- The H/M/L band letters become `.kill` buttons: click toggles the band
  between "killed" (pinned at −26 dB) and the slider's value. Red `.on`
  state — kill reads as a warning-level action.
- `kills[band]` lives on the deck; `setBand` checks it (`kills[band] ?
  -26 : v * 26`), so slider moves while killed stay inert but keep
  their value — unkill restores instantly, which is the whole point of
  the gesture.
- Kill state resets on track load with the rest of deck state? **No** —
  deliberately persists: kills are a *hand position*, not track
  metadata, and surviving a load matches hardware (a knob doesn't reset
  when you swap a record). The button state therefore survives.

## Consequences

- Three new buttons per deck, zero new controls to learn — the label
  was already there.
- `setBand`'s signature is unchanged; kills compose with every existing
  caller (slider, dblclick reset, init).

## Rejected alternatives

- Momentary kill (hold-to-cut): a latch is the more common isolator
  control and doubles as a live-performance toggle; momentary can be
  added later via mousedown/up if requested.
- Kill = −∞: Web Audio has no true mute on a Biquad; −26 dB ≈ isolator
  travel and stays consistent with the slider floor.
