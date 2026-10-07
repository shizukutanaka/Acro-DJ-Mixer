# ADR-0332: The lazily-built cue bus reads its knobs at creation

## Context

`cueBus()` builds the phones graph (`phonesOut`, `pgmSend`) on first use.
Session restore (ADR-0158) replays saved `cuevol`/`cuemix` values as
`input` events at boot — but the `input` handlers only write the gain
nodes `if (phonesOut && ctx)` / `if (pgmSend && ctx)`, which are null
before the first cue. The nodes were then created with hardcoded
defaults (`phonesOut.gain = 1`, `pgmSend.gain = 0`): a restored 50 %
phones level or PGM blend silently rendered as 100 % / cue-only — the
knob said one thing, the bus did another. The mic chain already avoids
this trap by reading `document.getElementById('mic-gain').value` etc.
at node creation (ADR-0135/0151).

## Decision

At cue-bus creation, seed `phonesOut.gain` and `pgmSend.gain` from the
DOM knobs — the controls are the single source of truth for level
state, whether they hold defaults or restored values.

## Consequences

- Restored phones volume / cue mix take effect the first time the bus
  exists, matching what the knobs show.
- No change for the first-run path: fresh knobs hold `1`/`0`, the same
  values the old defaults hardcoded.
- Any later writer to the knobs still flows through the existing
  `input` handlers.
