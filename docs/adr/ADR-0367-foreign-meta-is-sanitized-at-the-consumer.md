# ADR-0367: Foreign meta is sanitized where it is consumed

## Context
ADR-0360 validates import entries' top-level types, but arrays are
opaque — `cues: ["x", -3]` or `mem1: [4, 2]` still reach `load()`,
which trusted every element. A string `cueIn` became the cue point
(NaN seeks), non-numeric cue entries produced `fmt()` junk in pad
titles, and a reversed memory slot let `reloop()` arm a region with
`loopStart > loopEnd` — `pos()` then computed `x % (negative)`,
NaN-ing the playhead on both engines.

## Decision
Sanitize at the consumer (the same doctrine as empty-deck guards —
the method that dereferences defends itself):
- `meta.cueIn` must be a finite number; clamp to [0, duration],
  else the auto-cue value stands.
- `meta.cues` elements map through the same rule — bad entries
  become null, out-of-range clamp.
- `meta.mem1/mem2` must be [finite start, finite end] with
  end > start (`sanePair`), else null.
- `reloop()` refuses `en <= st` and past-end regions — it is also
  reachable with `_prevLoop`, not just restored slots.

## Consequences
A crafted or corrupted import can't arm a degenerate loop or plant
NaN in the position clock; every restored field is in-track by
construction.
