# ADR-0322: Pointer-clicks release checkbox focus too

## Context

ADR-0321 blurs pointer-clicked buttons so a later Space/Enter can't
re-fire them — but `input[type=checkbox]` shares the footgun and
wasn't covered. The app has exactly one (`#smp-loop`): click it,
press Space for anything else, and loop mode silently flips back.

## Decision

A separate document-level `click` listener blurs a clicked checkbox,
same `e.detail > 0` gate (keyboard activation reports 0, so
Tab+Space keeps working). Kept as its own listener rather than
extending the button one — the button rule is deliberate about
*confirm* guards; this one is about toggle state.

## Consequences

- The last pointer-driven surface — buttons and the sampler loop
  checkbox — no longer hijacks later Space presses.
