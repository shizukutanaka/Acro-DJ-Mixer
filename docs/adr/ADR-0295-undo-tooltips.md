# ADR-0295: Tooltips name the right-click undo where it lives

## Context

ADR-0294 documented the undo grammar in the `?` overlay, but the
per-control tooltips still misdescribed or omitted it:

- An empty hot-cue pad's title said "right-click previews" — on an
  empty pad that gesture restores the last cleared cue; there is
  nothing to preview.
- The Cue button's generated title never mentioned that right-click
  undoes the last `shift+click` set.
- The dropzone had no title at all, so the eject undo was
  undiscoverable at the point of use.
- The `.bpmctl` cluster had no title, so the grid-write undo was
  likewise invisible.

(Reloop is deliberately untouched: its title is dynamic, and
ADR-0220 already covers slot visibility there.)

## Decision

Name the gesture at the point of use, in the same telegraphic style
as every other title: "right-click = undo …". The empty-pad string
now describes what an empty pad actually does rather than what a
set pad would.

## Consequences

- Tooltip conventions stay uniform: if a control carries a
  right-click meaning, its title says so.
- Set-pad titles are unchanged — "right-click previews" remains
  correct there.
