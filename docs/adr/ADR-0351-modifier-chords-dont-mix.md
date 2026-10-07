# ADR-0351: Browser/OS chords don't drive the mixer

## Context
The global `keydown` map fired deck actions on `e.key` regardless of
modifiers. Every Ctrl/Cmd/Alt chord a user presses for the browser or OS
also drove the surface:

- `Cmd/Ctrl+R` — reloads the page AND toggles a loop (`r`)
- `Cmd+W` — closes the tab AND toggles headphone cue (`w`)
- `Cmd/Ctrl+1-4` — switches tabs AND fires sampler pads (`1-4`)
- `Cmd+,` — opens settings AND fires deck B pad 3 (`,`)
- `Cmd/Ctrl+←/→` — history navigation AND moves the crossfader
- `Alt+<key>` on Windows — menu accelerators AND deck verbs

No keymap entry uses Ctrl/Cmd/Alt — the modifier grammar is
pointer-side (shift/alt-click); Shift is a keymap modifier
(shift+pad = clear) and stays.

## Decision
Early-return in the document `keydown` handler when
`e.ctrlKey || e.metaKey || e.altKey`, placed after the typing/focus
guards and before the help/Escape/switch handling — so no chord can
double-fire a mixer action alongside its browser meaning.

## Consequences
Browser and OS shortcuts stop leaking into the mix; the modifier-free
keymap is unchanged.
