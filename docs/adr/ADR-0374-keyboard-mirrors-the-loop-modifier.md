# ADR-0374: The keyboard mirrors the Loop button's shift modifier

## Context
The Loop button runs two grammars: click = beat-grid loop,
shift+click = free-size IN/OUT arming. The `r`/`u` keys called
`toggleLoop()` with no argument — the free-size loop was the only
looping gesture a keyboard mix couldn't reach (MIDI note 48/49 maps
to the same plain call).

## Decision
`r`/`u` pass `e.shiftKey` to `toggleLoop(manual)`, exactly the
button's modifier contract: plain press = quantized loop,
shift+press = IN marker, second shift+press = OUT.

## Consequences
Every loop gesture is now reachable without the pointer: auto loop,
loop-back, free-size, reloop (still button/MIDI-only), and the
keyboard grammar matches the click grammar it replaces.
