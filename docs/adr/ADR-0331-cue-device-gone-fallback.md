# ADR-0331: Falling back when the cue output device disappears

## Context

`refreshCueDevices` re-populates the cue-out `<select>` on every
`devicechange` and restores the previous selection with `sel.value = cur`.
When `cur` names a device that was just unplugged, the assignment selects
nothing (`sel.value` reads `''`) — but `cueAudio`'s `setSinkId` still
points at the dead deviceId. The headphone cue bus routes to a sink that
emits nowhere: the DJ's cans go silent mid-set with zero feedback — a
classic "silent failure" of exactly the class ADR-0208/0310/0314 hunted.

## Decision

After restoring `sel.value`, compare: if `cur` was non-empty and is no
longer among the enumerated options, treat the device as gone — select
system output, re-sink `cueAudio` to `''`, and surface a status line
("cue output gone — using system output"). A devicechange that only adds
devices leaves the selection untouched; a gone device fails toward
audible output rather than silence.

## Consequences

- Unplugging headphones mid-set drops cue monitoring to the default
  output with a visible notice — the DJ hears the change instead of
  discovering it in the next cue.
- A persisted deviceId that isn't present at boot is unaffected: `cur`
  is `''` there, so no false "gone" warning fires on load.
- The fallback is one-way per event: re-plugging the cans does not
  silently re-select them (a future `devicechange` just leaves the
  option available in the list for the user to re-pick).
