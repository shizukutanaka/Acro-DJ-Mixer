# ADR-0042: Semitone transpose — pitch shift inside WSOLA

## Status
Accepted (2026-10-04)

## Context
ADR-0004 detects each track's key and ADR-0011 highlights library rows
that mix harmonically with the playing deck (same Camelot number, ±1
hour, relative major/minor). But when the next track is *almost*
compatible — off by a semitone or two — there is no remedy: tempo is
locked by the beatmatch, so the only remaining degree of freedom is the
key itself. Real gear exposes this as key shift / master tempo transpose.

## Decision
A `−`/`+` pair beside the detected-key readout transposes the deck in
semitone steps, range ±6, always live (`this.st` shown as `±0`/`+Nst`).

Implementation stays inside the WSOLA worklet (ADR-0003): a `pitch`
ratio multiplies the *read* index when a frame is emitted —
`sy[i] += win[i] * inp[start + i*pitch]` with linear interpolation —
so the overlap-add synthesis hop is untouched and tempo holds while
pitch moves. The correlation-search high bound shrinks to
`len - W*pitch` when pitch > 1 so frames never read past the buffer.
A `pitch` port message (parallel to `rate`) carries `2^(st/12)`.

Buffer-engine (file://) decks can't do it — the message is ignored and
the status line says transpose needs key lock. Transpose is deck state,
not persisted to the library: it is a mix-local correction, not a
property of the track.

## Consequences
- Harmonic mixing becomes actionable: an off-key suggestion can be made
  compatible instead of skipped.
- ±6 semitones before artifacts dominate (WSOLA formant shift) matches
  hardware practice.
- `st` is not reset on track load — hand-position doctrine, the knob
  stays where the DJ left it.
