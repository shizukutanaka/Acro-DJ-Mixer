# ADR-0415: Escape cue-output device labels at the one unescaped sink

## Status

Accepted — 2026-10-14

## Context

Convergence-mode security gate: audit every `innerHTML` /
`insertAdjacentHTML` write for escaping. The library row renderer
escapes track names through `esc()` and the empty-state renderers
write static strings only — but the cue-output dropdown rebuild in
`populateCueOut` interpolated `d.deviceId` and `d.label` raw.

Both strings come from `enumerateDevices()`, i.e. OS/driver-supplied
names — not user text, so the blast radius is small (a device named
`R&D Audio` mis-renders; a hostile label could inject markup). It was
still the single unescaped interpolation left in the file.

## Decision

Wrap both interpolations in the existing `esc()` — no new helper, no
behaviour change for well-formed names.

## Consequences

Every `innerHTML` sink in the app now escapes externally-supplied
strings; the security-gate checklist item is unambiguously done.
