# ADR-0305: Waveforms ignore non-primary buttons

## Context

`pointerdown` fires for every mouse button, and neither waveform
handler gated it — a right-drag on the main wave scrubbed the
playhead (or dragged a hot-cue marker), and on the mini overview it
seeked, *while* the browser context menu popped over the deck.
Same button-gate class as the Cue preview fix in ADR-0293.

## Decision

Both `pointerdown` handlers return early unless `e.button === 0`,
and both canvases `preventDefault` `contextmenu` — a stray
right-click mid-set can no longer move the playhead, move a cue,
or cover the deck with a browser menu.

## Consequences

- Scrub, jog and mini-seek are left-button only, matching every
  other gesture surface in the app.
