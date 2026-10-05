# ADR-0228: Sampler pads persist in the library as marked records

## Context
Every piece of prepared state survived reloads — cues, loops,
memories, grid, key, stem — except the sampler pads, so a kit of
one-shots had to be rebuilt every session.

## Decision
Each loaded pad's audio is written as planar float PCM into a
`pad`-marked library record (name, gain, start offset travel
along); `padSave` keeps one record per slot and soft-deletes it
when the slot clears. A `!t.pad` guard keeps pad records out of
every track surface — rows, steppers, auto-mix pick, export,
import matching, file dedupe. `padsRestore` decodes them back
into slots on boot.

## Consequences
- A prepared kit of one-shots survives reloads like the rest of
  the prep doctrine, without polluting the track library.
