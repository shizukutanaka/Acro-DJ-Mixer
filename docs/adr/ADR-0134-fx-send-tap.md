# ADR-0134: FX send tap — pre/post fader select

## Context
All wet sends (echo, flanger, reverb) tap `filter` — pre-fader. That
is fixed in stone: drop the crossfader past a deck and its echo tail
keeps ringing (the classic echo-out), but you can never get the
opposite behaviour — sends that die with the side, the "fader FX"
technique where closing the crossfader slams the effect shut.

## Decision
A `pre/post` select on the FX row. `setFxTap(post)` rewires the three
send edges (`delay`, `flDelay`, `verb`) from `filter` to `xfGain` —
the crossfader leg — or back. Post-fade sends see the deck *through*
the crossfader position and the crusher, so the tail dies with the
side and a crushed signal feeds a dirty echo. Default `pre` keeps
every earlier round's behaviour.

Rewire mid-effect is safe: `disconnect`/`connect` moves the source
edge; already-cycling feedback content keeps looping on the delay
lines, so the tap can be flipped mid-set without silencing tails.

## Consequences
- Both canonical send behaviours available: echo-out tails (pre) and
  fader-slammed FX (post).
- Noise FX and the inline trans/crush processors are unaffected —
  they aren't sends.
- One more select on the FX row; labelled `pre`/`post` to match the
  mixer's jargon.
