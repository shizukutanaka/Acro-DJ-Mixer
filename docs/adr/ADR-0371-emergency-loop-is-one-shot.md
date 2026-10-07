# ADR-0371: The emergency loop arms once per approach

## Context
The tick loop armed a 4-beat emergency loop whenever a gridded,
loop-less, playing track entered its last four beats. Exiting that
loop while the playhead was still in the window re-armed it on the
next frame — a deck once emergency-looped could never be let out;
only eject/load or a scrub far enough back ended it.

## Decision
`_emLoop` latches on arm and suppresses re-arming until the playhead
leaves the window (0.5 s margin) and approaches again — an informed
exit ends the track naturally. The latch resets in `load()`/`eject()`
beside the other per-track fields.

## Consequences
The safety net still catches a track running out, but a deliberate
Loop press in the tail is honoured instead of fought.
