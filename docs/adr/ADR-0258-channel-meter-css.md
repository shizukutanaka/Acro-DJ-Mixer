# ADR-0258: Channel meter rule actually closes inside it

## Status
Accepted.

## Context
The `.chm` channel-meter rule was malformed:

```css
.chm { height: 6px; margin-top: 4px; } background: var(--panel-2); border-radius: 5px; overflow: hidden; }
```

The block closed after `margin-top`; the track background,
border-radius and overflow-clipping were orphaned declarations
every browser dropped. Both channel meters rendered without the
`--panel-2` track or rounded/clipped ends.

## Decision
Move the three declarations back inside the rule. No other
changes — `.meter`/`i`/`b` selectors were already correct.

## Consequences
Channel meters show the dark track, rounded corners, and the
fill/peak tick clips to the rounded box as designed. Verified via
computed style: background `rgb(30,37,48)`, radius 5px,
overflow hidden.

## Round
Improvement round 258.
