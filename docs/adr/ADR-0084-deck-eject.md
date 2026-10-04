# ADR-0084: Deck eject — unload the track, reset the deck

## Status
Accepted (2026-10-04)

## Context
A deck could never be emptied: the only way to clear a track was to
load another one over it. Real decks have EJECT — it's also the only
way to free a decoded buffer and return a deck to "idle" for the next
track without touching its control positions.

## Decision
`⏏` in the transport calls `eject()`: if an auto-mix fade touches the
deck, it's cancelled with the same restore path as the Auto button;
then `stopPlayback()`, worklet loop-off, and every piece of track
state cleared — buffer, peaks, grid, key, cueIn, hot cues, loop
state (`loopOn`, `_prevLoop`, `_loopIn`, loop-len row), dropzone
text, BPM/key/bar/time readouts, play label, and the waveform canvas.
Control settings (tempo, EQ, FX, keylock, brake, slip) survive per
the hand-position doctrine — they are the operator's posture, not
part of the media.

## Consequences
- `pos()` already returns 0 on a null buffer, so all tick consumers
  are safe without guards.
