# ADR-0185: Momentary mono check on the Phones row

## Context
The Mono button latched only: peeking at mono compatibility (club
PAs sum to one channel) cost two clicks and a trip back to stereo.
Every other "hold to audition" control on the surface already runs
the tap-latch / hold-momentary grammar.

## Decision
Holding Mono ≥250 ms folds the master to one channel only while
held; releasing restores stereo and suppresses the trailing click.
Tap still latches; holding while already latched changes nothing —
the click then unlatches as before. `setMono(on)` centralizes class
+ `channelCount` so the node and button can't drift; the class
still drives build-time apply, keeping session persistence intact.
Momentary grammar site #9.

## Consequences
- Mono compatibility becomes a one-finger check mid-set.
- No new state: `_mom`/`_suppress` live on the button element like
  the other eight sites.
