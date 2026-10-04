# ADR-0006: Beat-Grid-Quantized Loop

## Status
Accepted

## Context

Loops are the second-most-used performance control on modern decks
(after EQ). The naive version — free in/out points — is what cheap decks
do; it forces the user to hunt for a clean loop boundary. We already own
the beat grid (ADR-0002), so the AI-era answer is a **grid-quantized
loop**: one click captures an exact bar.

First-principles requirements:

- One click → a musically-correct loop (4 beats = one bar, the DJ
  default).
- No new timing machinery — the engines must wrap playback themselves
  (UI-side looping would glitch).
- Identical semantics on both engines (worklet + `file://` fallback).

Options:

1. **Engine-side wrap** — worklet: jump `rPos`/`inPos` back to
   `loopStart`; BufferSource: native `loop/loopStart/loopEnd` fields.
   Sample-accurate, glitch-free.
2. **UI-side re-seek on `pos` messages** — up to ~86 ms of overshoot per
   cycle. Audibly wrong. Rejected.
3. **A second buffer pre-sliced to the loop** — avoids wrap logic but
   doubles decode memory and complicates seeking. Rejected.

## Decision

Engine-side wrap behind one `Loop` button per deck:

- `toggleLoop()` computes `start` = the grid beat at/before `pos()`,
  `end` = `start + 4·beatLen` (clamped to the track tail; <1 beat of
  room → refuse with a status line).
- Worklet: `loop` port message carries bounds in samples; passthrough
  wraps `rPos`, WSOLA wraps `inPos` (in input space — the OLA tail
  smooths the seam), and a pre-generation wrap guards the tail-edge
  stall. Track-end → `ended` is suppressed while looping.
- BufferSource: `loop`, `loopStart`, `loopEnd` set on the live source and
  on every source created in `play()`.
- `pos()` mirrors the wrap arithmetically so the playhead (and every
  `pos()` consumer) sees the engine's true position.
- Waveform highlights the loop region in the accent green; the button
  lights with the existing `.on` style.
- Seeking **outside** the armed region exits the loop — the
  deck-standard escape, and it keeps the `pos()` wrap arithmetic exact
  on BufferSource (where a start position past `loopEnd` plays to the
  track end first).

## Consequences

- The wrap is sample-accurate on the grid, but the grid itself has the
  ODF's ~12 ms phase resolution — a loop set mid-track can sit a few ms
  off a transient. Same accuracy class as entry-level hardware.
- Loop length is fixed at one bar; half/double-length cycling is a
  deliberate future step (right-click or press-and-hold), deferred to
  keep the control at one click.
- `syncTo`'s phase slip can land outside an armed loop and exit it —
  consistent with the seek-out rule.

## Rejected alternatives

- Free in/out points: doubles the interaction cost and adds a failure
  mode (off-beat loops) for no benefit while the grid exists.
- UI-driven re-seek looping: quantization noise up to the pos-message
  interval; audibly broken.
