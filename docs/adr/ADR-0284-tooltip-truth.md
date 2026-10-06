# ADR-0284: Tooltips say the true gesture set

## Status
Accepted.

## Context
Two tooltip drifts let titles lie about what right-click does:

- Hot-cue pads claimed "shift-click or right-click clears" in the
  markup and `clearPad`'s reset — but right-click has *previewed*
  the cue since ADR-0161; only shift-click clears. `padCue`'s set
  title also never mentioned the preview.
- `smpSlots` clear reset the sampler title to a string missing
  "hold = gate" and "right-click previews", which the initial title
  had.

## Decision
All six title strings now state the full grammar: hot cues read
"click sets a marker, click jumps, shift-click clears, right-click
previews"; the sampler reset matches its initial title verbatim.

## Consequences
Hover text is again a reliable gesture reference — no undiscoverable
verbs, no phantom clear gesture.

## Round
Improvement round 286.
