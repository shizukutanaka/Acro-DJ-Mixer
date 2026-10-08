# ADR-0399: An armed loop must show armed — the emergency loop lights the Loop button too

## Status

Accepted (2026-10-04, round 400)

## Context

Every site that sets `loopOn = true` performs the same two UI writes
alongside the bookkeeping: `loopBtn.classList` gains `on` (the button
is the armed-state indicator *and* the exit control) and
`loopLenEl.hidden` clears (the ½/2×/◂▸ toolbar is where loop
adjustments live). Five of the six arm sites do both — `toggleLoop`
(both arms), `reloop`, `stopRoll`'s restore, the `_savedLoop` restore.

The emergency loop (tick-armed tail rescue, ADR-0195) did neither. Its
`status('Emergency loop')` message expires after 5 s, leaving only the
waveform shading as evidence — while the Loop button, the very control
a user presses to exit the loop, sat dark and the adjust toolbar
stayed hidden. An armed loop with no armed affordance: a user hitting
the tail could not see *that* the deck was looped, nor reach the
halve/move gestures every other armed loop offers.

(`startRoll` also leaves `loopBtn` dark while `loopOn` — deliberate:
the Roll button owns that indication; a roll is not a user-armed
loop.)

Persistence is intentionally *not* added: `tagLib` records user prep,
and auto-persisting a rescue region would overwrite the track's saved
loop with bounds nobody chose. Exiting an emergency loop still writes
`loop: null`, which only clears a record that was already null or
user-exited — no clobber.

## Decision

The emergency arm performs the same two UI writes as every other
`loopOn = true` site:

```js
d.applyLoop();
d.loopBtn.classList.add('on');   // exit control shows armed
d.loopLenEl.hidden = false;      // halve/double/move affordances
```

## Consequences

- The armed state of an auto-armed loop is visible for as long as it
  lasts, not for 5 s.
- Loop exit and adjustment behave identically whether the loop was
  armed by hand or by the rescue — one affordance contract.

## Verification

`~/smokeapp/t_emloopui.mjs`: playing into the tail window arms
`loopOn`/`_emLoop` **and** lights `loopBtn` + shows `loopLenEl`;
exiting via `toggleLoop()` clears both, matching the manual-arm
contract. `tests/smoke.mjs` passes; zero page errors.
