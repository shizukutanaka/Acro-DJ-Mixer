# ADR-0132: Sampler stop — alt-click kills a ringing pad

## Context
Once a one-shot is fired there were only two ways to silence it:
choke it by firing another pad (ADR-0121 — only works if you want a
*different* sound playing), or shift-click clear (ADR-0118 — throws
the loaded sample away). A plain "stop this voice, keep the sample"
gesture was missing; on hardware samplers holding/muting a pad does
exactly that.

## Decision
**Alt+click** on a sampler pad stops its playing source and unlits
the pad, leaving the buffer loaded — the pad is ready to re-fire.
Alt+click on an empty or already-stopped pad is a no-op (it does
*not* open the file picker).

## Consequences
- The pad modifier grammar is now complete: click = load/play,
  alt+click = stop voice, shift+click = clear slot.
- Alt+click on an empty pad no longer opens the picker — a defensive
  improvement, since "stop" intent should never surprise-load.
- Number-key firing (1–4) is unchanged; keys can't carry the alt
  modifier, which is fine — a stuck key-stop is not a real gap.
