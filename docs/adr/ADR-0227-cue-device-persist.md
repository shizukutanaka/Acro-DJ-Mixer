# ADR-0227: Cue output device persists across reloads

## Context
Session persistence (ADR-0158) covers the whole mixer surface
except the headphone cue device — every reload dropped the DJ's
picked cans back to system output.

## Decision
`sessSave` carries `cueout` with the other mix-level controls;
because the restore block runs before `enumerateDevices`
resolves, `refreshCueDevices` re-applies the saved deviceId
after options populate (deviceIds are stable per origin). An
unknown persisted id degrades to system output.

## Consequences
- Headphone routing survives reloads like every other surface
  control.
