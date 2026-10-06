# ADR-0321: Pointer-clicks release button focus

## Context

A mouse-clicked `<button>` keeps DOM focus, so a later Space/Enter
press natively re-clicks it. On a two-stage guard that is the
confirm: click Delete to arm 'sure?', press Enter for the filter's
top match — and the track is gone. Same footgun on every armed
eject/load control.

## Decision

A document-level `click` listener blurs the clicked button, gated on
`e.detail > 0`. Pointer-originated clicks carry a click count;
keyboard activation (Tab + Enter/Space) reports `detail === 0`, so
focus is released for mouse users while Tab+Enter accessibility —
the path the aria-labels from ADR-0236 serve — is untouched.

## Consequences

- Space/Enter can no longer silently re-fire the last-clicked
  button, which closes the confirm-by-accident class on every
  two-stage guard at once.
- Keyboard navigation is unaffected: detail-0 clicks keep focus.
