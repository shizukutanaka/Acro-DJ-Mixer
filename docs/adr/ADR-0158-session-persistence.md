# ADR-0158: Session persistence

## Context
A reload nuked every knob and toggle — crossfader, master, cue mix,
EQ, filter, FX selection, sampler controls, mono/split. Real mixers
keep their surface; a browser refresh shouldn't zero the rig.

## Decision
`localStorage['acro-session']` snapshots element state on any
input/change/click (400 ms throttle). On load it's replayed through
the same input/change/click handlers, so restored values drive
nodes exactly like live input — one code path, no drift. Toggles
replay a click only on class mismatch, so flags flip through the
real handlers. Mono/Split cue became class-driven state (the node
applies the class when `audio()` builds), which is what makes them
persistable at all.

## Consequences
- Reload keeps the whole mixer surface; tracks still load fresh.
- Persisted state = DOM truth, not a second copy of JS flags —
  anything the UI can show, the session can restore.
- `try/catch` around both directions: private-mode localStorage
  failure degrades to "state resets", never a broken app.
