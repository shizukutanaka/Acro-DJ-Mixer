# ADR-0145: Resample the armed loop into a sampler pad

## Context
The sampler loads one-shots from files only. The phrase a DJ most
often wants as a one-shot — the loop already armed on a deck —
needed exporting audio, trimming it, and re-importing: impossible
inside a single-file app.

## Decision
Shift+click on an **empty** pad resamples in place: the deck that
has an armed loop (preferring the one actually playing) contributes
`buffer[loopStart..loopEnd]` to a new `AudioBuffer` by direct
channel copy — no file dialog, no disk, lossless at the context's
sample rate. The pad is then an ordinary one-shot: click fires it
through the shared `smpGain` bus with choke behaviour, alt stops,
shift clears. Shift+click on an occupied pad still clears.

## Consequences
- "Grab that loop" is now a one-gesture move: arm a loop, shift a
  pad, stab it into the blend — the classic resample workflow from
  SP-404s and Serato Stems without leaving the page.
- No armed loop or a loop < ~6 ms shows a status hint; nothing
  fires and nothing clears by accident.
